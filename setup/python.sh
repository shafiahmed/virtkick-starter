export PYENV_ROOT="$(pwd)/.pyenv"
export PATH="$PYENV_ROOT/bin:$PYENV_ROOT/shims:$PATH"
if ! [ -e "$PYENV_ROOT" ];then
  git clone git://github.com/yyuu/pyenv.git .pyenv
  pyenv install 2.7.6
  pyenv rehash
  git clone https://github.com/yyuu/pyenv-virtualenv.git .pyenv/plugins/pyenv-virtualenv
  pyenv virtualenv 2.7.6 virtkick
  pip install libvirt-python-$LIBVIRT_VERSION
fi
eval "$(pyenv init -)"
pyenv activate virtkick
