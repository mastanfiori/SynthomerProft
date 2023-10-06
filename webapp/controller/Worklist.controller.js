sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Fragment, oMessageBox, oMessageToast) {
	"use strict";
	var i18nModel;
	return BaseController.extend("com.pro.phase2.ZPRO_PROTIF2.controller.Worklist", {

		formatter: formatter,

		/* ========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {

			// smart filter bar
			this._smartFilterBar = this.getView().byId("smartFilterBar");

			var thiz = this;
			var sUrl = "/sap/opu/odata/sap/ZC_PROTIFTILECOUNT_CDS/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);

			var arr = {};
			arr.ordersonhold = "";
			arr.previouslyreleasedorders = "";
			arr.overduepaymentterms = "";
			arr.exceddedcreditlimit = "";
			arr.zerovalue = "";
			arr.vaildtoexpired = "";
			arr.advancepaymentterms = "";

			var aFilters1 = [];

			var filter1 = new Filter("Tile", "EQ", '01');
			aFilters1.push(filter1);

			var aFilters2 = [];
			var filter2 = new Filter("Tile", "EQ", '02');
			aFilters2.push(filter2);

			var aFilters3 = [];

			var filter3 = new Filter("Tile", "EQ", '03');
			aFilters3.push(filter3);

			var aFilters4 = [];

			var filter4 = new Filter("Tile", "EQ", '04');
			aFilters4.push(filter4);

			var aFilters5 = [];

			var filter5 = new Filter("Tile", "EQ", '05');
			aFilters5.push(filter5);

			var aFilters6 = [];

			var filter6 = new Filter("Tile", "EQ", '06');
			aFilters6.push(filter6);

			var aFilters7 = [];

			var filter7 = new Filter("Tile", "EQ", '07');
			aFilters7.push(filter7);
			oModel.read("/ZC_ProtifTileCount/$count", {
				filters: aFilters1,
				success: function (oData, Response) {

					var arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.ordersonhold = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);

				}
			});

			oModel.read("/ZC_ProtifTileCount/$count", {
				filters: aFilters2,
				success: function (oData, Response) {

					var arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.previouslyreleasedorders = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);

				}
			});

			oModel.read("/ZC_ProtifTileCount/$count", {
				filters: aFilters3,
				success: function (oData, Response) {

					var arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.overduepaymentterms = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);

				}
			});

			oModel.read("/ZC_ProtifTileCount/$count", {
				filters: aFilters4,
				success: function (oData, Response) {

					var arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.exceddedcreditlimit = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);

				}
			});

			oModel.read("/ZC_ProtifTileCount/$count", {
				filters: aFilters5,
				success: function (oData, Response) {

					var arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.zerovalue = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);

				}
			});

			oModel.read("/ZC_ProtifTileCount/$count", {
				filters: aFilters6,
				success: function (oData, Response) {

					var arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.vaildtoexpired = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);

				}
			});

			oModel.read("/ZC_ProtifTileCount/$count", {
				filters: aFilters7,
				success: function (oData, Response) {

					var arr = thiz.getOwnerComponent().getModel("KPI").getData();
					arr.advancepaymentterms = Response.body;
					thiz.getOwnerComponent().getModel("KPI").setData(arr);

				}
			});

			// company code search help

			var thiz = this;
			var sUrl1 = "/sap/opu/odata/sap/ZC_PROTIFCREDITVIEW_CDS/";
			var oModel1 = new sap.ui.model.odata.ODataModel(sUrl1, true);

			oModel1.read("/ZI_CompanyCodeVH", {

				success: function (oData, Response) {

				}
			});

		},

		// notification check box clicked in main screen
		onSelected: function (oEvt) {
			i18nModel = this.getView().getModel("i18n").getResourceBundle();
			var oData = oEvt.getSource().getBindingContext().getObject();
			//	var oDataModel = this.getOwnerComponent().getModel();

			var sUrl = "/sap/opu/odata/sap/ZPROTIF_KPI_TILES_SRV/";
			var oDataModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			var oSelected = oEvt.getSource().getSelected();
			if (oSelected == true) {
				oSelected = 'X';
			}
			if (oSelected == false) {
				oSelected = '';
			}

			// call backend odata call
			var that = this;
			var data = {
				VBELN: oData.SalesOrderNumber,
				LINEITEM: oData.LineItem,
				NOTIFICATION: oSelected

			};

			sap.ui.core.BusyIndicator.show(0);
			oDataModel.create("/salesorderSet", data, {
				success: function (oData, oResponse) {
					sap.ui.core.BusyIndicator.hide();
					if (oData.NOTIFICATION == 'X') {

						var oMsg = i18nModel.getText("notActive") + " " + oData.VBELN;
						oMessageBox.success(oMsg);

					} else {
						var oMsg = i18nModel.getText("notInActive") + " " + oData.VBELN;
						oMessageBox.success(oMsg);
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},

		onPress1: function (oEvt) {
			this.onSearch = "false";
			this.getOwnerComponent().getModel("zbinding").setData("01");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},

		onPress2: function (oEvt) {
			this.onSearch = "false";
			this.getOwnerComponent().getModel("zbinding").setData("02");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},

		onPress3: function (oEvt) {
			this.onSearch = "false";
			this.getOwnerComponent().getModel("zbinding").setData("03");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},

		onPress4: function (oEvt) {
			this.onSearch = "false";
			this.getOwnerComponent().getModel("zbinding").setData("04");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},

		onPress5: function (oEvt) {
			this.onSearch = "false";
			this.getOwnerComponent().getModel("zbinding").setData("05");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},

		onPress6: function (oEvt) {
			this.onSearch = "false";
			this.getOwnerComponent().getModel("zbinding").setData("06");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},

		onPress7: function (oEvt) {
			this.onSearch = "false"
			this.getOwnerComponent().getModel("zbinding").setData("07");
			this.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

		},

		onRefresh1: function (oEvt) {
			this.onInit();

		},

		// sales document link press in main page and detail page
		handleOperationLinkPress: function (oEvt) {
			this.Salesorder = oEvt.getSource().getText();

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

		onSave: function (oEvt) {

			var that = this;
			var arr = [];
			var row, context;
			var oView = that.getView();
			var oItems = sap.ui.getCore().byId("oTableRel").getSelectedItems();

			for (var i = 0; i < oItems.length; i++) {
				var obj = {};
				row = oItems[i];
				context = row.getBindingContext("ZRELEASE");
				obj = context.getObject();
				arr.push(obj);
				this.getOwnerComponent().getModel("ZRELEASE_CALL").setData(arr);
			}

			var oData = this.getOwnerComponent().getModel("ZRELEASE_CALL").getData();
			var oData2 = [];

			for (var i = 0; i < oData.length; i++) {

				var oData1 = {};

				oData1.SalesOrderNumber = oData[i].SalesOrderNumber;
				oData1.CompanyCodeText = oData[i].CompanyCodeText;
				oData1.Country = oData[i].Country;
				oData1.RELEASESTATUS = "Awaiting Confirmation";

				oData2.push(oData1);
			}

			var data = {

				"Releaseto": oData2

			};

			var thiz = this;
			var sUrl = "/sap/opu/odata/sap/ZPROTIF_CREDIT_MANAGEMENT_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);

			oModel.create("/ReleaseSet", data, {

				success: function (oData, oResponse) {

					thiz.getOwnerComponent().getModel("ZRELEASE").setData(oData.Releaseto.results);
					var oSelectedItems = sap.ui.getCore().byId("oTableRel").getSelectedItems();
					var oPopRes = oData.Releaseto.results;
					for (var i = 0; i < oSelectedItems.length; i++) {
						for (var j = 0; j < oPopRes.length; j++) {

							var oSalesOrder = sap.ui.getCore().byId("oTableRel").getSelectedItems()[i].getCells()[0].getText();
							if (oPopRes[j].SalesOrderNumber == oSalesOrder && oPopRes[j].TYPE == 'S') {
								sap.ui.getCore().byId("oTableRel").getSelectedItems()[i].getMultiSelectControl().setEnabled(false);
							}

						}

					}

					thiz.getView().byId("smrtTblSpecificBadDebt1").rebindTable();

					//		sap.ui.getCore().byId("oTableRel").removeSelections(true);
					thiz.getView().byId("treeTable1").removeSelections(true);

				},
				error: function (oError) {

				}
			});

			//	this.pDialog.close();
		},

		onCancel: function (oEvt) {
			this.getView().byId("treeTable1").removeSelections(true);

			var oSelectedItems = sap.ui.getCore().byId("oTableRel").getSelectedItems();

			for (var i = 0; i < oSelectedItems.length; i++) {

				sap.ui.getCore().byId("oTableRel").getSelectedItems()[i].getMultiSelectControl().setEnabled(true);

			}

			sap.ui.getCore().byId("oTableRel").removeSelections(true);

			this.pDialog.close();
		},

		onDetail: function (oEvt) {

		},

		onDataGet: function (oSource) {
			// when click on ant kpi tile, globally saving tile description in zbinding model
			// and reading the data below and adding it to filter.
			var binding = oSource.getParameter("bindingParams");
			this.getView().byId("smrtTblSpecificBadDebt1").getModel().refresh(true);

			var data = this.getOwnerComponent().getModel("zbinding").getData();
			var thiz = this;

			// below logic is only when kpi tile clicked.

			if (this.onSearch != "true") {

				if (data == "01" || data == "02" || data == "03" || data == "04" || data == "05" || data == "06" || data == "07") {

					if (data == "0") {

						var oFilter = new sap.ui.model.Filter("Tile", sap.ui.model.FilterOperator.CP, data);
						binding.filters.push(oFilter);
						//	this.getOwnerComponent().getModel("zbinding").setData();

					} else {
						if (data != "") {
							var oFilter = new sap.ui.model.Filter("Tile", sap.ui.model.FilterOperator.EQ, data);
							binding.filters.push(oFilter);
							//	this.getOwnerComponent().getModel("zbinding").setData();
						}
					}
				}

			}

			// international order passing manually, because in smartfilter used custom control

			var oIo = thiz.getView().byId("intenrationalorder").getSelectedKeys();

			for (var i = 0; i < oIo.length; i++) {

				var oIos = thiz.getView().byId("intenrationalorder").getSelectedKeys()[i];

				var oFilter = new sap.ui.model.Filter("InternationalOrder", sap.ui.model.FilterOperator.EQ, oIos);
				binding.filters.push(oFilter);

			}

		},

		// onsearch will be true when click on 'Go' button
		onSearch1: function (oEvt) {
			this.onSearch = 'true';
		},

		onRelease: function (oEvt) {

			var that = this;
			var arr = [];
			var row, context;
			var oView = that.getView();
			var oItems = this.getView().byId("treeTable1").getSelectedItems();

			for (var i = 0; i < oItems.length; i++) {
				var obj = {};
				row = oItems[i];
				context = row.getBindingContext();
				obj = context.getObject();
				obj.RELEASESTATUS = "Awaiting Confirmation"
				arr.push(obj);

				this.getOwnerComponent().getModel("ZRELEASE").setData(arr);
			}

			if (!this.pDialog) {
				this.pDialog = sap.ui.xmlfragment(
					"com.pro.phase2.ZPRO_PROTIF2.view.release",
					this
				);
				this.getView().addDependent(this.pDialog);
			}

			// open value help dialog
			this.pDialog.open();

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("worklistView"),
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

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("SalesOrderNumber", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */

		onTableRowSelect: function (oEvt) {

		},

		_showObject: function (oItem) {
			i18nModel = this.getView().getModel("i18n").getResourceBundle();
			var arr = [];
			var row, context;
			var oView = this.getView();
			var oItems = this.getView().byId("treeTable1").getSelectedItems();

			if (oItems.length != 1) {
				var oMsg = i18nModel.getText("sel");
				oMessageBox.error(oMsg);
				return;
			}

			var obj = {};
			row = oItems[0];
			context = row.getBindingContext();
			obj = context.getObject();

			this.getOwnerComponent().getModel("ZDETAIL").setData(obj);

			this.getRouter().navTo("object", {
				//	objectId: oItem.getBindingContext().getProperty("SalesOrderNumber")
				objectId: obj.SalesOrderNumber

			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},

		// custom control variants save
		onBeforeVariantFetch: function (oEvent) {
			this._updateCustomFilter();
		},

		_updateCustomFilter: function () {
			if (this._smartFilterBar) {

				var InternationalOrder = this._smartFilterBar.determineControlByName("InternationalOrder");
				var RagStatus = this._smartFilterBar.determineControlByName("RagStatus");

				this._smartFilterBar.setFilterData({
					_CUSTOM: {

						InternationalOrder: InternationalOrder.getProperty('selectedKeys'),
						RagStatus: RagStatus.getProperty('selectedKeys'),
					}
				});

				//	}
			}
		},

		onAfterVariantLoad: function (oEvent) {
			if (this._smartFilterBar) {

				var oData = this._smartFilterBar.getFilterData();
				var oCustomFieldData = oData["_CUSTOM"];

				var RagStatus = this._smartFilterBar.determineControlByName("RagStatus");

				if (RagStatus) {
					RagStatus.setSelectedKeys(oCustomFieldData.RagStatus);

				}

				var InternationalOrder = this._smartFilterBar.determineControlByName("InternationalOrder");

				if (InternationalOrder) {
					InternationalOrder.setSelectedKeys(oCustomFieldData.InternationalOrder);
					nternationalOrder.setselectedKeys(oCustomFieldData.InternationalOrder);

				}

			}

		},

	});
});