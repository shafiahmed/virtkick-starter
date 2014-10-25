export PYENV_ROOT="$(pwd)/.pyenv"
export PATH="$PYENV_ROOT/bin:$PYENV_ROOT/shims:$PATH"

if ! [ -e "$PYENV_ROOT/installed" ];then
	rm -rf "$PYENV_ROOT"
fi

if ! [ -e "$PYENV_ROOT" ];then
	git clone git://github.com/yyuu/pyenv.git .pyenv
	pyenv install 2.7.6
	pyenv rehash
	git clone https://github.com/yyuu/pyenv-virtualenv.git .pyenv/plugins/pyenv-virtualenv
	pyenv virtualenv 2.7.6 virtkick
	eval "$(pyenv init -)"
	pyenv activate virtkick
	cd .pyenv
	wget ftp://xmlsoft.org/libxml2/libxml2-2.7.2.tar.gz
	tar -xzvf libxml2-2.7.2.tar.gz
	cd libxml2-2.7.2/
	./configure --with-python=$(which python)
	make -j4
	cd python/
	python setup.py install
	cd ../../..
	pip install libvirt-python==$LIBVIRT_VERSION
	touch "$PYENV_ROOT/installed"
else
	eval "$(pyenv init -)"
	pyenv activate virtkick
fi
