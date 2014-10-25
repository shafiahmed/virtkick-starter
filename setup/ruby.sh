export RVM_DIR="$(pwd)/.rvm"

if ! [ -e "$RVM_DIR/installed" ];then
  rm -rf "$RVM_DIR"
fi

unset GEM_HOME # unset any previous ruby setup
if [ ! -d "$RVM_DIR" ];then
	mkdir -p "$RVM_DIR"
	export rvm_user_install_flag=1
	export rvm_path="$RVM_DIR"
	curl -sSL https://get.rvm.io | bash -s -- --ignore-dotfiles --autolibs=rvm_pkg
	. .rvm/scripts/rvm
	rvm install 2.1.3
	rvm alias create default 2.1.3
  touch "$RVM_DIR/installed"
fi
. .rvm/scripts/rvm
export PATH="$RVM_DIR/bin:$PATH"



