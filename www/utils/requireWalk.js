'use strict';

const fs = require('fs');

/**
 * Functional recursive node require
 *
 * Will recursively call 'require' on files with optionally with arguments
 *
 * Example 1: recursive routes with arguments
 * var requireRoutes = requireWalk('./www/routes');
 * requireRoutes(config, app, passport);
 *
 * Example 2: recursive models with no arguments
 * var requireModels = requireWalk('/www/models');
 * requireModels();
 *
 * @param path
 * @returns {fn}
 *
 */
exports.requireWalk = function (path) {

  let src = path;

  let fn = function () {

    let args = arguments;

    fs.readdirSync(src).forEach(function (file) {

      let newPath = src + '/' + file;
      let stat = fs.statSync(newPath);
      if (stat.isFile()) {
        if (file.indexOf('.js') > -1 || file.indexOf('.coffee')) {
          if (args.length) {
            require(newPath).apply(this, args);
          }
          else {
            require(newPath);
          }
        }
      } else if (stat.isDirectory()) {
        fn(newPath);
      }
    });
  };

  return fn;

};
