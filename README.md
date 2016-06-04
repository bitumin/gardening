# Gardening

Gardening production manager

### Details and project directory structure

This app has been developed using well known front end JS libraries, including JQuery and Underscore. For the database management I have implemented NeDB, a full JS database based in the MongoDB API.

- `./app`
    - `./app/css` Custom CSS.
    - `./app/fonts` Fonts.
    - `./app/js` Custom JS.
    - `./app/libs` Front end dependencies.
    - `./app/node_modules` Node modules required to run the app.
    - `./app/index.html` Main file. Contains all the html code.
- `./build` App builds for different platforms and NW.js versions
- `./icons` Icons for desktop builds of the app
- `./node_modules` Node modules required to develop and build the app.
- `./build.js` Script to build the app using NW.js
- `./README.md` This file

### Development environment setup

1. Run `npm install` within `./app` folder.
2. Run `bower install` within `./app` folder.
3. Run `npm install` within the root `./` folder.
4. Check that all required CSS, JS libs are present and run file watchers/minifiers if needed.

### App building and packaging setup (nwjs-builder)

1. Run `node build.js`

### Contact

Mitxel Moriana [moriana.mitxel@gmail.com](moriana.mitxel@gmail.com)

### License

GPLv3