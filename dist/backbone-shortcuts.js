(function(Backbone, _, key) {
  var parseKeys;
  parseKeys = function(keys) {
    var scope, shortcut, _ref;
    _ref = keys.match(/^(\S+)\s*(.*)$/).slice(1, 3), shortcut = _ref[0], scope = _ref[1];
    if (scope === '') {
      scope = 'all';
    }
    return {
      shortcut: shortcut,
      scope: scope
    };
  };
  return _.extend(Backbone.View.prototype, {
    _shortcutBindings: [],
    shortcutOptions: {
      duplicate: true
    },
    bindShortcuts: function(optionalShortcuts, options) {
      var callback, keyEvent, keys, method, shortcuts, _results;
      shortcuts = optionalShortcuts || this.shortcuts || {};
      if (options == null) {
        options = {};
      }
      _.defaults(options, this.shortcutOptions);
      _results = [];
      for (keys in shortcuts) {
        callback = shortcuts[keys];
        method = (_.isFunction(callback) ? callback : this[callback]);
        if (!method) {
          throw new Error("Method " + callback + " does not exist");
        }
        keyEvent = parseKeys(keys);
        if (options.duplicate || !_.findWhere(this._shortcutBindings, keyEvent)) {
          this._shortcutBindings.push(keyEvent);
          _results.push(key(keyEvent.shortcut, keyEvent.scope, _.bind(method, this)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    unbindShortcuts: function(keys, unbindAll) {
      var keyEvent, _i, _j, _key, _len, _len1, _ref, _results, _results1;
      if (keys != null) {
        if (_.isArray(keys)) {
          _results = [];
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            _key = keys[_i];
            _results.push(this.unbindShortcut(parseKeys(_key)));
          }
          return _results;
        } else {
          return this.unbindShortcut(parseKeys(keys));
        }
      } else if (!unbindAll) {
        _results1 = [];
        for (_key in this.shortcuts) {
          _results1.push(this.unbindShortcut(parseKeys(_key)));
        }
        return _results1;
      } else {
        _ref = this._shortcutBindings;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          keyEvent = _ref[_j];
          key.unbind(keyEvent.shortcut, keyEvent.scope);
        }
        return this._shortcutBindings = [];
      }
    },
    unbindShortcut: function(keyEvent) {
      key.unbind(keyEvent.shortcut, keyEvent.scope);
      return this._shortcutBindings = _.without(this._shortcutBindings, keyEvent);
    }
  });
})(Backbone, _, key);
