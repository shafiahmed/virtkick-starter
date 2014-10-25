# VirtKick. Cloud made easy.

[![GPA](https://img.shields.io/codeclimate/github/virtkick/virtkick-starter.svg?style=flat-square)](https://codeclimate.com/github/virtkick/virtkick-starter)
[![Dependencies status](http://img.shields.io/gemnasium/virtkick/virtkick-starter.svg?style=flat-square)](https://gemnasium.com/virtkick/virtkick-starter)
[![Gratipay](https://img.shields.io/gratipay/virtkick.svg?style=flat-square)](https://gratipay.com/virtkick/)

VirtKick is a simple, open source orchestrator.
Managing virtual machines or Docker containers has never been easier.

That's the VirtKick Starter. It will allow you to start using VirtKick with a single click.

Note: this is a heavy work in progress and not yet one-click install. Don't judge - it will be improved. Thanks! :-)

## Issues

Report bugs and feature requests in [virtkick](https://github.com/virtkick/virtkick) meta-project.

## One time setup

1. `git clone --recursive https://github.com/virtkick/virtkick-starter.git`
2. Perform [one time setup of virtkick-webapp](https://github.com/virtkick/virtkick-webapp#one-time-setup)
3. Perform [one time setup of virtkick-backend](https://github.com/virtkick/virtkick-backend#one-time-setup)
4. Install node.js 0.10 or 0.11.14+
5. `npm install`

## Start VirtKick

- Development: `./virtkick-start -dm`
- Production: `./virtkick-start -pm`

See `./virtkick-start -h` for other options.

Some environment variables may be set to customize:
```
PORT - to change default listening port
WORKER_COUNT - to change worker count from default 2
RAILS_PORT - if you want to force different port on rails
WEBAPP_DIR - if you want to start webapp from different path than ./webapp
BACKEND_DIR - if you want to start backend from different path than ./backend
ISO_DIR - path to ISO, by default ./iso
HDD_DIR - path to HDD, by default ./hdd
```


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
