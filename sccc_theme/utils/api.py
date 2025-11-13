import frappe
import zipfile
import os
from frappe.desk.page.setup_wizard.setup_wizard import setup_complete
from frappe.utils import nowdate, getdate
from datetime import date

@frappe.whitelist()
def unzip_files():
    try:
        site_path = frappe.utils.get_site_path()

        app_path = frappe.get_app_path("sccc_theme")
        zip_file_path = os.path.join(app_path, "filesOct22.zip")

        target_dir = os.path.join(site_path, "public", "files")
        os.makedirs(target_dir, exist_ok=True)

        if not os.path.exists(zip_file_path):
            frappe.log_error("File not found", f"{zip_file_path} not found.")
            print(f"❌ ZIP file not found: {zip_file_path}")
            return

        with zipfile.ZipFile(zip_file_path, "r") as zip_ref:
            zip_ref.extractall(target_dir)

        # print(f"✅ Extracted filesOct22.zip to {target_dir}")

        add_to_file_manager(target_dir)

        frappe.logger().info("✅ filesOct22.zip extracted & added to File Manager.")
        # print("✅ Files added to File Manager successfully!")

    except Exception as e:
        frappe.log_error(title="Unzip Error", message=str(e))
        print(f"❌ Error while extracting files: {e}")


@frappe.whitelist()
def add_to_file_manager(target_dir):
    """Create File records in Frappe File Manager for all extracted files, preserving original names"""
    public_path = frappe.utils.get_site_path("public", "files")
    file_base_url = "/files"

    for root, dirs, files in os.walk(target_dir):
        for filename in files:
            file_path = os.path.join(root, filename)
            relative_path = os.path.relpath(file_path, public_path)
            file_url = f"{file_base_url}/{relative_path.replace(os.sep, '/')}"

            # Skip if already exists
            if frappe.db.exists("File", {"file_url": file_url}):
                continue

            try:
                # Manually create the File record with same file name
                file_doc = frappe.new_doc("File")
                file_doc.file_name = filename
                file_doc.file_url = file_url
                file_doc.is_private = 0
                file_doc.attached_to_doctype = None
                file_doc.attached_to_name = None
                file_doc.insert(ignore_permissions=True)

                frappe.db.commit()
                # print(f"📁 Added to File Manager : {filename}")

            except Exception as e:
                frappe.log_error(title="File Manager Add Error", message=str(e))
                print(f"❌ Error adding {filename}: {e}")


#site configuration methods
@frappe.whitelist()
def run_setup_wizard(company_name, language, plan):
    try:
        if not company_name:
            frappe.throw("Company name is required.")
        if not language:
            frappe.throw("Language is required.")
        if not plan:
            frappe.throw("Plan is required.")

        fy_start, fy_end = get_fiscal_year_dates()

        company_abbr = "".join([c[0] for c in company_name.split() if c]).upper()
        company_abbr = company_abbr[:5]

        args = {
            "currency": "SAR",
            "country": "Saudi Arabia",
            "timezone": "Asia/Riyadh",
            "language": language,
            "company_name": company_name,
            "company_abbr": company_abbr,
            "chart_of_accounts": "Standard",
            "fy_start_date": fy_start,
            "fy_end_date": fy_end,
            "setup_demo": 0
        }

        setup_complete(args)

        if frappe.is_setup_complete():
            if plan == "Individual":
                user_limit = 1
            elif plan == "Pro":
                user_limit = 50
            elif plan == "Essential":
                user_limit = 20
            else:
                frappe.throw("Invalid subscription plan.")

            frappe.db.set_single_value("sccc theme settings", "current_site_plan", plan)
            frappe.db.set_single_value("sccc theme settings", "user_limitation", user_limit)
            system_settings = frappe.get_single("System Settings")
            if system_settings:
                system_settings.disable_standard_email_footer = 1
                system_settings.hide_footer_in_auto_email_reports = 1
                system_settings.email_footer_address = ""
                system_settings.allow_consecutive_login_attempts = 2
                system_settings.allow_login_after_fail = 7200
                system_settings.otp_issuer_name = "SCCC ERP"
                system_settings.flags.ignore_mandatory = True
                system_settings.save(ignore_permissions=True)

        frappe.db.commit()
        frappe.clear_cache()

        return {
            "status": "success",
            "message": f"Setup wizard completed successfully for {company_name}."
        }

    except Exception as e:
        frappe.log_error(
            message=frappe.get_traceback(),
            title="Setup Wizard Failed"
        )
        return {
            "status": "error",
            "message": f"Setup wizard failed: {str(e)}"
        }

