import { PluginManager } from './PluginManager.js';

export const pluginManager = new PluginManager();

export function registerPlugin(plugin) {
  pluginManager.register(plugin);
}

export function clearPlugins() {
  pluginManager.clear();
}
