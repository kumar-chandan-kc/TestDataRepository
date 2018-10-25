sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'ux/fnd/test/data/manager/repository/util/ViewRouteHandler',
	'ux/fnd/test/data/manager/repository/util/APISelector',
	'sap/ui/model/json/JSONModel'
], function(Controller, oViewRouteHandler, oAPISelector, JSONModel) {
	"use strict";

	var oTestDataObjectAPIsController = Controller.extend("ux.fnd.test.data.manager.repository.controller.TestDataObjectAPIs", {

		onInit: function() {
			var oRouter = this.getOwnerComponent().getModel("testRepoGenericModel").getProperty("/oRouter");
			var oTestDataObjectAPIsRoute = oRouter.getRoute("testdataobjectapis");
			oTestDataObjectAPIsRoute.attachPatternMatched(function(oEvent) {
				this.getView().setModel(new JSONModel({}), "sessionModel");
				var sTestDataObject = oEvent.getParameter("arguments").testDataObject;
				this.getView().getModel("sessionModel").setProperty("/selectedTestDataObject", sTestDataObject);
				var oTestRepoGenericModel = this.getOwnerComponent().getModel("testRepoGenericModel");
				this.loadAPIsForTestDataObject(sTestDataObject);
				jQuery.proxy(oViewRouteHandler.onTestDataObjectAPIRouteMatched, this)(sTestDataObject, oTestRepoGenericModel);
			}, this)
		},

		loadAPIsForTestDataObject: function(sTestDataObject) {
			this.getView().byId("testDataObjectAPIs").bindItems(oAPISelector.fetchBindingInfoForTestDataObjectAPIFetch(sTestDataObject))
		},

		loadAvailableReleaseVersionsForTestDataObject: function(sTestDataObject) {

		}

	});

	return oTestDataObjectAPIsController;

});
