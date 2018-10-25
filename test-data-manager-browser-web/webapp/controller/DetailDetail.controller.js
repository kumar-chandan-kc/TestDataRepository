sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("ux.fnd.test.data.manager.browser.controller.DetailDetail", {
		sObj: "",
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();

			// sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
			// 	// when detail navigation occurs, update the binding context

			// 	this.value = oEvent.getParameter("arguments").Value;

			// }, this);
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("detailDetail").attachPatternMatched(this.renderdata, this);

		},
		renderdata: function (oEvent) {

			var SOT = oEvent.getParameter("arguments").Value;
			var facet = oEvent.getParameter("arguments").facet;
			for (var k in sap.cfnd.testdatabrowser.value) {
				if (typeof sap.cfnd.testdatabrowser.value[k] === "object" && sap.cfnd.testdatabrowser.value[k] !== null) {
					for (var l in sap.cfnd.testdatabrowser.value[k]) {
						if (l.startsWith("__")) {
							delete sap.cfnd.testdatabrowser.value[k][l];
						}
					}
				}
			}

			//var oJSONData = JSON.stringify(sap.cfnd.testdatabrowser.value, null, "\t");
			var oJSONData = this.prettyPrint(sap.cfnd.testdatabrowser.value);
			this.DetailDetail = {
				value: SOT,
				facet: "Product Details",
				technicalDetails: oJSONData

			};

			this.sObj = SOT;
			var oHeaderModel = new sap.ui.model.json.JSONModel(this.DetailDetail);
			this.getView().setModel(oHeaderModel, "geminiheader");

		},
		handleDetailDetailPress: function () {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(3);
			this.oRouter.navTo("page2", {
				layout: oNextUIState.layout
			});
		},
		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/fullScreen");
			this.oRouter.navTo("detailDetail", {
				layout: sNextLayout
			});
		},
		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/exitFullScreen");
			this.oRouter.navTo("detailDetail", {
				layout: sNextLayout
			});
		},
		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/closeColumn");
			this.oRouter.navTo("detail", {
				layout: sNextLayout
			});
		},
		replacer: function (match, pIndent, pKey, pVal, pEnd) {
			var key = "<span style=\"color:brown;\">";
			var val = "<span style=\"color:navy;\">";
			var str = "<span style=\"color:olive;\">";
			var r = pIndent || '';
			if (pKey)
				r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
			if (pVal)
				r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
			return r + (pEnd || '');
		},
		prettyPrint: function (obj) {
			var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
			return "<pre>" + JSON.stringify(obj, null, 3).replace(/&/g, '&amp;').replace(/\\"/g, '&quot;').replace(/</g, '&lt;').replace(
				/>/g, '&gt;').replace(
				jsonLine, this.replacer) + "</pre>";
		}

	});
}, true);