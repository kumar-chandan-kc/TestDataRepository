jQuery.sap.declare("ux.fnd.test.data.manager.repository.util.APIMetadataHandler");

sap.ui.define([
	'sap/m/MessageBox'
], function(MessageBox) {
	"use strict";

	ux.fnd.test.data.manager.repository.util.APIMetadataHandler = {

		loadODataMetadata: function(sAPIUrl, oSessionModel, fCallBack) {
			var sSelectedSystemCode = oSessionModel.getProperty("/systemSpecific/selectedSystemCode");
			var sSelectedSystemClient = oSessionModel.getProperty("/systemSpecific/selectedSystemClient");
			if (sSelectedSystemCode && sSelectedSystemClient) {
				var oUrlParams = {
					"sap-client": sSelectedSystemClient
				};
				new sap.ui.model.odata.v2.ODataModel("/onprem/" + sSelectedSystemCode + sAPIUrl, {
					serviceUrlParams: oUrlParams,
					metadataUrlParams: oUrlParams
				}).attachMetadataLoaded(jQuery.proxy(function(oEvent) {
					oSessionModel.setProperty("/systemSpecific/selectedAPIODataModel", oEvent.getSource());
					ux.fnd.test.data.manager.repository.util.APIMetadataHandler.parseMetadata(oEvent.getSource(), oSessionModel, fCallBack);
				}, this)).attachMetadataFailed(function(oError) {
					MessageBox.error("Failed to read API Metadata");
				});
			} else
				MessageBox.error("Choose System and Client...");
		},

		parseMetadata: function(oDataModel, oSessionModel, fCallBack) {
			// temporary logic to parse the metadata - check for any standard methods from ui5
			var oMetaDataObject = oDataModel.getServiceMetadata().dataServices.schema[0];
			try {
				var oAPIMetadataHandler = ux.fnd.test.data.manager.repository.util.APIMetadataHandler;
				var oEntityTypeToEntitySetMap = oAPIMetadataHandler.fetchEntityTypeToEntitySetMap(oMetaDataObject.entityContainer, oMetaDataObject.namespace);
				var aEntityTypes = oAPIMetadataHandler.fetchEntityType(oMetaDataObject, oEntityTypeToEntitySetMap);
				oSessionModel.setProperty("/systemSpecific/selectedAPIMetadata", {
					entityTypes: aEntityTypes
				});
				oSessionModel.updateBindings();
				if (fCallBack && fCallBack instanceof Function)
					fCallBack()
			} catch (exception) {
				MessageBox.error("API metadata not complete/parsing failed...");
			}
		},

		fetchEntityTypeToEntitySetMap: function(oEntityContainer, sNamespace) {
			var oEntityTypeToEntitySetMap = {};
			if (oEntityContainer && oEntityContainer instanceof Array && oEntityContainer[0]) {
				if (oEntityContainer[0].entitySet && oEntityContainer[0].entitySet instanceof Array) {
					jQuery.each(oEntityContainer[0].entitySet, function(index, oEntitySet) {
						var sEntityType = oEntitySet.entityType.split(sNamespace + ".")[1];
						oEntityTypeToEntitySetMap[sEntityType] = oEntitySet.name;
					});
				} else
					throw "entitySet in metadata has an invalid format";
			} else
				throw "entityContainer in metadata has an invalid format";
			return oEntityTypeToEntitySetMap;
		},

		fetchEntityType: function(oMetaDataObject, oEntityTypeToEntitySetMap) {
			if (oMetaDataObject.entityType && oMetaDataObject.entityType instanceof Array) {
				var oEntitySetMap = {};
				jQuery.each(oMetaDataObject.entityType, function(index, oEntityType) {
					var oEntityInfo = {
						name: oEntityType.name,
						label: ux.fnd.test.data.manager.repository.util.APIMetadataHandler.fetchExtensionValue(oEntityType.extensions, "label", ""),
						type: "entityType",
						entitySet: oEntityTypeToEntitySetMap[oEntityType.name],
						properties: ux.fnd.test.data.manager.repository.util.APIMetadataHandler.fetchEntityProperties(oEntityType.property, oEntityType.key)
					};
					var aNavigations = ux.fnd.test.data.manager.repository.util.APIMetadataHandler.fetchNavigationProperties(oEntityType.navigationProperty);
					if (aNavigations && aNavigations instanceof Array && aNavigations.length) {
						ux.fnd.test.data.manager.repository.util.APIMetadataHandler.addNavigationEntityTypes(aNavigations, oMetaDataObject)
						oEntityInfo.properties = oEntityInfo.properties.concat(aNavigations);
					}
					oEntitySetMap[oEntityInfo.entitySet] = oEntityInfo;
				});
				var aEntityTypes = ux.fnd.test.data.manager.repository.util.APIMetadataHandler.buildHierarchy(oEntitySetMap);
				return aEntityTypes;
			} else
				throw "entityTypes in metadata has an invalid format";
		},

		fetchExtensionValue: function(aExtensions, sKey, sDefaultValue) {
			var sValue = sDefaultValue;
			if (aExtensions && aExtensions instanceof Array) {
				jQuery.each(aExtensions, function(index, oExtension) {
					if (oExtension && oExtension.name == sKey) {
						sValue = oExtension.value;
						return false;
					}
				});
			}
			return sValue;
		},

		fetchEntityProperties: function(aPropertyObjects, oKeys) {
			var aProperties = [];
			var aKeys = [];
			if (oKeys && oKeys.propertyRef instanceof Array) {
				jQuery.each(oKeys.propertyRef, function(index, oKey) {
					aKeys.push(oKey.name);
				});
			} else
				throw "entity is not having keys";
			if (aPropertyObjects && aPropertyObjects instanceof Array) {
				jQuery.each(aPropertyObjects, function(index, oProperty) {
					var oEntry = {
						name: oProperty.name,
						label: ux.fnd.test.data.manager.repository.util.APIMetadataHandler.fetchExtensionValue(oProperty.extensions, "label", ""),
						creatable: ux.fnd.test.data.manager.repository.util.APIMetadataHandler.fetchExtensionValue(oProperty.extensions, "creatable", true),
						type: "property"
					};
					if (aKeys.indexOf(oProperty.name) >= 0)
						oEntry.isKey = true;
					aProperties.push(oEntry);
				});
			}
			return aProperties;
		},

		fetchNavigationProperties: function(aNavigationProperties) {
			var aNavigations = [];
			if (aNavigationProperties && aNavigationProperties instanceof Array) {
				jQuery.each(aNavigationProperties, function(index, oNavigation) {
					aNavigations.push({
						navigationName: oNavigation.name,
						relationShip: oNavigation.relationship,
						fromRole: oNavigation.fromRole,
						toRole: oNavigation.toRole
					});
				});

			}
			return aNavigations;
		},

		addNavigationEntityTypes: function(aNavigations, oMetaDataObject) {
			var oAssociationMap = ux.fnd.test.data.manager.repository.util.APIMetadataHandler.fetchAssociationMap(oMetaDataObject.entityContainer);
			if (aNavigations && aNavigations instanceof Array) {
				jQuery.each(aNavigations, function(index, oNavigation) {
					var oAssociation = oAssociationMap[oNavigation.relationShip];
					if (oAssociation && oAssociation.mapping instanceof Array && oAssociation.mapping.length == 2) {
						var oMapping = oAssociation.mapping;
						oNavigation.entitySet = (oMapping[0].role == oNavigation.toRole) ? oMapping[0].entitySet : oMapping[1].entitySet;
					} else
						throw "not able to map navigation to association";
				});
			}
		},

		fetchAssociationMap: function(oEntityContainer) {
			var oAssociationMap = {};
			if (oEntityContainer && oEntityContainer instanceof Array && oEntityContainer[0]) {
				if (oEntityContainer[0].associationSet && oEntityContainer[0].associationSet instanceof Array) {
					jQuery.each(oEntityContainer[0].associationSet, function(index, oAssociationSet) {
						oAssociationMap[oAssociationSet.association] = {
							mapping: oAssociationSet.end
						};
					});
				}
			} else
				throw "entityContainer in metadata has an invalid format";
			return oAssociationMap;
		},

		buildHierarchy: function(oEntitySetMap) {
			var aEntityTypes = [];
			jQuery.each(oEntitySetMap, function(sEntitySetMap, oEntityType) {
				if (oEntityType && oEntityType.properties instanceof Array) {
					jQuery.each(oEntityType.properties, function(index, oProperty) {
						if (oProperty.navigationName) {
							var oEntityType = oEntitySetMap[oProperty.entitySet];
							jQuery.extend(oProperty, oEntityType);
							oEntityType.isPartOfNavigation = true;
						}
					});
				}
			});
			// cyclic dependency has to be handled - c_overduepo_cds
			jQuery.each(oEntitySetMap, function(sEntitySetMap, oEntityType) {
				if (!oEntityType.isPartOfNavigation)
					aEntityTypes.push(oEntityType);
			});
			return aEntityTypes;
		}

	};

	return ux.fnd.test.data.manager.repository.util.APIMetadataHandler;

});
