jQuery.sap.declare("ux.fnd.test.data.manager.repository.util.APIDataFetcher");

sap.ui.define([
	'sap/m/MessageBox'
], function(MessageBox) {
	"use strict";

	ux.fnd.test.data.manager.repository.util.APIDataFetcher = {

		triggerDataFetch: function(oEvent) {
			var oAPIDataSelectorDialog = new sap.ui.xmlfragment("ux.fnd.test.data.manager.repository.fragment.AddTestDataObjectInstanceDialog");
			var oAPIDataSelectorSessionModel = new sap.ui.model.json.JSONModel();
			oAPIDataSelectorDialog.setModel(oAPIDataSelectorSessionModel, "sessionModel");
			oAPIDataSelectorSessionModel.setProperty("/oAPIDataSelectorDialog", oAPIDataSelectorDialog);
			oAPIDataSelectorDialog.setModel(oEvent.getSource().getModel("testRepoGenericModel"), "testRepoGenericModel")
			var oSourceSessionModel = oEvent.getSource().getModel("sessionModel");
			oAPIDataSelectorSessionModel.setProperty("/selectedTestDataObject", oSourceSessionModel.getProperty("/selectedTestDataObject"));
			oAPIDataSelectorSessionModel.setProperty("/selectedTestDataObjectAPI", oSourceSessionModel.getProperty("/selectedTestDataObjectAPI"));
			oAPIDataSelectorDialog.open();
		},

		fetchAPIDataInstances: function(oEvent) {
			var oButton = oEvent.getSource();
			var oSessionModel = oEvent.getSource().getModel("sessionModel");
			var sSelectedAPI = oSessionModel.getProperty("/selectedTestDataObjectAPI");
			sSelectedAPI = (sSelectedAPI.indexOf("/") >= 0) ? "/sap/opu/odata" + sSelectedAPI : "/sap/opu/odata/sap/" + sSelectedAPI;
			ux.fnd.test.data.manager.repository.util.APIMetadataHandler.loadODataMetadata(sSelectedAPI, oSessionModel, function() {
				var oBindingInfo = ux.fnd.test.data.manager.repository.util.APIDataFetcher.fetchDataBindingInfo(oSessionModel);
				oButton.getParent().getParent().bindItems(oBindingInfo);
				oButton.getParent().getParent().setModel(oSessionModel.getProperty("/systemSpecific/selectedAPIODataModel"), "oSelectedAPIODataModel");
			});
		},

		fetchDataBindingInfo: function(oSessionModel) {
			var oSelectedAPIMetadata = oSessionModel.getProperty("/systemSpecific/selectedAPIMetadata")
			var oPrimaryEntityType = oSelectedAPIMetadata.entityTypes[0];
			var sEntitySet = oPrimaryEntityType.entitySet;
			var sSelect = "";
			var sTitleBinding = "";
			var aTestDataMetaKeys = [];
			jQuery.each(oPrimaryEntityType.properties, function(index, oProperty) {
				if (oProperty.type == "property" && oProperty.isKey) {
					sSelect = (sSelect) ? sSelect + "," + oProperty.name : oProperty.name;
					sTitleBinding = (sTitleBinding) ? "/ {oSelectedAPIODataModel>" + oProperty.name + "}" : "{oSelectedAPIODataModel>" + oProperty.name + "}";
					aTestDataMetaKeys.push({
						name: oProperty.name
					});
				}
			});
			oSessionModel.setProperty("/systemSpecific/testDataMeta", {
				keys: aTestDataMetaKeys,
				fileName: ""
			});
			return {
				path: "oSelectedAPIODataModel>/" + sEntitySet,
				parameters: {
					select: sSelect
				},
				template: new sap.m.StandardListItem({
					title: sTitleBinding
				})
			};
		},

		handleSelectedData: function(oEvent) {
			var oDataModel = oEvent.getSource().getModel("oSelectedAPIODataModel");
			var oSelectedData = oEvent.getParameter("listItem");
			var oSessionModel = oSelectedData.getModel("sessionModel");
			var aProperties = oSessionModel.getProperty("/systemSpecific/selectedAPIMetadata/entityTypes/0/properties");
			var sExpand = "";
			if (aProperties && aProperties instanceof Array) {
				jQuery.each(aProperties, function(index, oProperty) {
					if (oProperty.navigationName) {
						sExpand = (sExpand) ? sExpand + "," + oProperty.navigationName : oProperty.navigationName;
					}
				});
			}
			var oUrlParameters = {};
			if (sExpand) {
				oUrlParameters["$expand"] = sExpand;
			}
			ux.fnd.test.data.manager.repository.util.APIDataFetcher.fetchSelectedDataKeyValues(oSelectedData, oSessionModel);
			var sBindingContextPath = oSelectedData.getBindingContextPath("oSelectedAPIODataModel");
			oDataModel.read(sBindingContextPath, {
				urlParameters: oUrlParameters,
				success: function(oData, oResponse) {
					var oParsedData = ux.fnd.test.data.manager.repository.util.APIDataFetcher.cleanTestDataInstanceData(oData, oSessionModel);
					oSessionModel.setProperty("/systemSpecific/selectedAPITestDataInstance", JSON.stringify(oParsedData, null, "\t"));
				},
				error: function() {
					MessageBox.error("Failed to fetch data...");
				}
			});
		},

		fetchSelectedDataKeyValues: function(oSelectedDataUIItem, oSessionModel) {
			var oData = oSelectedDataUIItem.getBindingContext("oSelectedAPIODataModel").getObject();
			var oTestDataMeta = oSessionModel.getProperty("/systemSpecific/testDataMeta");
			jQuery.each(oTestDataMeta.keys, function(index, oKey) {
				oKey.value = oData[oKey.name];
			});
		},

		cleanTestDataInstanceData: function(oData, oSessionModel) {
			var oData = JSON.parse(JSON.stringify(oData, function(key, value) {
				if (key == "__metadata" || key == "__proto__" || key == "__deferred")
					return undefined;
				else
					return value;
			}));
			oData = JSON.parse(JSON.stringify(oData, function(key, value) {
				if (!(value instanceof Array) && (value instanceof Object) && jQuery.isEmptyObject(value))
					return undefined;
				else
					return value;
			}));
			return ux.fnd.test.data.manager.repository.util.APIDataFetcher.removeNonCreatableFieldsForMainEntity(oData, oSessionModel);
		},

		removeNonCreatableFieldsForMainEntity: function(oData, oSessionModel) {
			var aProperties = oSessionModel.getProperty("/systemSpecific/selectedAPIMetadata/entityTypes/0/properties");
			var oNonCreatablePropertiesMap = {};
			if (aProperties && aProperties instanceof Array) {
				jQuery.each(aProperties, function(index, oProperty) {
					if (!oProperty.navigationName && oProperty.creatable == "false")
						delete oData[oProperty.name];
				});
			}
			return oData;
		},

		submitTestDataInstanceForReview: function(oEvent) {
			sap.ui.core.BusyIndicator.show(0);
			var oSessionModel = oEvent.getSource().getModel("sessionModel");
			var oData = oSessionModel.getProperty("/systemSpecific/selectedAPITestDataInstance");
			var oTestDataPayload = {
				releaseVersion: oSessionModel.getProperty("/releaseVersion"),
				testDataObject: oSessionModel.getProperty("/selectedTestDataObject"),
				testDataObjectAPI: oSessionModel.getProperty("/selectedTestDataObjectAPI"),
				comments: oSessionModel.getProperty("/selectedAPITestDataComment"),
				reviewers: oSessionModel.getProperty("/selectedAPITestDataReviewers"),
				testDataMeta: [
					oSessionModel.getProperty("/systemSpecific/testDataMeta")
				],
				testData: oData
			};
			// send the mapping to persistence
			jQuery.ajax({
				url: "/github/testdata",
				type: "POST",
				data: JSON.stringify(oTestDataPayload),
				contentType: "application/json",
				success: function() {
					sap.ui.core.BusyIndicator.hide();
					oSessionModel.getProperty("/oAPIDataSelectorDialog").destroy();
					MessageBox.success("Test data is added to the repository. Review pending...");
				},
				error: function() {
					sap.ui.core.BusyIndicator.hide();
					oSessionModel.getProperty("/oAPIDataSelectorDialog").destroy();
					MessageBox.error("Test data creation failed...");
				}
			});
		}
	};

	return ux.fnd.test.data.manager.repository.util.APIDataFetcher;

});
