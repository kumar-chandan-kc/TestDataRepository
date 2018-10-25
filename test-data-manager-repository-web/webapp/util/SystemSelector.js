jQuery.sap.declare("ux.fnd.test.data.manager.repository.util.SystemSelector");

sap.ui.define([], function() {
	"use strict";

	ux.fnd.test.data.manager.repository.util.SystemSelector = {

		resetSessionForNewSystem: function(oEvent) {
			var oSessionModel = oEvent.getSource().getModel("sessionModel");
			var sSelectedSystemCode = oSessionModel.getProperty("/systemSpecific/selectedSystemCode");
			ux.fnd.test.data.manager.repository.util.SystemSelector.resetSessionModelForSystemSpecificInfo(oSessionModel);
			oSessionModel.setProperty("/systemSpecific/selectedSystemCode", sSelectedSystemCode);
		},

		resetSessionForNewSystemClient: function(oEvent) {
			var oSessionModel = oEvent.getSource().getModel("sessionModel");
			var sSelectedSystemCode = oSessionModel.getProperty("/systemSpecific/selectedSystemCode");
			var sSelectedSystemClient = oSessionModel.getProperty("/systemSpecific/selectedSystemClient");
			ux.fnd.test.data.manager.repository.util.SystemSelector.resetSessionModelForSystemSpecificInfo(oSessionModel);
			oSessionModel.setProperty("/systemSpecific/selectedSystemCode", sSelectedSystemCode);
			oSessionModel.setProperty("/systemSpecific/selectedSystemClient", sSelectedSystemClient);
		},

		resetSessionModelForSystemSpecificInfo: function(oModel) {
			oModel.setProperty("/systemSpecific", {});
			oModel.updateBindings();
		}

	};

	return ux.fnd.test.data.manager.repository.util.SystemSelector;

});
