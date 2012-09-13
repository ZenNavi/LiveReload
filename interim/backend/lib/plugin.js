// Generated by IcedCoffeeScript 1.3.1c
(function() {
  var Compiler, Path, Plugin, PluginManager, fs, iced, loadPlugin, util, __iced_k, __iced_k_noop,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  iced = {
    Deferrals: (function() {

      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) return this.continuation(this.ret);
      };

      _Class.prototype.defer = function(defer_params) {
        var _this = this;
        ++this.count;
        return function() {
          var inner_params, _ref;
          inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (defer_params != null) {
            if ((_ref = defer_params.assign_fn) != null) {
              _ref.apply(null, inner_params);
            }
          }
          return _this._fulfill();
        };
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    }
  };
  __iced_k = __iced_k_noop = function() {};

  fs = require('fs');

  Path = require('path');

  util = require('util');

  Compiler = require('./tool').Compiler;

  Plugin = (function() {

    function Plugin(folder) {
      this.folder = folder;
    }

    Plugin.prototype.initialize = function(callback) {
      this.compilers = {};
      this.manifestFile = "" + this.folder + "/manifest.json";
      return this.parseManifest(callback);
    };

    Plugin.prototype.parseManifest = function(callback) {
      try {
        return this.processManifest(JSON.parse(fs.readFileSync(this.manifestFile, 'utf8')), callback);
      } catch (e) {
        return callback(e);
      }
    };

    Plugin.prototype.processManifest = function(manifest, callback) {
      var compiler, compilerManifest, _i, _len, _ref;
      this.manifest = manifest;
      _ref = this.manifest.LRCompilers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        compilerManifest = _ref[_i];
        compiler = new Compiler(this, compilerManifest);
        this.compilers[compiler.name] = compiler;
      }
      console.log("Loaded manifest at " + this.folder + " with " + this.manifest.LRCompilers.length + " compilers");
      return callback(null);
    };

    return Plugin;

  })();

  loadPlugin = function(folder, callback) {
    var plugin;
    plugin = new Plugin(folder);
    return plugin.initialize(function(err) {
      if (err) return callback(err);
      return callback(null, plugin);
    });
  };

  PluginManager = (function() {

    function PluginManager(folders) {
      this.folders = folders;
    }

    PluginManager.prototype.rescan = function(callback) {
      var entry, err, errs, folder, i, plugin, pluginFolders, result, ___iced_passed_deferral, __iced_deferrals, __iced_k, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      pluginFolders = [];
      _ref = this.folders;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        folder = _ref[_i];
        _ref1 = fs.readdirSync(folder);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          entry = _ref1[_j];
          if (entry.endsWith('.lrplugin')) {
            pluginFolders.push(Path.join(folder, entry));
          }
        }
      }
      errs = {};
      result = [];
      (function(__iced_k) {
        var _k, _len2;
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          filename: "cli/lib/plugin.iced",
          funcname: "PluginManager.rescan"
        });
        for (i = _k = 0, _len2 = pluginFolders.length; _k < _len2; i = ++_k) {
          folder = pluginFolders[i];
          loadPlugin(folder, __iced_deferrals.defer({
            assign_fn: (function(__slot_1, __slot_2, __slot_3, __slot_4) {
              return function() {
                __slot_1[__slot_2] = arguments[0];
                return __slot_3[__slot_4] = arguments[1];
              };
            })(errs, folder, result, i),
            lineno: 52
          }));
        }
        __iced_deferrals._fulfill();
      })(function() {
        var _k, _len2, _ref2;
        for (folder in errs) {
          if (!__hasProp.call(errs, folder)) continue;
          err = errs[folder];
          if (!(err)) continue;
          err.message = "Error loading plugin from " + folder + ": " + err.message;
          return callback(err);
        }
        _this.plugins = result;
        _this.compilers = {};
        _ref2 = _this.plugins;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          plugin = _ref2[_k];
          Object.merge(_this.compilers, plugin.compilers);
        }
        return callback(null);
      });
    };

    return PluginManager;

  })();

  exports.PluginManager = PluginManager;

  exports.Plugin = Plugin;

}).call(this);
