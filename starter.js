#!/usr/bin/env node

var path = require('path');
var mkdirp = require('mkdirp');

var yargs = require('yargs');
var async = require('async');
var extend = require('extend');

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

mkdirp.sync(env.HDD_DIR);
mkdirp.sync(env.ISO_DIR);

function spawn(cwd, name, arguments, options) {
  chSpawn = child_process.spawn;

  var proc = chSpawn(name, arguments, extend({}, {
    env: env,
    cwd: cwd
  }, options))
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

  var rails = spawn(webappDir, 'bundle', ['exec', 'rails', 's', '-p', env.RAILS_PORT]);

  bindOutput(rails, 'rails', forceExit);

  var workerN = 0;
  function createWorker() {
    var worker = spawn(webappDir, 'bundle', ['exec', 'rake', 'jobs:work']);
    bindOutput(worker, 'work' + workerN, forceExit);
    workerN += 1;
    return worker;
  }

  var workerCount = env.WORKER_COUNT || 2;
  workerCount = Math.min(require('os').cpus().length, Math.max(workerCount, 1));

  for(var i = 0;i < workerCount;++i) {
    createWorker();
  }


  var backend = spawn(backendDir, env.PATH_TO_PYTHON || 'python2', ['manage.py', 'runserver']);
  bindOutput(backend, 'virtm', forceExit);
}

var tasks1 = [];
var tasks2 = [];

var serialTasks = [tasks1, tasks2];


if(argv.i) {
  tasks1.push(function(cb) {
    var migrate = spawn(webappDir, 'bundle', ['install']);
    bindOutput(migrate, 'install', cb);
  });

  tasks1.push(function(cb) {
    async.series([
      function(cb) {
        var migrate = spawn(backendDir, 'pip', ['install', '-r', 'requirements.txt']);
        bindOutput(migrate, 'backend:install', cb);
      },
      function(cb) {
        var migrate = spawn(backendDir, 'python2', ['./manage.py', 'syncdb']);
        bindOutput(migrate, 'backend:syncdb', cb);
      },
      function(cb) {
        var migrate = spawn(backendDir, 'python2', ['./manage.py', 'collectstatic']);
        bindOutput(migrate, 'backend:collectstatic', cb);
      }
    ], cb);
  });


} else if(argv.u) {
  tasks1.push(function(cb) {
    var migrate = spawn(webappDir, 'bundle', ['update']);
    bindOutput(migrate, 'update', cb);
  });
}


if(argv.m) {
  tasks2.push(function(cb) {
    var migrate = spawn(webappDir, 'bundle', ['exec', 'rake', 'db:migrate']);
    bindOutput(migrate, 'migrate', cb);
  });
}

if(argv.c) {
  tasks2.push(function(cb) {
    var migrate = spawn(webappDir, 'bundle', ['exec', 'rake', 'assets:clean']);
    bindOutput(migrate, 'assets:clean', cb);
  });
}


if(argv.a) {
  tasks2.push(function(cb) {
    var migrate = spawn(webappDir, 'bundle', ['exec', 'rake', 'assets:precompile']);
    bindOutput(migrate, 'assets', cb);
  });
}


async.eachSeries(serialTasks, function(tasks, cb) {
  async.parallel(tasks, cb);
}, function(err) {
  if(err) {
    return console.log("One of required tasks has failed")
  }
  runEverything();
});



