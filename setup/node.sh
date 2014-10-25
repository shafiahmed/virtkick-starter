#!/bin/sh
export NVM_DIR=$(pwd)/.nvm

if ! [ -e "$NVM_DIR/installed" ];then
  rm -rf "$NVM_DIR"
fi

if ! [ -e "$NVM_DIR" ];then
#	(git clone https://github.com/creationix/nvm.git .nvm && cd .nvm && git checkout `git describe --abbrev=0 --tags`)
  echo "Downloading Node.JS to local directory"
  (mkdir -p $NVM_DIR && cd .nvm && wget --quiet https://raw.githubusercontent.com/creationix/nvm/master/nvm.sh)
	. .nvm/nvm.sh
  nvm install 0.10.32
  touch "$NVM_DIR/installed"
fi
. .nvm/nvm.sh
nvm use 0.10 > /dev/null
