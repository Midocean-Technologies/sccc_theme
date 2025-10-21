// Copyright (c) 2025, midocean technologies Pvt LTD and contributors
// For license information, please see license.txt

frappe.ui.form.on("sccc settings", {
	refresh(frm) {
		frm.add_custom_button(__("After Install"), function () {
			frappe.confirm(
				"Are you sure you want to run After Install?",
				function () {
					frm.call({
						method: "sccc_theme.utils.utils.after_migrate",
						callback: function (r) {
							if (!r.exc) {
								frappe.msgprint("Bench executed successfully");
							}
						}
					});
				},
			);
		}, __("Quick Action"));

		frm.add_custom_button(__("Unzip Files"), function () {
			frappe.confirm(
				"Do you want to unzip and add files to File Manager?",
				function () {
					frm.call({
						method: "sccc_theme.utils.api.unzip_files",
						callback: function (r) {
							if (!r.exc) {
								frappe.msgprint("Files unzipped successfully!");
							}
						}
					});
				},
			);
		}, __("Quick Action"));
	},
});
