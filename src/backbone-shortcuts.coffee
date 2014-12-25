do (Backbone, _, key) ->

  parseKeys = (keys) ->
    [shortcut, scope] = keys.match(/^(\S+)\s*(.*)$/).slice(1, 3)
    scope = 'all' if scope is ''

    shortcut: shortcut
    scope: scope

  _.extend Backbone.View::,
    _shortcutBindings: []

    shortcutOptions:
      duplicate: true

    bindShortcuts: (optionalShortcuts, options) ->
      shortcuts = optionalShortcuts || @shortcuts || {}
      options = {} unless options?
      _.defaults options, @shortcutOptions

      for keys of shortcuts
        callback = shortcuts[keys]
        method = (if _.isFunction(callback) then callback else this[callback])
        throw new Error("Method " + callback + " does not exist") unless method

        keyEvent = parseKeys(keys)
        if options.duplicate or not _.findWhere(@_shortcutBindings, keyEvent)
          @_shortcutBindings.push keyEvent
          key(keyEvent.shortcut, keyEvent.scope, _.bind(method, this))

    unbindShortcuts: (keys, unbindAll) ->
      if keys?
        if _.isArray(keys)
          for _key in keys
            @unbindShortcut parseKeys(_key)
        else
          @unbindShortcut parseKeys(keys)
      else unless unbindAll
        for _key of @shortcuts
          @unbindShortcut parseKeys(_key)
      else
        for keyEvent in @_shortcutBindings
          key.unbind keyEvent.shortcut, keyEvent.scope
        @_shortcutBindings = []

    unbindShortcut: (keyEvent) ->
      key.unbind keyEvent.shortcut, keyEvent.scope
      @_shortcutBindings = _.without(@_shortcutBindings, keyEvent)

