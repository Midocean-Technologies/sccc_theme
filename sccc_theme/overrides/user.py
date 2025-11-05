import frappe
from frappe.core.doctype.user.user import User
from frappe.core.doctype.user.user import *
from frappe import STANDARD_USERS, _, msgprint, throw
from frappe.utils import (
    cint,
    escape_html,
    flt,
    format_datetime,
    get_formatted_email,
    get_system_timezone,
    has_gravatar,
    now_datetime,
    today,
)


class CustomUser(User):
    def before_insert(self):
        self.flags.in_insert = True
        throttle_user_creation()
        
        # Add user limitation
        user_limit = frappe.db.get_single_value('sccc theme settings', 'user_limitation')

        user_count = frappe.db.count(
            "User",
            filters={
                "enabled": 1,
                "name": ("not in", ["Administrator", "Guest"])
            }
        )        
        if user_limit > 0 and user_count >= user_limit:
            frappe.throw(
                f"User limit reached as per subscription plan. "
                f"Max allowed: {user_limit}, Current: {user_count}"
            )

    def password_reset_mail(self, link):
        # print("password reset method calling from sccc theme")
        from frappe.utils import get_url

        subject = _("Password Reset for SCCC ERP")
        # site_url = get_url()
        site_url = get_url().replace('http://', 'https://')

        html_template = """
                {% set site_link = "<a href='" + site_url + "'>" + site_url + "</a>" %}

                <!DOCTYPE html>
                <html>
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>{{ _("Password Reset Email") }}</title>
                </head>
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
                            <h1 style="font-size: 24px; font-weight: 600; color: #111827; margin-bottom: 30px; text-align: left;">{{ _("Password Reset") }}</h1>

                            <p style="font-size: 15px; line-height: 1.6; color: #6B7280; margin-bottom: 20px;">
                            {{ _("Dear") }} {{ first_name }}{% if last_name %} {{ last_name }}{% endif %},
                            </p>

                            <p style="font-size: 15px; line-height: 1.6; color: #6B7280; margin-bottom: 20px;">
                            {{ _("Please click on the following link to set your new password:") }}
                            </p>

                            <!-- CTA Button -->
                            <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 15px 0;">
                              <tr>
                                <td align="center" bgcolor="#FF375E" style="border-radius: 4px;">
                                  <a href="{{ link }}" 
                                    style="display:inline-block; padding:12px 28px; font-size:15px; font-weight:600;
                                            color:#FFFFFF; text-decoration:none; background-color:#FF375E; border-radius:4px;">
                                    {{ _("Reset your password") }}
                                  </a>
                                </td>
                              </tr>
                            </table>
                        </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                        <td bgcolor="#FFFFFF" style="padding: 24px 30px 26px 30px; text-align: left;">
                            <p style="font-size: 15px; line-height: 1.6; color: #6B7280; margin-bottom: 20px;">
                            {{ _("Thank you,") }}<br>
                            {{ _("Administrator") }}
                            </p>

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
                </html>
                """


        context = {
            "first_name": self.first_name or "",
            "last_name": self.last_name or "",
            "user": self.name,
            "link": link,
            "site_url": site_url,
        }

        content = frappe.render_template(html_template, context)

        sender = (
            frappe.session.user not in STANDARD_USERS and get_formatted_email(frappe.session.user)
        ) or None

        frappe.sendmail(
            recipients=self.email,
            sender=sender,
            subject=subject,
            content=content,
            delayed=False,
            retry=3,
        )
        
    def send_welcome_mail_to_user(self):
        # print("welcome email sent method calling from sccc theme")
        from frappe.utils import get_url

        link = self.reset_password()

        subject = _("Welcome to SCCC ERP")
        # site_url = get_url()
        site_url = get_url().replace('http://', 'https://')

        html_template = """
                {% set user_doc = frappe.get_doc("User", user) %}
                {% set site_link = "<a href='" + site_url + "'>" + site_url + "</a>" %}

                <!DOCTYPE html>
                <html>
                <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>{{ _("Welcome Email") }}</title>
                </head>
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
                            <h1 style="font-size: 24px; font-weight: 600; color: #111827; margin-bottom: 30px; text-align: left;">{{ _("Welcome to sccc erp") }}</h1>

                            <p style="font-size: 15px; line-height: 1.6; color: #6B7280; margin-bottom: 20px;">
                            {{ _("Hello") }} {{ first_name }}{% if last_name %} {{ last_name }}{% endif %},
                            </p>

                            <p style="font-size: 15px; line-height: 1.6; color: #6B7280; margin-bottom: 20px;">
                            {{ _("A new account has been created for you at {0}").format(site_link) }}
                            </p>

                            <p style="font-size: 15px; line-height: 1.6; color: #6B7280; margin-bottom: 20px;">
                            {{ _("Your login id is") }}: <b>{{ user }}</b>
                            </p>

                            <p style="font-size: 15px; line-height: 1.6; color: #6B7280; margin-bottom: 20px;">
                            {{ _("Click on the link below to complete your registration and set a new password.") }}
                            </p>

                            <!-- CTA Button -->
                            <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 15px 0;">
                              <tr>
                                <td align="center" bgcolor="#FF375E" style="border-radius: 4px;">
                                  <a href="{{ link }}" 
                                    style="display:inline-block; padding:12px 28px; font-size:15px; font-weight:600;
                                            color:#FFFFFF; text-decoration:none; background-color:#FF375E; border-radius:4px;">
                                    {{ _("Complete Registration") }}
                                  </a>
                                </td>
                              </tr>
                            </table>
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
                </html>
                """


        context = {
            "first_name": self.first_name or "",
            "last_name": self.last_name or "",
            "user": self.name,
            "link": link,
            "site_url": site_url,
        }

        content = frappe.render_template(html_template, context)

        sender = (
            frappe.session.user not in STANDARD_USERS and get_formatted_email(frappe.session.user)
        ) or None

        frappe.sendmail(
            recipients=self.email,
            sender=sender,
            subject=subject,
            content=content,
            delayed=False,
            retry=3,
        )

#below code from doc events
@frappe.whitelist()
def validate_user_from_doc_event(doc, method=None):
    try:
        sccc_settings = frappe.get_single("sccc theme settings")
        current_plan = sccc_settings.current_site_plan

        if not current_plan:
            return

        if frappe.db.exists("Role Profile", current_plan):
            doc.role_profile_name = current_plan
            role_profile = frappe.get_doc("Role Profile", current_plan)
            doc.set("roles", [])
            for role in role_profile.roles:
                doc.append("roles", {"role": role.role})

        if frappe.db.exists("Module Profile", current_plan):
            doc.module_profile = current_plan
            module_profile = frappe.get_doc("Module Profile", current_plan)
            doc.set("block_modules", [])
            for d in module_profile.get("block_modules"):
                doc.append("block_modules", {"module": d.module})

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "validate_user_from_doc_event Error")


def throttle_user_creation():
	if frappe.flags.in_import:
		return

	if frappe.db.get_creation_count("User", 60) > frappe.local.conf.get("throttle_user_limit", 60):
		frappe.throw(_("Throttled"))