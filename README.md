# VirtKick. Take Cloud Back.

[![GPA](https://img.shields.io/codeclimate/github/virtkick/virtkick-starter.svg?style=flat-square)](https://codeclimate.com/github/virtkick/virtkick-starter)
[![Dependencies status](http://img.shields.io/gemnasium/virtkick/virtkick-starter.svg?style=flat-square)](https://gemnasium.com/virtkick/virtkick-starter)
[![Gratipay](https://img.shields.io/gratipay/virtkick.svg?style=flat-square)](https://gratipay.com/virtkick/)

VirtKick is a simple, open source orchestrator.
Managing virtual machines or Docker containers has never been easier.

That's the VirtKick Starter. It will allow you to start using VirtKick with a single click.

This is a heavy work in progress and not yet one-click install. Don't judge - it will be improved! Please [report an issue](https://github.com/virtkick/virtkick) if you face any problems. We need your help to make it bullet-proof. Thanks! :-)

## Distro specific prerequisites

### Ubuntu 14.04

Most things are already handled by `virtkick-start`, you only need Git.
```
sudo apt-get install git
```

### Other

Over time we plan to add streamlined installation for other distros as well. General rule of thumb is to have a development environment (make, g++), libvirt and qemu. `virtkick-starter` will try to setup rest by itself.

## First run

1. `git clone https://github.com/virtkick/virtkick-starter.git`
2. `cd virtkick-starter`
3. `./virtkick-start -dim`

First start may take a couple of minutes due to download of various dependencies. It will ask for root password to setup things in `setup/system.sh`, as you may inspect. During run it will also download iso images to `/home/virtkick/iso`, make sure you have enough disk space left (~25 GB).

After everything is set up, open up  [http://localhost:3000/](http://localhost:3000/) and try out virtkick by creating a virtual machine or two. :) Happy hacking!

## Next runs

1. `./virtkick-start -dm`

## Upgrading

1. `git pull`
2. `./virtkick-start -dim`

## Hacker Zone™

See `./virtkick-start -h` for other options.

Some environment variables may be set to customize:

- `PORT` - reverse proxy listen port (defaults to 3000)
- `RAILS_PORT` - Rails web application listen port (defaults to 60000)
- `WORKER_COUNT` - number of background jobs workers (defaults to 2)
- `NO_DOWNLOAD` - skip download of iso files to `/home/virtkick/iso`

## Contributing

See [CONTRIBUTING.md](https://github.com/virtkick/virtkick-website/blob/master/CONTRIBUTING.md). Thanks!


# Sponsors

- Tip us weekly with Gratipay: [![Donate with Gratipay](https://img.shields.io/gratipay/virtkick.svg?style=flat-square)](https://gratipay.com/virtkick/)
- One-time donate with PayPal: [![Donate with PayPal](https://raw.githubusercontent.com/virtkick/virtkick/master/paypal-donate.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=AGF4FPG7JZ7NY&lc=US)
- Or with Bitcoins: `1Nb7PxyNAKSNc6traXW4NPyPMhJA7PwXf8`
- [Become a corporate sponsor](https://www.virtkick.io/become-a-sponsor.html).

Thanks for your support!


# License

VirtKick, a simple orchestrator.
Copyright (C) 2014 StratusHost Damian Nowak

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see https://www.gnu.org/licenses/agpl-3.0.html.


# Trademark

The VirtKick name and logo are trademarks of Damian Nowak.
You may not use them for promotional purposes,
or in any way that claims, suggests or looks like
there's a relationship or endorsement by VirtKick.

Other marks and names mentioned herein may be trademarks of their respective companies.
