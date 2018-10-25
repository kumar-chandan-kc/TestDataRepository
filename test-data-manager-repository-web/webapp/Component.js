sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"ux/fnd/test/data/manager/repository/util/APISelector",
	"ux/fnd/test/data/manager/repository/util/APIMetadataHandler",
	"ux/fnd/test/data/manager/repository/util/SystemSelector",
	"ux/fnd/test/data/manager/repository/util/APIDataFetcher",
	"ux/fnd/test/data/manager/repository/util/ViewRouteHandler"
], function(jQuery, UIComponent, jsonModel) {
	"use strict";

	return UIComponent.extend("ux.fnd.test.data.manager.repository.Component", {

		metadata: {
			manifest: 'json'
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			this.appSpecificInitialization();
		},

		appSpecificInitialization: function() {
			this.setModel(new jsonModel({}), "testRepoGenericModel");
			this.getModel("testRepoGenericModel").getData()["availableSystems"] = this.getAvailableSystems();
			this.getModel("testRepoGenericModel").getData()["oRouter"] = this.getRouter();
		},

		getAvailableSystems: function() {
			return [
				{
					systemCode: "er6",
					systemText: "ER6"
				}, {
					systemCode: "uyt",
					systemText: "UYT"
				}
			];
		}

	});

}, true);
