app_name = "sccc_theme"
app_title = "SCCC Theme"
app_publisher = "Bhavesh Mahavar"
app_description = "SCCC Theme"
app_email = "bhavesh@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "sccc_theme",
# 		"logo": "/assets/sccc_theme/images/logo.svg",
# 		"title": "SCCC",
# 		"route": "/app/home",
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = ""
# app_include_js = "/assets/sccc_theme/js/sccc_theme.js"

app_include_css = [
    "/assets/sccc_theme/css/sidebar.css",
    "/assets/sccc_theme/css/navbar.css",
    "/assets/sccc_theme/css/sccc_theme.css",
    "/assets/sccc_theme/css/main_onboarding.css"
    # "/assets/sccc_theme/css/bootstrap.css"
]
app_include_js = [
    # "/assets/sccc_theme/js/bootstrap.js",
    "/assets/sccc_theme/js/sidebar.js",
    "/assets/sccc_theme/js/navbar.js",
    "/assets/sccc_theme/js/workspace.js",
    "/assets/sccc_theme/js/form_action.js",
    "/assets/sccc_theme/js/force_home.js",
    "assets/sccc_theme/js/main_onboarding.js"
    # "/assets/sccc_theme/js/gender_disable.js"
]

# boot_session = "sccc_theme.boot.load_onboarding"

# default_mail_footer = """
# 	<span>
# 		Sent via sccc
# 	</span>
# """
# email_brand_image = "assets/sccc_theme/images/logo.svg"

# website_context = {
# 	"favicon": "/assets/sccc_theme/images/logo.svg",
# 	"splash_image": "/assets/sccc_theme/images/logo.svg",
# }

# fixtures
fixtures = [
    {
        "dt": "Workspace",
        "filters": [
            ["name", "not in", ["ZATCA ERPGulf", "Loans"]]
        ]
    },
    # {
    #     "dt": "Module Profile",
    # },
    # {
    #     "dt": "sccc plan",
    # },
    # {
    #     "dt": "Role Profile",
    # }
    # {
    #     "dt":"Custom HTML Block"
    # }
]

# include js, css files in header of web template
# web_include_css = "/assets/sccc_theme/css/sccc_theme.css"
# web_include_js = "/assets/sccc_theme/js/sccc_theme.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "sccc_theme/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {
#     "User": "public/js/user.js",
#     "Employee": "public/js/employee.js",
#     "Contact": "public/js/contact.js"
# }

doctype_js = {
    "User": "public/js/gender_disable.js",
    "User": "public/js/user.js",
    "Employee": "public/js/gender_disable.js",
    "Contact": "public/js/gender_disable.js",
    "Customer": "public/js/gender_disable.js",
    "Lead": "public/js/gender_disable.js",
}

# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "sccc_theme/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "sccc_theme.utils.jinja_methods",
# 	"filters": "sccc_theme.utils.jinja_filters"
# }

# Installation
# ------------

before_install = "sccc_theme.utils.api.unzip_files"
# after_install = "sccc_theme.install.after_install"
after_migrate = "sccc_theme.utils.utils.after_migrate"
# permission_query_conditions = {
#     "Language": "sccc_theme.utils.api.language_permission_query"
# }
# Uninstallation
# ------------

# before_uninstall = "sccc_theme.uninstall.before_uninstall"
# after_uninstall = "sccc_theme.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "sccc_theme.utils.before_app_install"
# after_app_install = "sccc_theme.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "sccc_theme.utils.before_app_uninstall"
# after_app_uninstall = "sccc_theme.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "sccc_theme.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

permission_query_conditions = {
    "User":"sccc_theme.utils.permission.user_permission_query_conditions"
}
#
# has_permission = {
#     "User":"sccc_theme.utils.permission.has_user_permission"
# 	# "Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

override_doctype_class = {
	"User": "sccc_theme.overrides.user.CustomUser",
    "Module Profile": "sccc_theme.overrides.module_profile.CustomModuleProfile"
}

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
    "User":{
        "validate":"sccc_theme.overrides.user.validate_user_from_doc_event",
        # "after_insert":"sccc_theme.overrides.user.after_insert_user",
        # "before_insert":"sccc_theme.overrides.user.restrict_user_limitation"
    },

    "Workspace": {
        "validate": "sccc_theme.utils.workspace.validate"
    }

}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"sccc_theme.tasks.all"
# 	],
# 	"daily": [
# 		"sccc_theme.tasks.daily"
# 	],
# 	"hourly": [
# 		"sccc_theme.tasks.hourly"
# 	],
# 	"weekly": [
# 		"sccc_theme.tasks.weekly"
# 	],
# 	"monthly": [
# 		"sccc_theme.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "sccc_theme.install.before_tests"

# Overriding Methods
# ------------------------------
#
# from frappe.frappe.www.login import send_login_link
override_whitelisted_methods = {
    "frappe.core.doctype.user.user.get_all_roles": "sccc_theme.overrides.user.get_all_roles"
}
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "sccc_theme.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["sccc_theme.utils.before_request"]
# after_request = ["sccc_theme.utils.after_request"]

# Job Events
# ----------
# before_job = ["sccc_theme.utils.before_job"]
# after_job = ["sccc_theme.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"sccc_theme.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

