cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.plugins.shortcut.ShortcutPlugin",
        "file": "plugins/com.plugins.shortcut/www/ShortcutPlugin.js",
        "pluginId": "com.plugins.shortcut",
        "clobbers": [
            "ShortcutPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "com.plugins.shortcut": "0.0.2"
};
// BOTTOM OF METADATA
});