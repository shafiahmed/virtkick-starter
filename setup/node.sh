#!/bin/sh
export NVM_DIR=.nvm
if ! [ -e $NVM_DIR ];then
#	(git clone https://github.com/creationix/nvm.git .nvm && cd .nvm && git checkout `git describe --abbrev=0 --tags`)
  echo "Downloading Node.JS to local directory"
  (mkdir -p $NVM_DIR && cd .nvm && wget --quiet https://raw.githubusercontent.com/creationix/nvm/master/nvm.sh)
	. .nvm/nvm.sh
  nvm install 0.10.32
fi
. .nvm/nvm.sh
nvm use 0.10 > /dev/null || (echo "Cannot load Node 0.10 from .nvm/nvm.sh" 1>&2 && exit 1)
