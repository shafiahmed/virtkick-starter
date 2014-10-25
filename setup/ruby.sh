export RVM_DIR="$(pwd)/.rvm"
unset GEM_HOME
if [ ! -d "$RVM_DIR" ];then
	mkdir -p "$RVM_DIR"
	export rvm_user_install_flag=1
	export rvm_path="$RVM_DIR"
	curl -sSL https://get.rvm.io | bash -s -- --ignore-dotfiles --autolibs=rvm_pkg
	. .rvm/scripts/rvm
	rvm install 2.1.3
	rvm alias create default 2.1.3
fi
. .rvm/scripts/rvm
export PATH="$RVM_DIR/bin:$PATH"



