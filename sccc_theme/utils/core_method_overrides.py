import frappe
from frappe import _
import pyotp
from frappe.rate_limiter import rate_limit
from frappe.utils import cint, get_url
from frappe.www.login import get_login_with_email_link_ratelimit
from frappe.www.login import _generate_temporary_login_link

def send_token_via_email(user, token, otp_secret, otp_issuer, subject=None, message=None):
	"""Send token to user as email."""
	user_email = frappe.db.get_value("User", user, "email")
	if not user_email:
		return False
	hotp = pyotp.HOTP(otp_secret)
	otp = hotp.at(int(token))
	template_args = {"otp": otp, "otp_issuer": otp_issuer}

	frappe.sendmail(
		recipients=user_email,
		subject=subject or get_email_subject_for_2fa(template_args),
		message=message or get_email_body_for_2fa(template_args),
		delayed=False,
		retry=3,
	)
	return True

def get_email_subject_for_2fa(kwargs_dict):
	"""Get email subject for 2fa."""
	subject_template = _("Login Verification Code from {}").format(
		frappe.db.get_single_value("System Settings", "otp_issuer_name")
	)
	return frappe.render_template(subject_template, kwargs_dict)

def get_email_body_for_2fa(kwargs_dict):
	"""Get email body for 2fa."""
	body_template = """
        <body style="margin: 0; padding: 0; background-color: #E5E7EB;
                            font-family: 'STCForward', Arial, sans-serif !important;
                            text-transform: lowercase !important;">

                <!-- Wrapper -->
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#E5E7EB"
                        style="font-family: 'STCForward', Arial, sans-serif !important; text-transform: lowercase !important;">
                <tr>
                    <td align="center" style="padding: 24px 0;">

                    <!-- Main Container -->
                    <table width="640" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#F3F4F6" style="max-width: 640px; width: 100%;">

                        <!-- Header -->
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

                        <!-- Banner -->
                        <tr>
                        <td align="center" bgcolor="#FFFFFF" style="padding: 40px 30px 0px 30px;">
                            <img embed="assets/sccc_theme/images/emailheader.png" alt="banner" width="640" style="display: block; max-width: 100%;">
                        </td>
                        </tr>

                        <!-- Content Section -->
                        <tr>
                        <td bgcolor="#FFFFFF" style="padding: 40px 30px;">
                            Enter this code to complete your login:
                            <br><br>
                            <b style="font-size: 18px;">{{ otp }}</b>
                        </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                        <td bgcolor="#FFFFFF" style="padding: 24px 30px 26px 30px; text-align: left;">
                            <p style="font-size: 13px; color: #6B7280; margin-bottom: 18px;">© 2025 sccc by stc</p>

                            <!-- Footer Logo -->
                            <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
                            <tr>
                                <td valign="middle">
                                <table cellpadding="0" cellspacing="0" role="presentation">
                                    <tr>
                                    <td style="padding-right: 10px;">
                                        <img embed="assets/sccc_theme/images/emaillogo.png" alt="sccc logo" width="40" height="40" style="display: block;"/>
                                    </td>
                                    <td>
                                        <div style="font-size: 15px; font-weight: 600; color: #6C2BD9;">sccc erp</div>
                                        <div style="font-size: 12px; color: #6B7280;">sccc by stc</div>
                                    </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            </table>
                        </td>
                        </tr>

                    </table>
                    </td>
                </tr>
                </table>

                </body>
		
	"""
	return frappe.render_template(body_template, kwargs_dict)


@frappe.whitelist(allow_guest=True)
@rate_limit(limit=get_login_with_email_link_ratelimit, seconds=60 * 60)
def send_login_link(email: str):
    """Send a custom HTML email with a temporary login link."""
    try:
        if not frappe.get_system_settings("login_with_email_link"):
            return {"status": "failed", "message": "Login with email link is disabled in System Settings."}

        expiry = frappe.get_system_settings("login_with_email_link_expiry") or 10

        link = _generate_temporary_login_link(email, expiry)

        app_name = (
            frappe.get_website_settings("app_name")
            or frappe.get_system_settings("app_name")
            or "SCCC"
        )

        subject = f"Login To {app_name}"

        html = f"""
        <body style="margin: 0; padding: 0; background-color: #E5E7EB;
                     font-family: 'STCForward', Arial, sans-serif !important;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#E5E7EB">
                <tr>
                    <td align="center" style="padding: 24px 0;">
                        <table width="640" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#FFFFFF" style="max-width: 640px; width: 100%;">
                            
                            <!-- Header -->
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

                            <!-- Banner -->
                            <tr>
                                <td align="center" bgcolor="#FFFFFF" style="padding: 40px 30px 0px 30px;">
                                    <img embed="assets/sccc_theme/images/emailheader.png" alt="banner" width="640" style="display: block; max-width: 100%;">
                                </td>
                            </tr>

                            <!-- Main Message -->
                            <tr>
                                <td bgcolor="#FFFFFF" style="padding: 40px 30px; text-align: center;">
                                    <div style="font-size: 16px; font-weight: 600; color: #111827;">
                                        Click the button below to log in to {app_name}
                                    </div>
                                    <div style="color: #6B7280; margin-top: 8px;">
                                        The link will expire in {expiry} minutes.
                                    </div>
                                    <div style="margin-top: 30px;">
                                        <a href="{link}" style="display:inline-block; background-color:#FF375E; color:#fff; padding:12px 24px; text-decoration:none; border-radius:4px;">
                                            Log In To {app_name}
                                        </a>
                                    </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                            <td bgcolor="#FFFFFF" style="padding: 24px 30px 26px 30px; text-align: left;">
                                <p style="font-size: 13px; color: #6B7280; margin-bottom: 18px;">© 2025 sccc by stc</p>

                                <!-- Footer Logo -->
                                <table cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                <tr>
                                    <td valign="middle">
                                    <table cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                        <td style="padding-right: 10px;">
                                            <img embed="assets/sccc_theme/images/emaillogo.png" alt="sccc logo" width="40" height="40" style="display: block;"/>
                                        </td>
                                        <td>
                                            <div style="font-size: 15px; font-weight: 600; color: #6C2BD9;">sccc erp</div>
                                            <div style="font-size: 12px; color: #6B7280;">sccc by stc</div>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        """

        frappe.sendmail(
            subject=subject,
            recipients=[email],
            message=html,
            now=True,
        )

        frappe.log_error(f"Custom login link email sent to {email}", "Login Link Debug")

        return {"status": "success", "message": f"Login link sent to {email}"}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Login Link Error")
        return {"status": "failed", "message": str(e)}
