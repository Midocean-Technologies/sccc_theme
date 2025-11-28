import frappe

def load_onboarding(bootinfo):
    if frappe.session.user == "Guest":
        return

    user = frappe.session.user
    user_doc = frappe.get_doc("User", user)

    if user != "Administrator" and not user_doc.is_client_admin:
        return

    try:
        settings = frappe.get_single("sccc theme settings")

        bootinfo.sccc_theme_onboarding = []

        for row in settings.onboarding_steps:
            bootinfo.sccc_theme_onboarding.append({
                "onboarding_step": row.onboarding_step,
                "is_mandatory": row.is_mandatory,
                "is_completed": row.is_completed,
                "route": row.route
            })

    except Exception as e:
        frappe.log_error(
            title="SCCC Onboarding Load Error",
            message=frappe.get_traceback()
        )


@frappe.whitelist()
def mark_step_completed(step_name):
    settings = frappe.get_single("sccc theme settings")

    for row in settings.onboarding_steps:
        if row.step == step_name:
            row.is_completed = 1

    settings.save(ignore_permissions=True)
    frappe.db.commit()
    return True
