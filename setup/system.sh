#!/bin/sh
if ! [ -e .system-setup ];then
  # assure make
  if ! [ -e ~/.ssh/id_rsa.pub ];then
    ssh-keygen -b 4096 -q -N '' -f .ssh/id_rsa
  fi
  echo 'I am about to create user "virtkick" in group "kvm" and add your public ssh key to allow passwordless login'
  sudo bash -c "
  if ! getent passwd virtkick; then 
    useradd virtkick -m -c \"VirtKick orchestrator\" -g kvm -G libvirt
  fi && 
  mkdir -p ~virtkick/{.ssh,hdd,iso} &&
  chown -R virtkick:kvm ~virtkick &&
  chmod 750 ~virtkick &&
  cat > ~virtkick/.ssh/authorized_keys" < ~/.ssh/id_rsa.pub
  ssh -o "StrictHostKeyChecking no" virtkick@localhost whoami > /dev/null
  touch .system-setup
fi
