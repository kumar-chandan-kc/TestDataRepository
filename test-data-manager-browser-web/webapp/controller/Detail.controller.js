sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("ux.fnd.test.data.manager.browser.controller.Detail", {

		SOT: null,
		facetValue: "",

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			sap.ui.namespace("sap.cfnd.testdatabrowser");
			sap.cfnd.testdatabrowser.DetailController = this;
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("detail").attachPatternMatched(this.renderdata, this);

		},

		fnBindTableData: function (data) {

			var x = [];
			// if (typeof data === "object") {
			// 	x.push(data);
			// } else {
			// 	// for (var iIndex = 0; iIndex < data.length; iIndex++) {
			// 	// 	x.push(data[iIndex]);
			// 	// }
			// 	x = data;
			// }
			x = data;

			var columnData = [];
			// var responseData = x[0];
			var responseData = JSON.parse(x.apiDetails[0].releaseVersions[0].testDataInstances[0].testData);
			for (var name in responseData) {
				var columnName = {};
				if (typeof responseData[name] !== "object") {
					columnName.columnId = name;
					columnData.push(columnName);
				}

			}

		var rowData = [];
			var dataRows = x.apiDetails[0].releaseVersions[0].testDataInstances;
			for(var i=0;i<dataRows.length;i++)
			{var parsedJson = JSON.parse(dataRows[i].testData);
				rowData.push(parsedJson);}

			var dataModel = new sap.ui.model.json.JSONModel();
			dataModel.setData({
				columns: columnData,
				rows: rowData
			});

			var oTable = sap.cfnd.testdatabrowser.DetailController.getView().byId("idAPITable");
			sap.cfnd.testdatabrowser.DetailController.getView().setModel(dataModel, "productData");
			oTable.setModel(dataModel);
			var oColumnTemplate = new sap.m.Column({
				header: new sap.m.Label({
					text: "{columnId}"
				})
			});

			oTable.bindAggregation("columns", "/columns", oColumnTemplate);

			for (var iIndex = 8; iIndex < oTable.getColumns().length; iIndex++) {
				oTable.getColumns()[iIndex].setVisible(false);
			}

			oTable.bindItems("/rows", function (index, context) {

				var obj = context.getObject();
				var aColumns = context.getModel().getData().columns;
				var row = new sap.m.ColumnListItem({
					type: "Navigation"
				});
				for (var kIndex = 0; kIndex < aColumns.length; kIndex++) {
					row.addCell(new sap.m.Text({
						text: obj[aColumns[kIndex].columnId]
					}));
				}
				return row;

			});
		},
		renderdata: function (oEvent) {

			var SOT = oEvent.getParameter("arguments").SOT;
			this.oBusinessPartnerJSON = [];
			var sURL;
			var that = this;
			if (SOT === "BusinessPartner") {
				sURL =
					"https://github.wdf.sap.corp/raw/i332528/test-data/master/S4HANA/BusinessPartner/API_BUSINESS_PARTNER/1811/dd4c4226-645d-4cc9-bbca-234dae868076_data.json"
			} else {
				sURL =
					"https://github.wdf.sap.corp/raw/i332528/test-data/master/S4HANA/Product/API_PRODUCT_SRV/1811/dd4c4226-645d-4cc9-bbca-234dae868076_data.json"
			}
		$.ajax({

				url: "/github/testdataobject/Product/details ",
				type: 'GET',
				crossDomain: true,
				dataType: 'json',
				success: that.fnBindTableData,
				error: function (request, error) {
					alert("Request: " + JSON.stringify(request));
				}
			});

			var y = {
				release: [{
					"value": "1811"
				}, {
					"value": "1808"
				}, {
					"value": "1805"
				}, {
					"value": "1802"
				}, {
					"value": "1711"
				}]
			};
			// var data = x.products.filter(function(b) {
			// 	return b.object === SOT;
			// });
			var OModelData = new sap.ui.model.json.JSONModel();
			OModelData.setProperty("/release", y.release);

			this.getView().setModel(OModelData, "geminidetails");

			var aSOT = {
				objName: SOT

			};
			this.sObj = SOT;
			var oHeaderModel = new sap.ui.model.json.JSONModel(aSOT);
			this.getView().setModel(oHeaderModel, "geminiheader");

		},

		handleMasterPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2);
			var value = oEvent.getParameter("listItem").getCells()[0].getProperty("text");
			sap.cfnd.testdatabrowser.value = oEvent.getParameter("listItem").getBindingContext().getProperty();

			// Calculating which facet has been clicked

			var facet;
			if (oEvent["mParameters"]["id"].indexOf("API") !== -1)
				facet = "API";
			else if (oEvent["mParameters"]["id"].indexOf("Ext") !== -1)
				facet = "Extensibility";
			else if (oEvent["mParameters"]["id"].indexOf("Apps") !== -1)
				facet = "Apps";
			else if (oEvent["mParameters"]["id"].indexOf("CDS") !== -1)
				facet = "CDS";
			else if (oEvent["mParameters"]["id"].indexOf("Events") !== -1)
				facet = "Event";

			this.facetValue = facet;

			this.oRouter.navTo("detailDetail", {
				layout: oNextUIState.layout,
				Value: value,
				facet: this.facetValue
			});
		},

		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {
				layout: sNextLayout,
				SOT: this.sObj,
				facet: this.facetValue
			});
		},
		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {
				layout: sNextLayout,
				SOT: this.sObj
			});
		},
		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {
				layout: sNextLayout
			});
		},
		onSearch: function (oEvent) {
			var sQuery = oEvent.getSource().getProperty("value");

			var aFilters = [];
			var aColumnData = this.getView().getModel("productData").getData().columns;
			for (var iIndex = 0; iIndex < 8; iIndex++) {
				try
				{var businessObjectFirstRow = this.getView().getModel("productData").getData().rows[0];
					var columnName = aColumnData[iIndex].columnId;
					businessObjectFirstRow[columnName].split("");
				var filterfield = new sap.ui.model.Filter(
					aColumnData[iIndex].columnId, sap.ui.model.FilterOperator.Contains, sQuery
				);
				aFilters.push(filterfield);
			}
			catch(e)
			{}
			}
			var Filters = new sap.ui.model.Filter({
				filters: aFilters,
				and: false
			});

			var oTable = this.getView().byId("idAPITable");
			oTable.getBinding("items").filter(Filters, "application");
		}
	});
}, true);