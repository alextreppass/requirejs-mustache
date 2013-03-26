// RequireJS Mustache template plugin
// http://github.com/jfparadis/requirejs-mustache
//
// An alternative to https://github.com/millermedeiros/requirejs-hogan-plugin
//
// Using Mustache Logic-less templates at http://mustache.github.com
// Using and RequireJS text.js at http://requirejs.org/docs/api.html#text
// @author JF Paradis
// @version 0.0.1
//
// Released under the MIT license
//
// Usage:
//   require(['backbone', 'stache!mytemplate'], function (Backbone, mytemplate) {
//     return Backbone.View.extend({
//       initialize: function(){
//         this.render();
//       },
//       render: function(){
//         this.$el.html(mytemplate({message: 'hello'}));
//     });
//   });
//
// Configuration: (optional)
//   require.config({
//     stache: {
//       extension: '.mustache' // default = '.html'
//     }
//   });

/*jslint nomen: true */
/*global define: false */

(function () {
    'use strict';
    var sourceMap = {},
        buildMap = {},
        buildTemplateSource = "define('{pluginName}!{moduleName}', ['Mustache'], function (Mustache) { return Mustache.compile('{source}'); });\n";

    define(['text', 'Mustache'], function (text, Mustache) {
        return {
            version: '0.0.1',

            load: function (moduleName, parentRequire, onload, config) {
                if (buildMap[moduleName]) {
                    onload(buildMap[moduleName]);

                } else {
                    var ext = (config.tpl && config.tpl.extension) || '.html';
                    text.load(moduleName + ext, parentRequire, function (source) {
                        if (config.isBuild) {
                            sourceMap[moduleName] = source;
                        }
                        buildMap[moduleName] = Mustache.compile(source);
                        onload(buildMap[moduleName]);
                    }, config);
                }
            },

            write: function (pluginName, moduleName, write, config) {
                var source = sourceMap[moduleName];
                if (source) {
                    source = text.jsEscape(source);
                    write.asModule(pluginName + '!' + moduleName,
                        buildTemplateSource
                        .replace('{pluginName}', pluginName)
                        .replace('{moduleName}', moduleName)
                        .replace('{source}', source));
                }
            }
        };
    });
}());