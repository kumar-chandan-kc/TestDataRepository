sap.ui.define([
	"sap/ui/model/json/JSONModel", "sap/ui/core/mvc/Controller"
], function(JSONModel, Controller) {
	"use strict";

	return Controller.extend("ux.fnd.test.data.manager.deployer.controller.Detail", {

		SOT: null,
		facetValue: "",

		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel();
			sap.ui.namespace("sap.cfnd.TestDataDeployer");
			sap.cfnd.TestDataDeployer.DetailController = this;
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("detail").attachPatternMatched(this.renderdata, this);

		},

		handleSystemVHConfirm: function(oEvent) {
			sap.ui.getCore().byId("SystemDeploy").setValue(oEvent.getParameter("selectedItem").getTitle());

		},
		handleClientVHConfirm: function(oEvent) {
			sap.ui.getCore().byId("Client12").setValue(oEvent.getParameters().selectedItem.getCells()[0].getText());

		},
		handleReleaseVHConfirm: function(oEvent) {
			sap.ui.getCore().byId("ReleaseDeploy").setValue(oEvent.getParameter("selectedItem").getTitle());

		},
		onValueHelpRequest: function(oEvent) {

			if (this.oRelaseVH === undefined) {
				this.oRelaseVH = sap.ui.xmlfragment("ux.fnd.test.data.manager.deployer.view.Release", this);
				this.getView().addDependent(this.oRelaseVH);
			}
			this.oRelaseVH.open();

		},
		onSystemValueHelpRequest: function(oEvent) {

			if (this.oSystemVH === undefined) {
				this.oSystemVH = sap.ui.xmlfragment("ux.fnd.test.data.manager.deployer.view.System", this);
				this.getView().addDependent(this.oSystemVH);
			}
			this.oSystemVH.open();

		},
		handleSearch: function(oEvent) {
			var sQuery = oEvent.getSource()._sSearchFieldValue;
			var sFilterValue;
			sFilterValue = "value";
			var aFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter(sFilterValue, sap.ui.model.FilterOperator.Contains, sQuery)

				],
				and: false
			});
			oEvent.getSource().getBinding("items").filter([
				aFilter
			]);
		},
		onClientValueHelp: function(oEvent) {

			if (this.oClient === undefined) {
				this.oClient = sap.ui.xmlfragment("ux.fnd.test.data.manager.deployer.view.Client", this);
				this.getView().addDependent(this.oClient);
			}
			this.oClient.open();

		},
		fnOk: function(oEvent) {
			oEvent.getSource().getParent().close();
			var oData = this.getView().byId('idAPITable').getModel().getData();
			var postData = {
				"testDataObject": oData.testDataObject,
				"testDataObjectAPI": oData.testDataObjectAPI,
				"releaseVersion": oData.releaseVersion,
				"testDataObjectFileName": this.getView().byId('idAPITable').getSelectedItems()[0].data("testDataFileName"),
				"systemToDeploy": "cc2",
				"systemClientToDeploy": "715"
			};
			$.ajax({
				url: "/onprem/deployer",
				type: 'POST',
				crossDomain: true,
				data: JSON.stringify(postData),
				contentType: "application/json",
				success: function(request, error) {
					alert("request success");
				},
				error: function(request, error) {
					alert("Request: " + JSON.stringify(request));
				}
			});
		},
		fnCancel: function(oEvent) {
			oEvent.getSource().getParent().close();
		},

		onPress: function(oEvent) {
			if (this.APIMap2 === undefined) {
				this.APIMap2 = sap.ui.xmlfragment("ux.fnd.test.data.manager.deployer.view.deployFragment", this);
				this.getView().addDependent(this.APIMap2);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.APIMap2);
			}
			this.APIMap2.open();
			sap.ui.getCore().byId("SystemDeploy").setValue('');
			sap.ui.getCore().byId("Client12").setValue('');
			sap.ui.getCore().byId("ReleaseDeploy").setValue('');

		},
		fnBindTableData: function(data) {

			var x = [];
			x = data;

			var columnData = [];
			// var responseData = x[0];
			var responseData = JSON.parse(x.apiDetails[0].releaseVersions[0].testDataInstances[0].testData)
			for ( var name in responseData) {
				var columnName = {};
				if (typeof responseData[name] !== "object") {
					columnName.columnId = name;
					columnData.push(columnName);
				}

			}
			var rowData = [];
			var dataRows = x.apiDetails[0].releaseVersions[0].testDataInstances;
			for (var i = 0; i < dataRows.length; i++) {
				var parsedJson = JSON.parse(dataRows[i].testData);
				parsedJson.testDataFileName = dataRows[i].testDataFileName;
				rowData.push(parsedJson);
			}

			var dataModel = new sap.ui.model.json.JSONModel();
			dataModel.setData({
				columns: columnData,
				rows: rowData,
				testDataObject: data.testDataObject,
				testDataObjectAPI: data.apiDetails[0].testDataObjectAPI,
				releaseVersion: data.apiDetails[0].releaseVersions[0].releaseVersion
			});

			// this.fileName = x.apiDetails[0].releaseVersions[0].testDataInstances[0].

			var oTable = sap.cfnd.TestDataDeployer.DetailController.getView().byId("idAPITable");
			sap.cfnd.TestDataDeployer.DetailController.getView().setModel(dataModel, "productData");
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

			oTable.bindItems("/rows", function(index, context) {
				var obj = context.getObject();
				var aColumns = context.getModel().getData().columns;
				var row = new sap.m.ColumnListItem({
					type: "Navigation"
				}).data("testDataFileName", obj.testDataFileName);
				delete obj.testDataFileName;
				for (var kIndex = 0; kIndex < aColumns.length; kIndex++) {
					row.addCell(new sap.m.Text({
						text: obj[aColumns[kIndex].columnId]
					}));
				}
				return row;
			});
		},

		renderdata: function(oEvent) {
			var SOT = oEvent.getParameter("arguments").SOT;
			this.oBusinessPartnerJSON = [];
			var sURL;
			var that = this;
			$.ajax({
				url: "/github/testdataobject/" + SOT + "/details ",
				type: 'GET',
				crossDomain: true,
				dataType: 'json',
				success: that.fnBindTableData,
				error: function(request, error) {
					alert("Request: " + JSON.stringify(request));
				}
			});

			var y = {
				release: [
					{
						"value": "1802"
					}, {
						"value": "1902"
					}, {
						"value": "1805"
					}, {
						"value": "1808"
					}, {
						"value": "1702"
					}
				]
			};
			var OModelData = new sap.ui.model.json.JSONModel();
			OModelData.setProperty("/release", y.release);

			var aChange = [];
			var oTemp = {};
			oTemp.value = "1805";
			aChange[0] = $.extend({}, oTemp);
			oTemp.value = "1808";
			aChange[1] = $.extend({}, oTemp);
			oTemp.value = "1811";
			aChange[2] = $.extend({}, oTemp);
			oTemp.value = "1902";
			aChange[3] = $.extend({}, oTemp);
			OModelData.setProperty("/aRelease", aChange);

			aChange = [];
			oTemp = {};
			oTemp.value = "001";
			oTemp.status_colour = 'Red';
			aChange[0] = $.extend({}, oTemp);
			oTemp.value = "715";
			oTemp.status_colour = 'Red';
			aChange[1] = $.extend({}, oTemp);
			oTemp.value = "815";
			oTemp.status_colour = 'Green';
			aChange[2] = $.extend({}, oTemp);
			oTemp.value = "100";
			oTemp.status_colour = 'Green';
			aChange[3] = $.extend({}, oTemp);
			OModelData.setProperty("/aClient", aChange);

			aChange = [];
			oTemp = {};
			oTemp.value = "cc2";
			aChange[1] = $.extend({}, oTemp);
			oTemp.value = "er6";
			aChange[2] = $.extend({}, oTemp);
			OModelData.setProperty("/aSystem", aChange);

			this.getView().setModel(OModelData, "geminidetails");

			var aSOT = {
				objName: SOT

			};
			this.sObj = SOT;
			var oHeaderModel = new sap.ui.model.json.JSONModel(aSOT);
			this.getView().setModel(oHeaderModel, "geminiheader");

		},

		handleMasterPress: function(oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2);
			var value = oEvent.getParameter("listItem").getCells()[0].getProperty("text");
			sap.cfnd.TestDataDeployer.value = [];
			if (oEvent.getSource().getSelectedItems().length === 0) {
				sap.cfnd.TestDataDeployer.value.push(oEvent.getParameter("listItem").getBindingContext().getProperty());
			} else {
				for (var iIndex = 0; iIndex < oEvent.getSource().getSelectedItems().length; iIndex++) {
					sap.cfnd.TestDataDeployer.value.push(oEvent.getSource().getSelectedItems()[iIndex].getBindingContext().getProperty());
				}
			}

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

		handleFullScreen: function() {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {
				layout: sNextLayout,
				SOT: this.sObj,
				facet: this.facetValue
			});
		},
		handleExitFullScreen: function() {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {
				layout: sNextLayout,
				SOT: this.sObj
			});
		},
		handleClose: function() {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {
				layout: sNextLayout
			});
		}
	});
}, true);
