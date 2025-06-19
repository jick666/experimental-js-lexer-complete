export class PluginManager {
  constructor() {
    this.plugins = [];
  }

  register(plugin) {
    this.plugins.push(plugin);
  }

  clear() {
    this.plugins = [];
  }

  apply(engine) {
    for (const plugin of this.plugins) {
      if (plugin.modes) {
        for (const [mode, readers] of Object.entries(plugin.modes)) {
          if (!engine.modes[mode]) engine.modes[mode] = [];
          engine.modes[mode].push(...readers);
        }
      }
      if (typeof plugin.init === 'function') {
        plugin.init(engine);
      }
    }
  }
}
