frappe.ui.form.on("User", {
    setup: function(frm) {
        frm.set_query("role_profile_name", function() {
            return {
                filters: [
                    ["Role Profile", "name", "not in", ["Individual", "Essential","Pro","Ultimate"]]
                ]
            };
        });
    }
});
