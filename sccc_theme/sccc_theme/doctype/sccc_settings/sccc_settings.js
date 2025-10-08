// Copyright (c) 2025, midocean technologies Pvt LTD and contributors
// For license information, please see license.txt

frappe.ui.form.on("sccc settings", {
	refresh(frm) {
        frm.add_custom_button(__("After Install"), function(){
			frm.call({
				method: "sccc_theme.utils.utils.after_migrate",
				callback: function (r) {
					if (!r.exc) {
						frappe.msgprint("Bench executed successfully");
					}
				}
			});
		}, __("Quick Action"));

	},
});