jQuery.sap.declare("ux.fnd.test.data.manager.repository.util.ViewRouteHandler");

sap.ui.define([], function() {
	"use strict";

	ux.fnd.test.data.manager.repository.util.ViewRouteHandler = {

		toTestDataObjectAPI: function(oEvent) {
			var oSelectedObject = oEvent.getParameter("listItem").getBindingContext("geminiModel").getObject();
			var sTestDataObject = oSelectedObject.ObjectName;
			oEvent.getSource().getModel("testRepoGenericModel").getProperty("/oRouter").navTo("testdataobjectapis", {
				testDataObject: sTestDataObject
			});
		},

		onTestDataObjectAPIRouteMatched: function(sTestDataObject, oTestRepoGenericModel) {
			var oTestRepoGenericData = oTestRepoGenericModel.getData();
			oTestRepoGenericData.uiState = (oTestRepoGenericData.uiState) ? oTestRepoGenericData.uiState : {};
			oTestRepoGenericData.uiState["flexibleColumnLayout"] = "TwoColumnsMidExpanded";
			oTestRepoGenericModel.updateBindings();
		}

	};

	return ux.fnd.test.data.manager.repository.util.ViewRouteHandler;

});
