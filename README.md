# Gardening

Gardening production manager

### Directory structure

This app has been developed using well known front end JS libraries, including JQuery and Underscore.
As for the database I use [NeDB](https://github.com/louischatriot/nedb), an awesome full JS database based in MongoDB API.

- `./app`
    - `./app/css` Custom CSS.
    - `./app/fonts` Fonts.
    - `./app/js` Custom JS.
    - `./app/libs` Front end dependencies.
    - `./app/node_modules` Node modules required to run the app.
    - `./app/index.html` Main file. Contains all the html code.
- `./build` App builds for different platforms and NW.js versions.
- `./icons` App icons.
- `./node_modules` Node modules required to develop and build the app.
- `./build.js` Script to build the app using NW.js.
- `./README.md` You're reading it!

### Development environment setup

1. Run `npm install` within `./app` folder to install node packages for the app.
2. Run `bower install` within `./app` folder to install front end JS libraries for the app.
3. Run `npm install` within the root `./` folder to install node packages for development.

### Running the app

1. Run `node run` within the root `./` folder.

### Building and packaging the app with nwjs-builder

1. Run `node build` within the root `./` folder.

### Contact

[Mitxel Moriana](mailto:moriana.mitxel@gmail.com)

### License

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
