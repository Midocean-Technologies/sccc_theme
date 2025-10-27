frappe.ui.form.on(cur_frm.doctype, {
    refresh(frm) {
        if (frm.fields_dict.gender) {
            frm.set_df_property("gender", "only_select", true);
        }
    }
});
