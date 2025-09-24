frappe.ui.form.on("User", {
    refresh: function(frm) {
        frm.set_df_property("gender", "only_select", true);
    }
});
