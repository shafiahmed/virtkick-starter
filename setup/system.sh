#!/bin/sh
if ! [ -e .system-setup ];then
	if ! [ -e ~/.ssh/id_rsa.pub ];then
		ssh-keygen -b 4096
	fi
	echo 'I am about to create user "virtkick" in group "kvm" and add your public ssh key to allow passwordless login'
	sudo bash -c "
	groupadd kvm 2> /dev/null;
	groupadd libvirt 2> /dev/null;
	useradd virtkick -m -c \"VirtKick orchestrator\" -g kvm -G libvirt && 
	mkdir -p ~virtkick/{.ssh,hdd,iso} &&
	chown -R virtkick:kvm ~virtkick &&
	chmod 750 ~virtkick &&
	cat >> ~virtkick/.ssh/authorized_keys" < ~/.ssh/id_rsa.pub
	touch .system-setup
fi