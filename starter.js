#!/usr/bin/env node

var path = require('path');
var mkdirp = require('mkdirp');

var yargs = require('yargs');
var async = require('async');
var extend = require('extend');

process.setMaxListeners(100);

var argv = yargs
.alias('h', 'help')
.describe('h', 'show help')
.alias('d', 'development')
.describe('d', 'run in development mode')
.alias('m', 'migrate-db')
.describe('m', 'migrate database before running')
.alias('a', 'prepare-assets')
.describe('a', 'prepare assets before running (goes with production run)')
.alias('p', 'production')
.describe('p', 'run in production mode (add also -d to have production debug)')
.argv;

if(argv.h) {
  return yargs.showHelp();
}

if(!argv.d && !argv.p) {
  return yargs.showHelp();
}

var env = process.env;

if(argv.p) {
  env.RAILS_ENV = 'production';
  if(argv.d) {
    env.PRODUCTION_DEBUG = '1';
  }
  env.SECRET_KEY_BASE = 'x';
  env.DEVISE_SECRET_KEY = 'x';
} else if(argv.d) {
  env.RAILS_ENV = 'development';
}


var BASE_DIR = env.BASE_DIR || __dirname;

env.PORT = env.PORT || 3000;
env.RAILS_PORT = env.RAILS_PORT || 60000;
env.RAILS_HOST = "localhost";

env.HDD_DIR = env.HDD_DIR || path.join(BASE_DIR, 'hdd');
env.ISO_DIR = env.ISO_DIR || path.join(BASE_DIR, 'iso');

var workingScriptCommand = false;

function checkScript(cb) {
  var output = child_process.spawn('script', ['--help']);
  var allData = "";
  output.stdout.on('data', function(data) {
    allData += data.toString('utf8');
  });
  output.stderr.on('data', function(data) {
    allData += data.toString('utf8');
  });
  output.once('exit', function() {
    setTimeout(function() {
      allData.split(/\n/).forEach(function(line) {
        if(line.match(/-e/) && line.match(/--return/))
          workingScriptCommand = true;
      });;
      cb();
    }, 0);
  });
  output.once('error', function() {
    cb();
  });

}


function spawn(cwd, command, options) {
  chSpawn = child_process.spawn;

  command = command.replace('./bin/spring ', '');

  var proc;

  if(workingScriptCommand) {
    proc =
      chSpawn('script', ['/dev/null', '-e', '-q', '-c', command], extend({}, {
      env: env,
      cwd: cwd
    }, options));
  } else {
    proc = chSpawn('bash', ['-c', command], extend({}, {
      env: env,
      cwd: cwd
    }, options));
  }
  var exitHandler = function() {
    proc.kill('SIGKILL');
  };
  proc.once('exit', function() {
    process.removeListener('exit', exitHandler);
  });
  process.on('exit', exitHandler);
  ['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(function(signal) {
    process.once(signal, function() {
      exitHandler();
      process.exit();
    });
  });
  return proc;
}

function forceExit() {
  process.emit('exit');
}

require('virtkick-proxy');

var child_process = require('child_process');

var split = require('split');

var webappDir = env.WEBAPP_DIR || path.join(BASE_DIR, 'webapp');
var backendDir = env.BACKEND_DIR || path.join(BASE_DIR, 'backend');


console.log("RAILS_ENV=" + env.RAILS_ENV);
console.log("webapp location:", webappDir);
console.log("backend location:", backendDir);


function bindOutput(proc, label, exitCb) {
  proc.stdout.pipe(split()).on('data', function(line) { process.stdout.write('['+label+'] ' + line + '\n') });
  proc.stderr.pipe(split()).on('data', function(line) { process.stderr.write('['+label+'] ' + line + '\n') });
  proc.on('error', forceExit);
  if(exitCb) {
    proc.on('exit', function(code) {
      console.log("Process", label, "exit:", code);
      exitCb(code);
    });
  }
}

