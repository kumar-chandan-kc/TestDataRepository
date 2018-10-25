jQuery.sap.declare("ux.fnd.test.data.manager.repository.util.APISelector");

sap.ui.define([
	'sap/m/MessageBox'
], function(MessageBox) {
	"use strict";

	ux.fnd.test.data.manager.repository.util.APISelector = {

		fetchBindingInfoForTestDataObjectAPIFetch: function(sTestDataObject) {
			var oFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("sapobjecttype", "EQ", sTestDataObject), new sap.ui.model.Filter("apitype", "EQ", "ODATA")
			], true);
			return {
				path: "geminiModel>/I_SBRAPIOPERATIONSMASTER",
				filters: oFilter,
				template: new sap.m.StandardListItem({
					title: "{geminiModel>serviceinterface_wov}"
				})
			};
		},

		showAvailableVersionsForTestDataObjectAPI: function(oEvent) {
			var oSessionModel = oEvent.getSource().getModel("sessionModel");
			var oSelectedObject = oEvent.getParameter("listItem").getBindingContext("geminiModel").getObject();
			var sSelectedAPI = oSelectedObject.serviceinterface_wov;
			oSessionModel.setProperty("/selectedTestDataObjectAPI", sSelectedAPI);
		}

	};

	return ux.fnd.test.data.manager.repository.util.APISelector;

});
