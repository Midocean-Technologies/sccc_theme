import frappe
from frappe.model.rename_doc import rename_doc

@frappe.whitelist()
def get_onboarding_data():
    settings = frappe.get_single("sccc theme settings")

    steps = []
    for row in settings.onboarding_steps:
        steps.append({
            "step": row.onboarding_step,
            "description": row.description or "",
            "mandatory": 1 if row.is_mandatory else 0,   # FIXED
            "completed": 1 if row.is_completed else 0,   # FIXED
            "route": row.route or ""
        })

    mandatory_steps = [s for s in steps if s["mandatory"] == 1]
    optional_steps = [s for s in steps if s["mandatory"] == 0]

    return {
        "mandatory_steps": mandatory_steps,
        "optional_steps": optional_steps,
        "steps": steps,
        "total_steps": len(steps),
        "completed_steps": len([x for x in steps if x["completed"] == 1])
    }


@frappe.whitelist()
def mark_step_completed(step):
    settings = frappe.get_single("sccc theme settings")

    for row in settings.onboarding_steps:
        if row.onboarding_step == step:
            row.is_completed = 1

    settings.save(ignore_permissions=True)
    frappe.db.commit()
    return True


@frappe.whitelist()
def get_onboarding_page():
    user = frappe.db.get_value("User", frappe.session.user, "full_name")
    company = frappe.defaults.get_user_default("Company") or ""
    company_abbr = frappe.get_value("Company", company, "abbr") or ""

    settings = frappe.get_single("sccc theme settings")

    steps = []
    for row in settings.onboarding_steps:
        steps.append({
            "step": row.onboarding_step,
            "description": row.description or "",
            "mandatory": 1 if row.is_mandatory else 0,
            "completed": 1 if row.is_completed else 0,
            "route": row.route or ""
        })

    mandatory = [x for x in steps if x["mandatory"] == 1]
    optional = [x for x in steps if x["mandatory"] == 0]

    html = f"""
        <div class="main-onboard">
            
            <div class="user-header">
                <a>hello {user}</a>
                <p><span style="background-color:#F4F4F5; margin-right:10px;">{company_abbr}</span> {company}</p>
            </div>

            <div class="panel">

                <div class="panel-head">
                    <div class="left-wrap">
                        <h3>let’s setup your account</h3>
                        
                        <div id="progress-bar-bg">
                            <div id="progress-inner"></div>
                        </div><span id="progress-text"></span>
                    </div>

                    <button id="step-type-button" class="label-head step-type-btn"></button>
                </div>

                <div class="split">
                    
                    <div class="step-left">

                        <div class="label-sec">
                            <div id="mandatory-list"></div>
                        </div>

                        <div class="label-sec">
                            <p class="label-head optional">optional steps (enhance your setup)</p>
                            <div id="optional-list"></div>
                        </div>
                    </div>

                    <div class="step-right">
                        <h4 id="desc-title"></h4>
                        <p id="desc-content"></p>
                        <button id="desc-button"></button>
                    </div>
                </div>

                <div class="foot">
                    <h5>why these steps are essential:</h5>
                    <p>
                        these configurations are required to unlock the full power of sccc erp.
                        each step ensures your system is properly set up for financial reporting,
                        automated communications, and compliance.
                        complete all required steps to start using the platform.
                    </p>
                    <a href="https://www.sccc.sa/" target="_blank">explore the help center</a>
                </div>
            </div>
        </div>
    """

    return {
        "html": html,
        "mandatory_steps": mandatory,
        "optional_steps": optional,
        "total_steps": len(steps),
        "completed_steps": len([x for x in steps if x["completed"] == 1]),
    }


@frappe.whitelist()
def rename_account(old_name=None, new_name=None):
    if not old_name or not new_name:
        frappe.throw("old_name and new_name are required")

    rename_doc("Account", old_name, new_name, force=True, merge=False)
    return True
