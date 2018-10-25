sap.ui.define([
	"sap/ui/model/json/JSONModel", "sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function(JSONModel, Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("ux.fnd.test.data.manager.deployer.controller.Master", {

		oModel: [],
		temp: [],
		aSOT: {},
		clickedSOT: null,

		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			var aFilterBar = {
				"systems": [
					{
						systemID: "UYT"
					}, {
						systemID: "ER9"
					}
				],
				"releases": [
					{
						releaseID: "1602"
					}, {
						releaseID: "1605"
					}, {
						releaseID: "1608"
					}, {
						releaseID: "1611"
					}, {
						releaseID: "1702"
					}, {
						releaseID: "1705"
					}, {
						releaseID: "1708"
					}, {
						releaseID: "1711"
					}, {
						releaseID: "1802"
					}, {
						releaseID: "1805"
					}, {
						releaseID: "1808"
					}, {
						releaseID: "1811"
					}, {
						releaseID: "1902"
					}, {
						releaseID: "1905"
					}, {
						releaseID: "1908"
					}, {
						releaseID: "1911"
					}
				]
			};
			var oSystemModel = new sap.ui.model.json.JSONModel();
			oSystemModel.setData(aFilterBar);
			this.getView().setModel(oSystemModel, "systemModel");
		},
		
		handleMasterPress: function(oEvent) {
			this.clickedSOT = oEvent["oSource"]["mAggregations"]["cells"][0]["mProperties"].text;
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
			this.oRouter.navTo("detail", {
				layout: oNextUIState.layout,
				SOT: this.clickedSOT
			});
		},
		
		fnOnValueHelpRequest: function() {
			if (!this.valueHelpDialog) {
				this.valueHelpDialog = sap.ui.xmlfragment("ux.fnd.test.data.manager.deployer.fragments.ReleaseValueHelp", this);
				this.getView().addDependent(this.valueHelpDialog);
			}
			this.valueHelpDialog.open();
		},
		fnOnSelectReleaseVH: function(oEvent) {
			var sRelease = oEvent.getParameter("selectedItem").getTitle();
			this.getView().byId("searchRelease").setValue(sRelease);

		},
		fnOnGoButton: function(oEvent) {
			oEvent.getParameter("selectionSet")[0].getSelectedKey(); // gives you the selected system
			oEvent.getParameter("selectionSet")[1].getValue(); // gives you the selected release
		},

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];

				// var sQuery = oEvent.getParameter("query");
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
				// // new Filter("Object_Name", FilterOperator.Contains, "AccountingDocument"),
				// // new Filter("object", FilterOperator.Contains, "SalesOrder")
				// // new Filter("com", FilterOperator.Contains, sQuery)

				// ]
				filters);

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = aFilter;
				}
				this._applySearch(oTableSearchState);
			}

		},

		_applySearch: function(oTableSearchState) {
			var oTable = this.byId("idProductsTable");

			oTable.getBinding("items").filter(oTableSearchState, "Application");

		},

		matching: function(p) {
			for ( var key in p) {
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