function runEverything() {

  var rails = spawn(webappDir, 'bundle exec ./bin/spring rails s -p ' + env.RAILS_PORT);

  bindOutput(rails, 'rails', forceExit);

  var workerN = 0;
  function createWorker() {
    var worker = spawn(webappDir, 'bundle exec ./bin/spring rake jobs:work');
    bindOutput(worker, 'work' + workerN, forceExit);
    workerN += 1;
    return worker;
  }

  var workerCount = env.WORKER_COUNT || 2;
  workerCount = Math.min(require('os').cpus().length, Math.max(workerCount, 1));

  for(var i = 0;i < workerCount;++i) {
    createWorker();
  }


  var backend = spawn(backendDir, 'python2 manage.py runserver');
  bindOutput(backend, 'virtm', forceExit);
}

var tasks1 = [];
var tasks2 = [];

var serialTasks = [[checkScript], tasks1, tasks2];


if(argv.i) {
  tasks1.push(function(cb) {
    var proc = spawn(webappDir, 'bundle install');
    bindOutput(proc, 'install', cb);
  });

  tasks1.push(function(cb) {
    async.series([
      function(cb) {
        var proc = spawn(backendDir, 'pip install --user -r requirements.txt');
        bindOutput(proc, 'backend:install', cb);
      },
      function(cb) {
        var proc = spawn(backendDir, 'python2 ./manage.py syncdb --noinput');
        bindOutput(proc, 'backend:syncdb', cb);
      },
      function(cb) {
        var proc = spawn(backendDir, 'python2 ./manage.py collectstatic --noinput');
        bindOutput(proc, 'backend:collectstatic', cb);
      }
    ], cb);
  });


} else if(argv.u) {
  tasks1.push(function(cb) {
    var proc = spawn(webappDir, 'bundle update');
    bindOutput(proc, 'update', cb);
  });
}


if(argv.m) {
  tasks2.push(function(cb) {
    var proc = spawn(webappDir, 'bundle exec ./bin/spring rake db:migrate');
    bindOutput(proc, 'proc', cb);
  });
}

if(argv.c) {
  tasks2.push(function(cb) {
    var proc = spawn(webappDir, 'bundle exec ./bin/spring rake assets:clean');
    bindOutput(proc, 'assets:clean', cb);
  });
}


if(argv.a) {
  tasks2.push(function(cb) {
    var proc = spawn(webappDir, 'bundle exec ./bin/spring rake assets:precompile');
    bindOutput(proc, 'assets', cb);
  });
}

var yaml = require('js-yaml');
var fs = require('fs');

async.eachSeries(serialTasks, function(tasks, cb) {
  async.parallel(tasks, cb);
}, function(err) {
  if(err) {
    return console.log("One of required tasks has failed")
  }
  runEverything();
  if(!process.env.NO_DOWNLOAD) {
    downloadIsos();
  }
});

function downloadIsos() {
  if(fs.existsSync(path.join(__dirname, ".isos-done"))) {
    console.log("All isos are downloaded, delete .isos-done to redo")
    return;
  }
  console.log("Starting download of ISO files")

  var isos = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './webapp/app/models/plans/iso_images.yml')), {});

  async.eachLimit(isos, 4, function(iso, cb) {
    if(!iso.mirrors) {
      console.log("Iso", iso.name, "does not have mirrors");
      return cb();
    }

    console.log('[wget:' +iso.id+'] Starting download of iso: '+ iso.file);
    var wget = spawn("./", "ssh -o \"StrictHostKeyChecking no\" virtkick@localhost wget -q -c -P iso \"" + iso.mirrors[0] + "\"");
//    var wget = spawn("./", "ssh virtkick@localhost curl -s -C - -o \"" + iso.file + "\" \"" + iso.mirrors[0] + "\"")
    bindOutput(wget, '[wget:' +iso.id+']', cb);

  }, function(err) {
    if(err) {
      console.error("Not all isos could have been downloaded, will retry on next start");
      return;
    }
    console.log("All isos downloaded");
    fs.writeFileSync(path.join(__dirname, ".isos-done"), "DONE");
  });
  


}


