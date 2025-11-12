import frappe
from frappe.rate_limiter import rate_limit
from frappe.utils import cint, get_url

def get_login_with_email_link_ratelimit() -> int:
	return frappe.get_system_settings("rate_limit_email_link_login") or 5

@frappe.whitelist(allow_guest=True)
@rate_limit(limit=get_login_with_email_link_ratelimit, seconds=60 * 60)
def custom_send_login_link(email: str):
    try:
        print("custom app sccc theme")

        expiry = frappe.get_system_settings("login_with_email_link_expiry") or 10
        link = _generate_temporary_login_link(email, expiry)

        app_name = (
            frappe.get_website_settings("app_name")
            or frappe.get_system_settings("app_name")
            or "SCCC"
        )

        subject = f"Login To {app_name}"

        html = f"""
        <table width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td align="left" style="padding: 32px 24px 16px 24px; background-color: #F3F4F6;">
                        <table cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                            <td style="padding-right: 10px;">
                            <img embed="assets/sccc_theme/images/emaillogo.png" alt="sccc logo" width="40" height="40" style="display: block;"/>
                            </td>
                            <td style="font-family: Arial, sans-serif;">
                            <div style="font-size: 16px; font-weight: 600; color: #6C2BD9;">sccc erp</div>
                            <div style="font-size: 12px; color: #6B7280;">sccc by stc</div>
                            </td>
                        </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td align="center" bgcolor="#FFFFFF" style="padding: 40px 30px 0px 30px;">
                        <img embed="assets/sccc_theme/images/emailheader.png" alt="banner" width="640" style="display: block; max-width: 100%;">
                    </td>
                </tr>

                <tr>
                    <td align="center">
                        <div style="font-size: 16px; font-weight: bold; margin-top: 20px;">
                            Click on the button to log in to {app_name}
                        </div>
                        <div>The link will expire in {expiry} minutes</div>
                    </td>
                </tr>

                <tr>
                    <td align="center">
                        <a href="{link}" style="display:inline-block; background-color:#FF375E; color:white; padding:12px 20px; text-decoration:none; margin-top:30px; border-radius:4px;">
                            Log In To {app_name}
                        </a>
                    </td>
                </tr>

                <tr>
                    <td bgcolor="#FFFFFF" style="padding: 24px 30px 26px 30px; text-align: left;">
                        <p style="font-size: 13px; color: #6B7280; margin-bottom: 18px;">© 2025 sccc by stc</p>
                    </td>
                </tr>
            </tbody>
        </table>
        """

        frappe.log_error("Sending mail now...", "Login Link Debug")

        frappe.sendmail(
            subject=subject,
            recipients=[email],
            message=html,   
            now=True,
        )

        frappe.log_error(f"Mail sent successfully to: {email}", "Login Link Debug")

        return {"status": "success"}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Login Link Error")
        return {"status": "failed", "message": str(e)}


def _generate_temporary_login_link(email: str, expiry: int):
	assert isinstance(email, str)

	if not frappe.db.exists("User", email):
		frappe.throw(_("User with email address {0} does not exist").format(email), frappe.DoesNotExistError)
	key = frappe.generate_hash()
	frappe.cache.set_value(f"one_time_login_key:{key}", email, expires_in_sec=expiry * 60)

	return get_url(f"/api/method/frappe.www.login.login_via_key?key={key}")

