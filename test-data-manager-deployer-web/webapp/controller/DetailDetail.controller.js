sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("ux.fnd.test.data.manager.deployer.controller.DetailDetail", {
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
			for (var iIndex = 0; iIndex < sap.cfnd.TestDataDeployer.value.length; iIndex++) {
				for (var kIndex in sap.cfnd.TestDataDeployer.value[iIndex]) {
					if (kIndex == "__metadata") {
						delete sap.cfnd.TestDataDeployer.value[iIndex][kIndex];
					}
					if (typeof sap.cfnd.TestDataDeployer.value[iIndex][kIndex] === "object" && sap.cfnd.TestDataDeployer.value[iIndex][kIndex] !==
						null) {
						sap.cfnd.TestDataDeployer.value[iIndex][kIndex] = {};
					}
				}
			}
			//var oJSONData = JSON.stringify(sap.cfnd.TestDataDeployer.value, null, "\t");
			var oJSONData = this.prettyPrint(sap.cfnd.TestDataDeployer.value);
			this.DetailDetail = {
				value: SOT,
				facet: "Product Details",
				technicalDetails: oJSONData

			};

			this.sObj = SOT;
			var oHeaderModel = new sap.ui.model.json.JSONModel(this.DetailDetail);
			this.getView().setModel(oHeaderModel, "geminiheader");

			var x = {
				"data": [{
					"name": "I_REQUESTFORQUOTATION_API01",
					"des": "I_REQUESTFORQUOTATION_API01",
					"l_des": "Request For Quotation",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_REQUESTFORQUOTATION_API01')"
				}, {
					"name": "I_RFQSCHEDULELINE_API01",
					"des": "I_RFQSCHEDULELINE_API01",
					"l_des": "Request For Quotation Schedule Line",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_RFQSCHEDULELINE_API01')"
				}, {
					"name": "I_RFQITEM_API01",
					"des": "I_RFQITEM_API01",
					"l_des": "Request For Quotation Item",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_RFQITEM_API01')"
				}, {
					"name": "I_SALESORDERITEMCUBE",
					"des": "I_SALESORDERITEMCUBE",
					"l_des": "Analytics - Incoming Sales Order Cube",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_SALESORDERITEMCUBE')"
				}, {
					"name": "I_SALESORDERTYPE",
					"des": "I_SALESORDERTYPE",
					"l_des": "Sales Order Types",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_SALESORDERTYPE')"
				}, {
					"name": "I_APS_CKE_EPM_SALESORDERITEM",
					"des": "I_APS_CKE_EPM_SALESORDERITEM",
					"l_des": "CDS Editor Test: EPM Sales Order Item",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_APS_CKE_EPM_SALESORDERITEM')"
				}, {
					"name": "I_SUPPLIERQUOTATION_API01",
					"des": "I_SUPPLIERQUOTATION_API01",
					"l_des": "Supplier Quotation",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_SUPPLIERQUOTATION_API01')"
				}, {
					"name": "I_SUPPLIERQUOTATIONITEM_API01",
					"des": "I_SUPPLIERQUOTATIONITEM_API01",
					"l_des": "Supplier Quotation Item",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_SUPPLIERQUOTATIONITEM_API01')"
				}, {
					"name": "I_SUPLRQTNSCHEDULELINE_API01",
					"des": "I_SUPLRQTNSCHEDULELINE_API01",
					"l_des": "Schedule Line of a Supplier Quotation Item",
					"link": ""
				}, {
					"name": "I_SUPPLIER",
					"des": "I_SUPPLIER",
					"l_des": "Supplier",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_SUPPLIER')"
				}, {
					"name": "I_SUPPLIERCOMPANY",
					"des": "I_SUPPLIERCOMPANY",
					"l_des": "Supplier Company",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_SUPPLIERCOMPANY')"
				}, {
					"name": "I_SUPPLIERPURCHASINGORG",
					"des": "I_SUPPLIERPURCHASINGORG",
					"l_des": "SupplierPurchasingOrganization",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_SUPPLIERPURCHASINGORG')"
				}, {
					"name": "I_ACCOUNTINGDOCUMENT",
					"des": "I_ACCOUNTINGDOCUMENT",
					"l_des": "Accounting Document",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_ACCOUNTINGDOCUMENT')"
				}, {
					"name": "I_OPERATIONALACCTGDOCCUBE",
					"des": "I_OPERATIONALACCTGDOCCUBE",
					"l_des": "Operational Accounting Document Header and Item",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_OPERATIONALACCTGDOCCUBE')"
				}, {
					"name": "I_OPERATIONALACCTGDOCITEM",
					"des": "I_OPERATIONALACCTGDOCITEM",
					"l_des": "Operational Accounting Document Item",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_OPERATIONALACCTGDOCITEM')"
				}, {
					"name": "I_PURCHASEREQUISITION_API01",
					"des": "I_PURCHASEREQUISITION_API01",
					"l_des": "Purchase Requisitions",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_PURCHASEREQUISITION_API01')"
				}, {
					"name": "I_PURCHASEORDERITEMAPI01",
					"des": "I_PURCHASEORDERITEMAPI01",
					"l_des": "Purchase Requisitions",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-client=381&sap-language=EN#CDSView-browse&/viewDetails/CDSVIEWS('I_PURCHASEORDERITEMAPI01')"
				}, {
					"name": "MM_PURDOC_HEADER",
					"des": "Purchasing Document",
					"l_des": "Purchasing Document",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('MM_PURDOC_HEADER')"
				}, {
					"name": "MM_PURDOC_ITEM",
					"des": "Purchasing Document Item",
					"l_des": "Purchasing Document Item",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('MM_PURDOC_ITEM')"
				}, {
					"name": "SD_SALESDOC",
					"des": "Sales Document",
					"l_des": "Sales Document",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('SD_SALESDOC')"
				}, {
					"name": "SD_SALESDOCITEM",
					"des": "Sales Document Item",
					"l_des": "Sales Document Item",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('SD_SALESDOCITEM')"
				}, {
					"name": "SD_DOCPARTNER",
					"des": "SD Document Partners",
					"l_des": "SD Document Partners",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('SD_DOCPARTNER')"
				}, {
					"name": "MM_PURDOC_ITEM",
					"des": "Purchasing Document Item",
					"l_des": "Purchasing Document Item",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('MM_PURDOC_ITEM')"
				}, {
					"name": "MM_PURDOC_HEADER",
					"des": "Purchasing Document",
					"l_des": "Purchasing Document",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('MM_PURDOC_HEADER')"
				}, {
					"name": "SUP_COMPANYCODE",
					"des": "Supplier Company Code Core",
					"l_des": "Supplier Company Code Core",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('SUP_COMPANYCODE')"
				}, {
					"name": "SUPPLIER_GENERAL",
					"des": "Supplier Core View",
					"l_des": "Supplier Core View",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('SUPPLIER_GENERAL')"
				}, {
					"name": "SUP_PURORG",
					"des": "Supplier Purchasing Org Core",
					"l_des": "Supplier Purchasing Org Core",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('SUP_PURORG')"
				}, {
					"name": "MM_PURREQN_ITEM",
					"des": "SSP Purchase Requisition Item",
					"l_des": "SSP Purchase Requisition Item",
					"link": "https://xtk-381.wdf.sap.corp/ui#ExtensibilityOptions-explore&/SmartObjectPage/BusinessContextSet('MM_PURREQN_ITEM')"
				}, {
					"name": "API_RFQ_PROCESS_SRV_0001",
					"des": "Process Request for Quotation",
					"l_des": "This service enables you to create Request for Quotation (RFQ) through an API call from a source system outside SAP S/4HANA Cloud or SAP S/4HANA on- Premise. Furthermore, the service enables you to read existing Request for Quotation data from the SAP S/4HANA Cloud or SAP S/4HANA on-Premise.",
					"link": "https://api.sap.com/shell/discover/contentpackage/SAPS4HANACloud/api/API_RFQ_PROCESS_SRV?section=OVERVIEW"
				}, {
					"name": "API_SALES_ORDER_SRV_0001",
					"des": "Process Sales Order",
					"l_des": "This service can be consumed by external applications in order to integrate with sales order processing in SAP S/4HANA Cloud. It enables you to retrieve sales orders in an API call. You can apply any of the filters provided or retrieve all existing data. You can also create a new sales order (a header plus the following entities: header partner, header pricing element, item, item partner, and item pricing element). For existing sales orders, you can create a new item (with the entities item partner and item pricing element). For existing sales orders, you can update the header, header partner, header pricing element, item, item partner, and item pricing element. For existing sales orders, you can delete the header, header partner, header pricing element, item, item partner, and item pricing element.",
					"link": "https://api.sap.com/shell/discover/contentpackage/SAPS4HANACloud/api/API_SALES_ORDER_SRV?section=OVERVIEW"
				}, {
					"name": "API_QTN_PROCESS_SRV_0001",
					"des": "Process Supplier Quotatiom",
					"l_des": "This service enables you to create Supplier Quotation data through an API call from a source system outside SAP S/4HANA Cloud or SAP S/4HANA on- Premise. Furthermore, the service enables you to read existing Supplier Quotation data from the SAP S/4HANA Cloud or SAP S/4HANA on-Premise system.",
					"link": "https://api.sap.com/shell/discover/contentpackage/SAPS4HANACloud/api/API_QTN_PROCESS_SRV?section=OVERVIEW"
				}, {
					"name": "7BAPI_ACC_ACTIVITY_ALLOC_CHECK",
					"des": "",
					"l_des": "",
					"link": ""
				}, {
					"name": "7BAPI_ACC_DOCUMENT_CHECK",
					"des": "",
					"l_des": "",
					"link": ""
				}, {
					"name": "7BAPI_ACC_DOCUMENT_POST",
					"des": "",
					"l_des": "",
					"link": ""
				}, {
					"name": "7BAPI_ACC_MANUAL_ALLOC_POST",
					"des": "",
					"l_des": "",
					"link": ""
				}, {
					"name": "7BAPI_ACC_PRIMARY_COSTS_POST",
					"des": "",
					"l_des": "",
					"link": ""
				}, {
					"name": "7BAPI_ACC_PRIMARY_COSTS_CHECK",
					"des": "",
					"l_des": "",
					"link": ""
				}, {
					"name": "BAPI_CODINGBLOCK_PRECHECK_HR",
					"des": "",
					"l_des": "",
					"link": ""
				}, {
					"name": "API_PURCHASEREQ_PROCESS_SRV_0001",
					"des": "Process Purchase Requisition",
					"l_des": "This service enables you to create purchase requisitions through an API call from a source system outside SAP S/4HANA Cloud or SAP S/4HANA on- Premise. Furthermore, the service enables you to read, update and delete existing purchase requisition data from the SAP S/4HANA Cloud or SAP S/4HANA on- Premise system.",
					"link": "https://api.sap.com/shell/discover/contentpackage/SAPS4HANACloud/api/API_PURCHASEREQ_PROCESS_SRV?section=OVERVIEW"
				}, {
					"name": "PUBLISHED",
					"des": "Request For Quotation Published",
					"l_des": "Request For Quotation Published",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-language=#BusinessEvent-subscriptionmanage&/?sap-iapp-state=ASIMBBIKJ6843VEHRVNAC7EYXKOH2DB2KXK0UDWY"
				}, {
					"name": "RFQFOLLOWONDOCCREATED",
					"des": "Follow on Document Created for RFQ",
					"l_des": "Follow on Document Created for RFQ",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-language=#BusinessEvent-subscriptionmanage&/?sap-iapp-state=ASCUDC3RYVHVI2AF02N9W7FZO7YKFOST7WODDG0G"
				}, {
					"name": "CHANGED",
					"des": "Sales Order Changed",
					"l_des": "Sales Order Changed",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-language=#BusinessEvent-subscriptionmanage&/?sap-iapp-state=AST2OVJKS13V7XIAR6FUKKEV0GXG5I7DD6KM8013"
				}, {
					"name": "CREATED",
					"des": "Sales Order Created",
					"l_des": "Sales Order Created",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-language=#BusinessEvent-subscriptionmanage&/?sap-iapp-state=AS6T9T3NPMBXGBW6EGH21M85IZD6GNDV90Z7E5XN"
				}, {
					"name": "AWARDED",
					"des": "Supplier Quotation Awarded",
					"l_des": "Supplier Quotation Awarded",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-language=#BusinessEvent-subscriptionmanage&/?sap-iapp-state=ASPWYAOMGLPLLWNFZWZHB67EF2XGR8H51Q2HYSCK"
				}, {
					"name": "SUBMITTED",
					"des": "Supplier Quotation Submitted",
					"l_des": "Supplier Quotation Submitted",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-language=#BusinessEvent-subscriptionmanage&/?sap-iapp-state=ASC7IGQFEWU8MUTLD7AFHKQ60UF0CUSA8R1ULTV9"
				}, {
					"name": "QUOTEFOLLOWONDOCCREATED",
					"des": "Follow on Document Created for Suplier Quotation",
					"l_des": "Follow on Document Created for Suplier Quotation",
					"link": "https://xtk-381.wdf.sap.corp/ui?sap-language=#BusinessEvent-subscriptionmanage&/?sap-iapp-state=AS7DTNR032Z4SK011FKUZJXV36V6TO35SDOZDZHR"
				}, {
					"name": "Monitor Request For Quotation Items",
					"des": "Monitor Request For Quotation Items",
					"l_des": "With this app, you can monitor request for quotation (RFQ) items",
					"link": "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F2425')/S9OP"
				}, {
					"name": "My Sales Overview",
					"des": "My Sales Overview",
					"l_des": "The Fiori application \\\"My Sales Overview\\\" provides information such as sales order data, performance figures, and quick actions using actionable cards in a dashboard format. An internal sales representative can use the app to search for, create, modify, or view sales information. This improves reaction time and allows the user to act on the most important issues first.",
					"link": "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F2200')/S9OP"
				}, {
					"name": "Schedule Sales Output",
					"des": "Schedule Sales Output",
					"l_des": "You can use this app to schedule the output of sales documents (for example, order confirmation) and display all scheduled output jobs.",
					"link": "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F2459')/S9OP"
				}, {
					"name": "Manage Supplier Quotations",
					"des": "Manage Supplier Quotations",
					"l_des": "With this feature you can display a list of awarded supplier quotations that have been received from Ariba Sourcing.",
					"link": "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F1991')/S9OP"
				}, {
					"name": "Manage Supplier Master Data",
					"l_des": "This app allows the business users to manage Supplier master data.",
					"link": "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F1053A')/S9OP"
				}, {
					"name": "Supplier Accounting Document",
					"des": "Supplier Accounting Document",
					"l_des": "This object page displays contextual information about the Supplier Accounting Document business object. You can navigate to its related business objects and to related transactional apps, and you can access related transactions in ABAP back-end systems.",
					"link": "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F1732')/S9OP"
				}, {
					"name": "Customer Accounting Document",
					"des": "Customer Accounting Document",
					"l_des": "This fact sheet displays contextual information about the Customer Accounting Document. You can navigate to its related business objects.",
					"link": "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F1625')/W12"
				}, {
					"name": "Create Purchase Requisitions",
					"des": "Create Purchase Requisitions",
					"l_des": "With this feature, you can use this app to create purchase requisitions from the SAP S/4HANA hub system for the Central Requisitioning scenario. With this app, you can create purchase requisitions using existing items or by entering the description of a free text item.",
					"link": "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F1643')/S9OP"
				}, {
					"name": "Manage Purchase Requisition Profesional",
					"des": "Manage Purchase Requisition Profesional",
					"l_des": "With this feature, you can use cross-catalog search to search for items and can also add service items to a purchase requisition. You can also copy an existing purchase requisition to create a new purchase requisition.",
					"link": "https://fioriappslibrary.hana.ondemand.com/sap/fix/externalViewer/#/detail/Apps('F2229')/S9OP"
				}, {
					"name": "I_PURREQNACCTASSGMT_API01",
					"des": "I_PURREQNACCTASSGMT_API01",
					"l_des": "Purchase Requisitions",
					"link": "https://xtk-381.wdf.sap.corp/ui#CDSView-browse&/viewDetails/CDSVIEWS('I_PURREQNACCTASSGMT_API01')"
				}]
			};
			var data = x.data.filter(function (b) {
				return b.des === SOT;
			});
			this.oModel = new sap.ui.model.json.JSONModel(data[0]);
			this.getView().setModel(this.oModel, "DemoDetailDetailGemini");

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