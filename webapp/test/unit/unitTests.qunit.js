/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/pro/phase2/ZPRO_PROTIF2/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});