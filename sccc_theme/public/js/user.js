frappe.ui.form.on("User", {
    setup: function(frm) {
        frm.set_query("role_profile_name", function() {
            return {
                filters: [
                    ["Role Profile", "name", "not in", ["Starter"]]
                ]
            };
        });
    },
    role_profile_name(frm) {
        if (frm.doc.role_profile_name) {
            frappe.db.exists("Module Profile", frm.doc.role_profile_name).then(exists => {
                if (exists) {
                    frm.set_value('module_profile', frm.doc.role_profile_name);
                    frappe.db.get_doc("Module Profile", frm.doc.role_profile_name).then(doc => {
                        console.log("Module Profile Loaded:", doc);
                    });
                }
            });
        }
        else{
            frm.set_value('module_profile', "");
        }
    }
});

    
