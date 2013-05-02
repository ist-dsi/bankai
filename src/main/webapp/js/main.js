require([
    'jquery',
    'backbone',
    'mustache',
    'marionette',
    'app',
    '../'+Bankai.appName+'/js/router',
    'i18n!../'+Bankai.appName+'/js/nls/messages'
    ], function($, Backbone, Mustache, Marionette, App, Router, i18n) {
		
		var redirect = function() {
        	var loc = location.href;
        	location.href = loc.substring(0, loc.indexOf(contextPath) + contextPath.length + 1);
		};
		
        $.ajaxSetup({
            statusCode : {
                401 : redirect,
                403 : redirect,
                500 : redirect
            }
        });

        Backbone.emulateJSON = true;

        Backbone.Marionette.Renderer.render = function(template, data) {
            if (data) {
//                data['_mls'] = function() { 
//                    return function(val) { 
//                        if (this[val]) {
//                            if (this[val].pt) {
//                                return this[val].pt;
//                            }
//                            if (this[val]["pt-PT"]) {
//                                return this[val]["pt-PT"];
//                            }
//                        }
//                        return "";
//                    };
//                };
            	BennuPortal.addMls(data);
                data['_abv'] = function() {
                    return function(val) {
                        if (this[val]) {
                            var maxLength = 15;
                            var text = this[val];
                            if(text && text.length > maxLength) {
                                return this[val].substring(0,maxLength)+"...";
                            }
                            return text;
                        }
                        return "";
                    }
                };
                data['_i18n'] = function() {
                    return function(val) {
                        if (i18n[val]) {
                            return i18n[val];
                        }
                        return "!!_i18n_" + val + "_i18n_!!";
                    }
                };
                data['_noti18n'] = function() {
                    return function(val) {
                        if (i18n[data[val]]) {
                            return i18n[data[val]];
                        }
                        return "";
                    }
                };
            }
            return Mustache.to_html(template, data);
        }

        App.addRegions({
            page: "#xpto"
        });

        App.addInitializer(function() {
            Bankai.initialize();
            Backbone.history.start();
        });

        Bankai.page = App.page;

        App.start();

});