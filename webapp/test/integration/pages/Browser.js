sap.ui.define([
	"sap/ui/test/Opa5",
	"./Common"
], function (Opa5, Common) {
	"use strict";

	Opa5.createPageObjects({
		onTheBrowser: {
			baseClass: Common,

			actions: {

				iGoBack: function () {
					return this.waitFor({
						success: function () {
							// manipulate history directly for testing purposes
							Opa5.getWindow().history.back();
						}
					});
				},

				iGoForward: function () {
					return this.waitFor({
						success: function () {
							// manipulate history directly for testing purposes
							Opa5.getWindow().history.forward();
						}
					});
				},

				iChangeTheHashToSomethingInvalid: function () {
					return this.waitFor({
						success: function () {
							Opa5.getHashChanger().setHash("somethingInvalid");
						}
					});
				},

				iChangeTheHashToTheRememberedItem: function () {
					return this.waitFor({
						success: function () {
							var sObjectId = this.getContext().currentItem.id;
							Opa5.getHashChanger().setHash("ZC_ProtifCreditView/" + sObjectId);
						}
					});
				}
			},

			assertions: {}
		}

	});
});