def get_fiscal_year_dates():
	today = getdate(nowdate())
	year = today.year
	if today.month < 4:
		fy_start = date(year - 1, 4, 1).isoformat()
		fy_end = date(year, 3, 31).isoformat()
	else:
		fy_start = date(year, 4, 1).isoformat()
		fy_end = date(year + 1, 3, 31).isoformat()
	return fy_start, fy_end

@frappe.whitelist()
def setup_email_account(email, password):
    try:
        if not frappe.is_setup_complete():
            frappe.log_error("Setup Wizard is not completed yet.")
        if not email:
            frappe.log_error("Email is required.")
        if not password:
            frappe.log_error("Password is required.")

        doc = frappe.new_doc("Email Account")
        doc.email_account_name = "SCCC ERP Support"
        doc.email_id = email
        doc.service = ""
        doc.auth_method = "Basic"
        doc.password = password
        doc.enable_outgoing = 1
        doc.default_outgoing = 1
        doc.use_ssl_for_outgoing = 1
        doc.smtp_server = "andrew.ace-host.net"
        doc.smtp_port = 465
        doc.always_use_account_email_id_as_sender = 1
        doc.always_use_account_name_as_sender_name = 1
        doc.send_unsubscribe_message = 1
        doc.track_email_status = 1

        doc.insert(ignore_permissions=True)

        return {
            "status": "success",
            "message": f"Email Account '{email}' created successfully."
        }

    except Exception as e:
        frappe.log_error(message=frappe.get_traceback(), title="Email Account Creation Failed")
        return {
            "status": "error",
            "message": f"Failed to create Email Account: {str(e)}"
        }
    

@frappe.whitelist()
def create_client_user(email, full_name,plan=None):
    try:
        if not frappe.is_setup_complete():
            frappe.throw("Setup Wizard is not completed yet.")
        if not email:
            frappe.throw("Email is required.")
        if frappe.db.exists("User", email):
            return {
                "status": "warning",
                "message": f"User with email '{email}' already exists."
            }
        
        if not full_name:
            frappe.throw("Full name is required.")

        sccc_theme_settings = frappe.get_single("sccc theme settings")

        if sccc_theme_settings.current_site_plan:
            plan_to_use = sccc_theme_settings.current_site_plan
        elif plan:
            plan_to_use = plan
        else:
            frappe.throw("Plan is required to create a user.")

        if not frappe.db.exists("Role Profile", plan_to_use ):
            frappe.throw(f"Role Profile '{plan_to_use }' not found.")

        userDoc = frappe.new_doc("User")
        userDoc.email = email
        userDoc.is_client_admin = 1
        userDoc.first_name = full_name
        userDoc.time_zone = "Asia/Riyadh"
        userDoc.send_welcome_email = 1

        userDoc.save(ignore_permissions=True)

        role_profile = frappe.get_doc("Role Profile", plan_to_use )
        for role in role_profile.roles:
            userDoc.append("roles", {"role": role.role})

        userDoc.module_profile = plan_to_use 
        userDoc.save(ignore_permissions=True)

        return {
            "status": "success",
            "message": f"User '{full_name}' ({email}) created successfully with plan '{plan_to_use }'."
        }

    except Exception as e:
        frappe.log_error(
            message=frappe.get_traceback(),
            title="Client User Creation Failed"
        )
        return {
            "status": "error",
            "message": f"Failed to create user: {str(e)}"
        }


# @frappe.whitelist()
# def check_setup_wizard():
#     from frappe.utils import get_url
#     site_url = get_url().replace('http://', 'https://')
#     print(site_url)
    # return site_url
    # if not frappe.is_setup_complete():
    #     return "NA"
    # else:
    #     return "setup completed"