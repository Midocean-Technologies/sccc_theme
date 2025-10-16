frappe.ui.form.on("Employee", {
    refresh: function(frm) {
        alert("hello");
        frm.set_df_property("gender", "only_select", true);
    }
});
