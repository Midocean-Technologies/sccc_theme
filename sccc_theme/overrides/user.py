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
    def send_welcome_mail_to_user(self):
        print("Sending welcome email to user from sccc application...")
        from frappe.utils import get_url

        link = self.reset_password()

        subject = _("Welcome to SCCC ERP")
        site_url = get_url()
        # logo_url = f"{site_url}/files/SCCC_logo.png"
        # header_url = f"{site_url}/files/SCCC_logo.png"
        # print(logo_url,header_url)

        html_template = """
            {% set user_doc = frappe.get_doc("User", user) %}

            {% set site_link = "<a href='" + site_url + "'>" + site_url + "</a>" %}
            <div class="email-container">
            <div class="email-header">
                <div class="logo-section">
                <div class="logo-icon">
                    <img src= "/files/logo.svg" alt="sccc logo" height=40px width=40px>
                </div>
                <div class="logo-text">
                    <div class="brand-name">{{_("sccc erp")}}</div>
                    <div class="brand-subtitle">{{_("sccc by stc")}}</div>
                </div>
                </div>
            </div>

            <div class="email-body">
                <div class="banner-image">
                <img src ="/files/email_tempate_header.svg" alt="banner">
                </div>
                
                <div class="content-section">
                <h1 class="greeting">{{_("welcome to sccc erp")}}</h1>
                <p class="paragraph">
                    {{_("Hello")}} {{ first_name }}{% if last_name %} {{ last_name}}{% endif %},
                </p>

                <p class="paragraph">
                    {{_("A new account has been created for you at {0}").format(site_link)}}
                </p>

                <p class="paragraph">
                    {{_("Your login id is")}}: <b>{{ user }}</b>
                </p>

                <p class="paragraph">
                    {{_("Click on the link below to complete your registration and set a new password")}}.
                </p>

                <!-- <button class="cta-button">Complete Registration</button> -->
                <p style="margin: 15px 0px;">
                    <a href="{{ link }}" rel="nofollow" class="btn btn-primary">{{ _("Complete Registration") }}</a>
                    </p>
                </div>

                <div class="footer-section">


                <p class="copyright">{{_("© 2025 sccc by stc")}}</p>

                <div class="footer-bottom">
                    <div class="logo-section">
                    <div class="logo-icon-small">
                        <img src= "/files/logo.svg" alt="sccc logo" height=40px width=40px>
                    </div>
                    <div class="logo-text">
                        <div class="brand-name-small">{{_("sccc erp")}}</div>
                        <div class="brand-subtitle-small">{{_("sccc by stc")}}</div>
                    </div>
                    </div>

                    <div class="social-icons">
                    <a href="#" class="social-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#9CA3AF">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </a>
                    <a href="#" class="social-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#9CA3AF">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </a>
                    <a href="#" class="social-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#9CA3AF">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <style>
            * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'STCForward' !important;
            text-transform: lowercase !important;  
            }

            body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #E5E7EB;
            padding: 24px 0 24px 0;
            }

            .email-container {
            max-width: 640px;
            margin: 0 auto;
            background-color: #F3F4F6;
            padding-bottom: 24px;
            }

            .email-header {
            padding: 32px 24px 16px 24px;
            background-color: #F3F4F6;
            }

            .logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 20px 0px 20px;
            }

            .logo-icon {
            flex-shrink: 0;
            }

            .logo-text {
            display: flex;
            flex-direction: column;
            }

            .brand-name {
            font-size: 16px;
            font-weight: 600;
            color: #6C2BD9;
            line-height: 1.15;
            }

            .brand-subtitle {
            font-size: 12px;
            color: #6B7280;
            line-height: 1.15;
            }

            .email-body {
            background-color: white;
            margin: 0 24px;
            border-radius: 0;
            overflow: hidden;
            }

            .banner-image {
            width: 100%;
            overflow: hidden;
            padding: 20px 20px 0px 20px;
            }

            .banner-image img {
            width: 100%;
            object-fit: cover;
            }

            .content-section {
            padding: 40px 30px;
            }

            .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 30px;
            }

            .paragraph {
            font-size: 15px;
            line-height: 1.6;
            color: #6B7280;
            margin-bottom: 20px;
            }

            .cta-button {
            background-color: #EF4444;
            color: white;
            border: none;
            padding: 12px 28px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 0;
            cursor: pointer;
            margin-top: 20px;
            transition: background-color 0.2s;
            }

            .cta-button:hover {
            background-color: #DC2626;
            }

            .footer-section {
            padding: 24px 30px 26px 30px;
            background-color: #ffffff;
            }

            .footer-text {
            font-size: 13px;
            color: #6B7280;
            line-height: 1.6;
            margin-bottom: 15px;
            }

            .footer-link {
            color: #6C2BD9;
            text-decoration: underline;
            }

            .copyright {
            font-size: 13px;
            color: #6B7280;
            margin-bottom: 18px;
            }

            .footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            }

            .logo-icon-small {
            flex-shrink: 0;
            }

            .brand-name-small {
            font-size: 15px;
            font-weight: 600;
            color: #6C2BD9;
            line-height: 1.2;
            }

            .brand-subtitle-small {
            font-size: 12px;
            color: #6B7280;
            line-height: 1.2;
            }

            .social-icons {
            display: flex;
            gap: 16px;
            align-items: center;
            display: none !important; 
            }

            .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
            }

            .social-link:hover {
            opacity: 0.7;
            }
            </style>


        """

        context = {
            "first_name": self.first_name or "",
            "last_name": self.last_name or "",
            "user": self.name,
            "link": link,
            "site_url": site_url,
            # "logo_url": logo_url,
            # "header_url": header_url
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



