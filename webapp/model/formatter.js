sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		setNotif: function (val) {

			val = JSON.parse(val);
			return val;

		},
		
	setCreditColor1:function(oEvt)
	{
		
		if(oEvt == "")
		{
			return "Success";
		}
		else
		{
			return "Error";	
		}
		
	},
		

		setDateColor: function (b) {
			var c = new Date();
			if (b > c) {
				return 'Success';
			} else {
				return 'Error';
			}

			// to compare today date
			c = c.getDate().toString() + "/" + c.getMonth().toString() + "/" + c.getFullYear().toString();
			b = b.getDate().toString() + "/" + bgetMonth().toString() + "/" + b.getFullYear().toString();

			if (b == c) {
				return 'Success';
			}

		},

		setCredit: function (a, b, c, d, e, f, g, h) {

			if (a) {
				if (a != "") {
					return a;
				}
			}

			if (b) {
				if (b != "") {
					return b;
				}
			}

			if (c) {
				if (c != "") {
					return c;
				}
			}

			if (d) {
				if (d != "") {
					return d;
				}
			}

			if (e) {
				if (e != "") {
					return e;
				}
			}

			if (f) {
				if (f != "") {
					return f;
				}
			}

			if (g) {
				if (g != "") {
					return g;
				}
			}

			if (h) {
				if (h != "") {
					return h;
				}
			}

		},

		setStatus: function (oEvt) {
			if (oEvt) {
				if (oEvt == "S") {
					return "sap-icon://sys-enter-2";

				}

				if (oEvt == "E") {
					return "sap-icon://error";

				}
			} else {
				return "";
			}

		},

		setStatusMessage: function (oEvt) {

			if (oEvt) {
				if (oEvt == "S") {
					return "Success";

				}

				if (oEvt == "E") {
					return "Error";

				}
			} else {
				return "None";
			}
		},

		setInternational: function (oEvt) {

			if (oEvt == "Y") {
				return 'Yes';
			} else {
				return 'No';
			}
		},

		setDate: function (oEvt) {

					if (oEvt != null) {

						var oDateFormat = sap.ui.core.LocaleData.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()).mCustomData[
							"dateFormats-short"];

						var dd = oEvt.getDate().toString();
						var MM = oEvt.getMonth().toString();
						var yyyy = oEvt.getFullYear().toString();

						oDateFormat = oDateFormat.replace("dd", dd);
						oDateFormat = oDateFormat.replace("MM", MM);
						oDateFormat = oDateFormat.replace("yyyy", yyyy);

						return oDateFormat;
					} else {

						return 'Not set';
					}
	

		},

		setShowRecord: function (oEvt, oEvt1) {

			var oRag = this.getView().byId("RAGSTATUS").getSelectedKeys();

			if(oRag.length == 0)
			{
				return true;
			}
			
			
			if (this.getView().byId("RAGSTATUS")) {

				for (var i = 0; i < oRag.length; i++) {
					if (oEvt == oRag[i]) {
                          	var cd = 'X';
						return true;
					
					}

				}
				
				if(cd!='X')
				{
					return false;
				}

			}
		

		},

		setDispatchDate: function (oEvt) {
			if (oEvt != null) {
				oEvt = oEvt.toLocaleDateString();
				return oEvt;

			}
		},

		setCreditColor: function (a) {
			if (a == '') {
				return 'Error';
			} else {
				return 'Success';
			}
		},

		setRowColor: function (ra) {
			if (ra == "R") {
				return "Error";
			}

			if (ra == "A") {
				return "Warning";
			}

			if (ra == "G") {
				return "Success";
			}
		}

	};

});