# Gardening

### Development environment setup

1. Run `npm install` within `./app` folder.
2. Run `bower install` within `./app` folder.
3. Run `npm install` within the root `./` folder.
4. Run `gulp` within `./app` folder (wip).

### App building and packaging setup (nw-builder)

1. For nw-builder with NW.js versions >=0.15.0 fix `./node_modules/nw-builder/lib/platforms.js` included files list:

    Linux 32, 64:
    ```
    '>0.10.1 <0.15.0': ['nw', 'nw.pak', 'libffmpegsumo.so', 'icudtl.dat', 'locales'],
    '>=0.15.0': ['nw', 'icudtl.dat', 'natives_blob.bin', 'resources.pak', 'snapshot_blob.bin', 'locales', 'lib', 'nw_100_percent.pak', 'nw_200_percent.pak', 'nw_material_100_percent.pak', 'nw_material_200_percent.pak']
    ```

2. Run `node build.js`
