// Generated by IcedCoffeeScript 1.3.1c
(function() {
  var LiveReloadContext, OPTIONS, Path, debug, dreamopt, fs;

  debug = require('debug')('livereload:cli');

  Path = require('path');

  fs = require('fs');

  dreamopt = require('dreamopt');

  OPTIONS = ['Commands for interactive usage:', '  watch', 'Other commands:', '  rpc', 'General options:'];

  LiveReloadContext = (function() {

    function LiveReloadContext() {}

    return LiveReloadContext;

  })();

  exports.run = function(argv) {
    var context, options;
    options = dreamopt(OPTIONS, {
      loadCommandSyntax: function(name) {
        return require("./commands/" + (name.replace(/\s/g, '-'))).usage;
      }
    });
    debug(JSON.stringify(options));
    context = new LiveReloadContext();
    context.paths = {};
    context.paths.root = Path.dirname(__dirname);
    context.paths.rpc = Path.join(context.paths.root, 'rpc-api');
    context.paths.bundledPlugins = Path.join(context.paths.root, 'plugins');
    return require("./commands/" + options.command).run(options, context);
  };

}).call(this);
