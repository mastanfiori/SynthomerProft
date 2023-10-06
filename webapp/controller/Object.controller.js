sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, oMessageBox, oMessageToast, Filter, FilterOperator, MessageBox, MessageToast) {
	"use strict";
		var i18nModel;

	return BaseController.extend("com.pro.phase2.ZPRO_PROTIF2.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {

			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onInvoice: function (oEvt) {
/*
			this.Customer = this.getOwnerComponent().getModel("ZDETAIL").getData().Payer;
			var url = window.location.origin + '/sap/bc/ui2/flp?#Customer-display?manageLineItems=' + this.Customer;
			window.open(url);
*/
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			
			this.getView().byId("idIconTabBarNoIcons").setSelectedKey("overdue");

			var that = this;

			var sUrl = "/sap/opu/odata/sap/ZPROTIF_CREDIT_MANAGEMENT_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(sUrl, true);

			var oSales = this.getOwnerComponent().getModel("ZDETAIL").getData().SalesOrderNumber;
			if (oSales) {

			} else {

				oSales = oEvent.getParameter("arguments").objectId;
				var aFilters1 = [];

				var filter1 = new Filter("SalesOrderNumber", "EQ", oSales);
				aFilters1.push(filter1);
				oDataModel.read("/ZC_ProtifCreditView", {
					filters: aFilters1,
					success: function (data) {
						that.getOwnerComponent().getModel("ZDETAIL").setData(data.results[0]);
					}
				});

			}

			var aFilters = [];

			var filter = new Filter("SalesOrder", "EQ", oSales);
			aFilters.push(filter);

			oDataModel.read("/SO_NoteSet", {
				filters: aFilters,
				success: function (data) {
					that.getOwnerComponent().getModel("EntryCollection").setData(data.results);
					that.getOwnerComponent().getModel("CountNotesNo").setData(data.results.length);
				}
			});

			this.getView().byId("smrtTblSpecificBadDebt11").rebindTable();
			this.getView().byId("smrtTblSpecificBadDebt12").rebindTable();
		},

		onDataGet: function (oSource) {

			// and reading the data below and adding it to filter.
			var binding = oSource.getParameter("bindingParams");
			var oSales = this.getOwnerComponent().getModel("ZDETAIL").getData().SalesOrderNumber;
			var thiz = this;

			var oFilter = new sap.ui.model.Filter("SalesOrderNumber", sap.ui.model.FilterOperator.EQ, oSales);
			binding.filters.push(oFilter);

		},

		onPost: function (oEvent) {
			i18nModel = this.getView().getModel("i18n").getResourceBundle();
			var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
				format: "yMMMd"
			});
			var oType = this.getOwnerComponent().getModel("ZDETAIL").getData().DEPARTMENT;
			var oDate = new Date();
			var oHrs = oDate.getHours(); // => 9
			var oMins = oDate.getMinutes(); // =>  30
			var oSecs = oDate.getSeconds();
			var oTime = oHrs + ":" + oMins + ":" + oSecs;
			var sDate = oFormat.format(oDate);
			// create new entry
			var sValue = oEvent.getParameter("value");
			var oAuthor = this.getOwnerComponent().getModel("ZDETAIL").getData().UserId;
			var oEntry = {
				AUTHOR: oAuthor,
				AuthorPicUrl: "MK",
				Type: oType,
				Date: "" + sDate + " " + oTime,
				Notetext: sValue
			};

			// update model
			var oModel = this.getOwnerComponent().getModel("EntryCollection").getData();
			if (oModel.length === undefined) {
				oModel = [];
				oModel.push(oEntry);

			} else {
				oModel.push(oEntry);

			}
			//sending call to backend

			var that = this;
			var oSales = this.getOwnerComponent().getModel("ZDETAIL").getData().SalesOrderNumber;
			var data = {

				SalesOrder: oSales,
				AUTHOR: oAuthor,

				Notetext: sValue

			};
			//	var oDataModel = this.getOwnerComponent().getModel();

			var sUrl = "/sap/opu/odata/sap/ZPROTIF_CREDIT_MANAGEMENT_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(sUrl, true);

			sap.ui.core.BusyIndicator.show(0);
			oDataModel.create("/SO_NoteSet", data, {

				success: function (oData, oResponse) {
					if (oData.SalesOrder != "") {
						var oMsg = i18nModel.getText("notessaved") + "-" + oData.SalesOrder;
						oMessageBox.success(oMsg);

					}

					sap.ui.core.BusyIndicator.hide();

				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

			//		var oSalesOrder = this.getOwnerComponent().getModel("zsalesorder").getData();
			var aFilters = [];

			var filter = new Filter("SalesOrder", "EQ", oSales);
			aFilters.push(filter);

			oDataModel.read("/SO_NoteSet", {
				filters: aFilters,
				success: function (data) {
					that.getOwnerComponent().getModel("EntryCollection").setData(data.results);
					that.getOwnerComponent().getModel("CountNotesNo").setData(data.results.length);
				}
			});

		},

		// sales document link press in main page and detail page
		handleOperationLinkPress: function (oEvt) {
			this.Salesorder = oEvt.getSource().getText();
			this.Salesorder = this.Salesorder.split(":")[1];

			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "SalesDocument",
						action: "display"
					},
					params: {
						"SalesDocument": this.Salesorder
					}
				});
			}
		},

		onRelease: function (oEvt) {

			i18nModel = this.getView().getModel("i18n").getResourceBundle();
			sap.ui.core.BusyIndicator.show(0);

			var that = this;
			var arr = [];
			var row, context;
			var oView = that.getView();

			var oData1 = {};
			var oData2 = [];
			oData1.SalesOrderNumber = this.getOwnerComponent().getModel("ZDETAIL").getData().SalesOrderNumber;
			oData1.CompanyCodeText = this.getOwnerComponent().getModel("ZDETAIL").getData().CompanyCodeText;
			oData1.Country = this.getOwnerComponent().getModel("ZDETAIL").getData().PayerCountry;
			oData1.RELEASESTATUS = "Awaiting Confirmation";

			oData2.push(oData1);

			var data = {
				"Releaseto": oData2

			};

			var thiz = this;
			var sUrl = "/sap/opu/odata/sap/ZPROTIF_CREDIT_MANAGEMENT_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);

			oModel.create("/ReleaseSet", data, {

				success: function (oData, oResponse) {

					var oMsgType = oData.Releaseto.results[0].TYPE;
					if (oMsgType == 'S') {
						var oMsg = i18nModel.getText("Released");
						MessageBox.success(oMsg);

					}

					if (oMsgType == 'E') {
						MessageBox.error(oData.Releaseto.results[0].RELEASESTATUS);
					}
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

			//	this.pDialog.close();
		},

		onRefresh: function (oEvt) {

			var that = this;

			var sUrl = "/sap/opu/odata/sap/ZPROTIF_CREDIT_MANAGEMENT_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(sUrl, true);

			var oSales = this.getOwnerComponent().getModel("ZDETAIL").getData().SalesOrderNumber;

			var aFilters = [];

			var filter = new Filter("SalesOrder", "EQ", oSales);
			aFilters.push(filter);

			oDataModel.read("/SO_NoteSet", {
				filters: aFilters,
				success: function (data) {
					that.getOwnerComponent().getModel("EntryCollection").setData(data.results);
					that.getOwnerComponent().getModel("CountNotesNo").setData(data.results.length);
				}
			});

			var aFilters1 = [];

			var filter1 = new Filter("SalesOrderNumber", "EQ", oSales);
			aFilters1.push(filter1);

			oDataModel.read("/ZC_ProtifCreditView", {
				filters: aFilters1,
				success: function (oData, Response) {

					that.getOwnerComponent().getModel("ZDETAIL").setData(oData.results[0]);

				}
			});

		},

		onEdit: function (oEvt) {

			var oItemText = this.getOwnerComponent().getModel("ZDETAIL").getData().ItemText;

			if (!this.pDialog) {
				this.pDialog = sap.ui.xmlfragment(
					"com.pro.phase2.ZPRO_PROTIF2.view.DocumentText",
					this
				);
				this.getView().addDependent(this.pDialog);
			}

			// open value help dialog
			this.pDialog.open();

		},

		onCancel: function () {
			this.pDialog.close();
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.SalesOrderNumber,
				sObjectName = oObject.SalesOrderNumber;

			oViewModel.setProperty("/busy", false);
			// Add the object page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
				icon: "sap-icon://enter-more",
				intent: "#protif-display&/ZC_ProtifCreditView/" + sObjectId
			});

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

	});

});