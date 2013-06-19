/**********************
 * Bankai v0.0.1
 *
 * Development Team:
 *  David Martinho
 *  Pedro Santos
 *  Sérgio Silva
 **********************/
define([ 'backbone', 'marionette', 'app', 'router', 'supportFormModel', 'supportFormView', 'i18n!nls/messages',
		'i18n!bankai/nls/messages' ], function(Backbone, Marionette, App, Router, SupportFormModel, SupportFormView,
		i18n, bankaiI18N) {

	var redirect = function() {
		var loc = location.href;
		location.href = loc.substring(0, loc.indexOf(contextPath) + contextPath.length + 1);
	};

	var supportform = function(data) {
		var model = JSON.parse(data.responseText);
		$('#support-modal').remove();
		var supportFormModel = new SupportFormModel(model);
		var x = new SupportFormView({
			model : supportFormModel
		});
		x.render();
		$("body").append(x.el);
		$('#support-modal').on('shown', function() {
			$('#support-modal textarea').focus();
		});
		$('#support-modal').modal();
	};

	$.ajaxSetup({
		statusCode : {
			401 : redirect,
			403 : redirect,
			500 : supportform,
		}
	});

	Backbone.emulateJSON = true;

	var templateCaches = {};
	Backbone.Marionette.Renderer.render = function(template, data) {
		if (data != undefined) {
			if (typeof BennuPortal !== "undefined") {
				BennuPortal.addMls(data);
			}
			data["_abv"] = function() {
				return function(val) {
					if (this[val]) {
						var maxLength = 15;
						var text = this[val];
						if (text && text.length > maxLength) {
							return this[val].substring(0, maxLength) + "...";
						}
						return text;
					}
					return "";
				};
			};

			data["_i18n"] = function() {
				return function(val) {
					if (i18n[val]) {
						return i18n[val];
					}
					if (bankaiI18N[val]) {
						return bankaiI18N[val];
					}
					return "!!_i18n_" + val + "_i18n_!!";
				};
			};

			data["_noti18n"] = function() {
				return function(val) {
					if (i18n[data[val]]) {
						return i18n[data[val]];
					}
					return "";
				};
			};
		}
		var rawTemplate = template;
		if (template.indexOf("#") == 0) {
			var cachedTemplate = templateCaches[template];
			if (!cachedTemplate) {
				cachedTemplate = $(template).html();
				templateCaches[template] = cachedTemplate;
			}
			rawTemplate = cachedTemplate;
		}
		return Mustache.to_html(rawTemplate, data);
	};

	App.addRegions({
		page : "#bankai-container"
	});

	App.addInitializer(function() {
		App.Router = new Router();
		App.Router.initialize();
		Backbone.history.start();
	});

	App.start();

});