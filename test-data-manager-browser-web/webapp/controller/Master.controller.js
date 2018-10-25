sap.ui.define([
	"sap/ui/model/json/JSONModel", "sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function (JSONModel, Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("ux.fnd.test.data.manager.browser.controller.Master", {

		oModel: [],
		temp: [],
		aSOT: {},
		clickedSOT: null,

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.abusinessObject = {
				array: [{
					"businessObject": "Product"
				}, {
					"businessObject": "BusinessPartner"
				}]
			};

			this.oModel = new sap.ui.model.json.JSONModel(this.abusinessObject);
			this.getView().setModel(this.oModel, "DemoGemini");
		},

		handleMasterPress: function (oEvent) {
			this.clickedSOT = oEvent.getSource().getCells()[0].getProperty("text");
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			this.oRouter.navTo("detail", {
				layout: oNextUIState.layout,
				SOT: this.clickedSOT
			});
		},

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];

				//            var sQuery = oEvent.getParameter("query");
				var sQuery = oEvent.getSource().getProperty("value");
				var filters = [];
				var aData = this.getView().getModel("DemoGemini").getData().array;
				if (sQuery !== "") {
					this.sExp = new RegExp(sQuery, 'i');
					var x = this.aSOT.array;

					for (var i = 0; i < aData.length; i++) {
						this.temp = [];
						this.matching(aData[i]);
						if (this.temp.length > 0) {
							filters.push(new Filter("Object_Name", FilterOperator.Contains, aData[i].Object_Name));
						}
						var stemp = "";
						for (var j = 0; j < this.temp.length; j++) {
							stemp = stemp + ' ' + this.temp[j];
						}
						aData[i].matching_column = stemp;
					}
					this.getView().byId("matching_column").setVisible(true);
					this.getView().getModel("DemoGemini").refresh(true);
				} else {
					this.getView().byId("matching_column").setVisible(false);
					this.getView().getModel("DemoGemini").refresh(true);
				}
				var aFilter = new Filter(
					// filters: [
					// 	// new Filter("Object_Name", FilterOperator.Contains, "AccountingDocument"),
					// 	// new Filter("object", FilterOperator.Contains, "SalesOrder")
					// 	// new Filter("com", FilterOperator.Contains, sQuery)

					// ]
					filters);

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = aFilter;
				}
				this._applySearch(oTableSearchState);
			}

		},

		_applySearch: function (oTableSearchState) {
			var oTable = this.byId("idProductsTable");

			oTable.getBinding("items").filter(oTableSearchState, "Application");

		},

		matching: function (p) {
			for (var key in p) {
				if (p[key] instanceof Array) {
					for (var i = 0; i < p[key].length; i++) {
						var key1 = key;
						this.matching(p[key][i]);
						key = key1;
					}

				} else {
					if (p[key].match(this.sExp) !== null) {
						if (this.temp.indexOf(key) === -1)
							this.temp.push(key);
					}
				}
			}
		}

	});
}, true);