import frappe
from frappe.custom.doctype.property_setter.property_setter import make_property_setter
from frappe.custom.doctype.custom_field.custom_field import create_custom_field
from frappe.utils.data import sha256_hash
from frappe import _
# from frappe.desk.utils import get_link_to

@frappe.whitelist()
def after_migrate():
    update_currency_symbol_for_SAR()
    # transfer_workspace_shortcuts()
    update_website_setting_logo()
    update_system_settings()
    hide_workspace()
    update_currency_in_doctypes()
    PropertySetter()
    remove_gender_records()
    create_custom_fields()
    # remove_reports_from_workspace_custom_link_cards()
    # add_language_permission_for_ar_en()
    # add_translations() // this is commented because ar.csv file added for translation
    disable_other_languages()
    create_role_profile()
    delete_old_role_profile()

def delete_old_role_profile():
    role_profiles = ["HR", "Purchase", "Sales", "Accounts", "Manufacturing", "Inventory"]

    for role in role_profiles:
        if frappe.db.exists("Role Profile", role):
            frappe.delete_doc("Role Profile", role, force=1)
            frappe.db.commit()

def create_role_profile():
    if not frappe.db.exists("Role Profile", "Individual"):
        doc = frappe.get_doc({
            "doctype": "Role Profile",
            "role_profile": "Individual",
            "roles": [
                {"role": "Sales User"},
                {"role": "Sales Master Manager"},
                {"role": "Sales Manager"},
                {"role": "Item Manager"},
                {"role": "Stock User"},
                {"role": "Stock Manager"},
                {"role": "Customer"},
                {"role": "Accounts Manager"},
                {"role": "Accounts User"},
                {"role":"Auditor"},
                {"role":"System Manager"},
            ]
        })
        doc.insert()

    if not frappe.db.exists("Role Profile", "Essential"):
        doc = frappe.get_doc({
            "doctype": "Role Profile",
            "role_profile": "Essential",
            "roles": [
                {"role": "Sales User"},
                {"role": "Sales Master Manager"},
                {"role": "Sales Manager"},
                {"role": "Accounts Manager"},
                {"role": "Accounts User"},
                {"role":"Auditor"},
                {"role": "Item Manager"},
                {"role": "Purchase User"},
                {"role": "Purchase Manager"},
                {"role": "Purchase Master Manager"},
                {"role": "Stock User"},
                {"role": "Stock Manager"},
                {"role": "Customer"},
                {"role": "HR Manager"},
                {"role": "HR User"},
                {"role":"System Manager"},
            ]
        })
        doc.insert()
        
    if not frappe.db.exists("Role Profile", "Pro"):
        doc = frappe.get_doc({
            "doctype": "Role Profile",
            "role_profile": "Pro",
            "roles": [
                {"role": "Sales User"},
                {"role": "Sales Master Manager"},
                {"role": "Sales Manager"},
                {"role": "Item Manager"},
                {"role": "Purchase User"},
                {"role": "Purchase Manager"},
                {"role": "Purchase Master Manager"},
                {"role": "Stock User"},
                {"role": "Stock Manager"},
                {"role": "Customer"},
                {"role": "HR Manager"},
                {"role": "HR User"},
                {"role": "Accounts Manager"},
                {"role":"Auditor"},
                {"role": "Accounts User"},
                {"role": "Projects Manager"},
                {"role": "Projects User"},
                {"role":"System Manager"},
            ]
        })
        doc.insert()
    
    if not frappe.db.exists("Role Profile", "Ultimate"):
        doc = frappe.get_doc({
            "doctype": "Role Profile",
            "role_profile": "Ultimate",
            "roles": [
                {"role": "Sales User"},
                {"role": "Sales Master Manager"},
                {"role": "Sales Manager"},
                {"role": "Item Manager"},
                {"role": "Purchase User"},
                {"role": "Purchase Manager"},
                {"role": "Purchase Master Manager"},
                {"role": "Stock User"},
                {"role": "Stock Manager"},
                {"role": "Customer"},
                {"role": "HR Manager"},
                {"role": "HR User"},
                {"role": "Accounts Manager"},
                {"role": "Accounts User"},
                {"role": "Projects Manager"},
                {"role": "Projects User"},
                {"role": "Support Team"},
                {"role": "Dashboard Manager"},
                {"role": "Report Manager"},
                {"role":"Quality Manager"},
                {"role":"Manufacturing Manager"},
                {"role":"Manufacturing User"},
                {"role":"Auditor"},
                {"role":"Maintenance Manager"},
                {"role":"Workspace Manager"},
                {"role":"System Manager"},
            ]
        })
        doc.insert()

def disable_other_languages():
    keep = ["en", "ar"]
    for lang in frappe.get_all("Language", pluck="name"):
        if lang not in keep:
            doc = frappe.get_doc("Language", lang)
            doc.enabled = 0
            doc.save()


def update_system_settings():
    system_settings = frappe.get_single("System Settings")
    if system_settings:
        system_settings.disable_standard_email_footer = 1
        system_settings.hide_footer_in_auto_email_reports = 1
        system_settings.email_footer_address = ""
        system_settings.flags.ignore_mandatory = True
        system_settings.save(ignore_permissions=True)

def add_translations():
    installed_app = frappe.get_single("Installed Applications")
    if installed_app.installed_applications:
        for x in installed_app.installed_applications:
            if x.app_name == "sccc_theme":
                translations_to_add = [
                    {"source_text": "Connections", "translated_text": "اتصالات"},
                    {"source_text": "payable", "translated_text": "مستحق الدفع"},
                    {"source_text": "dashboard", "translated_text": "لوحة القيادة"},
                    {"source_text": "My Profile", "translated_text": "ملفي الشخصي"},
                    {"source_text": "My Settings", "translated_text": "إعداداتي"},
                    {"source_text": "Apps", "translated_text": "تطبيقات"},
                    {"source_text": "Log out", "translated_text": "تسجيل الخروج"},
                    {"source_text": "Change User", "translated_text": "تغيير المستخدم"},
                    {"source_text": "Last Month", "translated_text": "الشهر الماضي"},
                    {"source_text": "Recent Activity", "translated_text": "النشاط الأخير"},
                    {"source_text": "No activities to show", "translated_text": "لا توجد أنشطة لعرضها."},
                    {"source_text": "Energy Points", "translated_text": "نقاط الطاقة"},
                    {"source_text": "Installed Applications", "translated_text": "التطبيقات المثبتة"},
                    {"source_text": "Overview", "translated_text": "ملخص"},
                    {"source_text": "Global Search Settings", "translated_text": "إعدادات البحث العالمية"},
                    {"source_text": "Search", "translated_text": "بحث"},
                    {"source_text": "home", "translated_text": "الرئيسية"},
                    {"source_text": "Total Outgoing Bills", "translated_text": "إجمالي الفواتير الصادرة"},
                    {"source_text": "Edit Dashboard", "translated_text": "تعديل لوحة القيادة"},
                    {"source_text": "New Workspace", "translated_text": "مساحة عمل جديدة"},
                    {"source_text": "Indicator color", "translated_text": "لون المؤشر"},
                    {"source_text": "Public", "translated_text": "عام"},
                    {"source_text": "Icon", "translated_text": "رمز"},
                    {"source_text": "Calendar View", "translated_text": "عرض التقويم"},
                    {"source_text": "sccc by stc", "translated_text": "sccc بواسطة stc"},
                    {"source_text": "sccc erp", "translated_text": "sccc erp"},
                    {"source_text": "Notifications", "translated_text": "الإشعارات"},
                    {"source_text": "DocType", "translated_text": "نوع المستند"},
                    {"source_text": "ZATCA ERPGulf", "translated_text": "ZATCA ERPGulf"},
                    {"source_text": "Total Incoming Bills", "translated_text": "إجمالي الفواتير الواردة"},
                    {"source_text": "Total Incoming Payment", "translated_text": "إجمالي المدفوعات الواردة"},
                    {"source_text": "Total Outgoing Payment", "translated_text": "إجمالي المدفوعات الصادرة"},
                    {"source_text": "Last Year", "translated_text": "العام الماضي"},
                    {"source_text": "Incoming Bills (Purchase Invoice)", "translated_text": "الفواتير الواردة (فاتورة شراء)"},
                    {"source_text": "Last synced just now", "translated_text": "تم المزامنة للتو"},
                    {"source_text": "Budget Variance", "translated_text": "فرق الميزانية"},
                    {"source_text": "Items & Pricing", "translated_text": "العناصر والأسعار"},
                    {"source_text": "Selling features", "translated_text": "ميزات البيع"},
                ]

                language = "ar"  

                for item in translations_to_add:
                    source_text = item["source_text"]
                    translated_text = item["translated_text"]

                    try:
                        existing_translation = frappe.db.exists(
                            "Translation",
                            {
                                "source_text": source_text,
                                "language": language
                            }
                        )

                        if not existing_translation:
                            doc = frappe.new_doc("Translation")
                            doc.language = language
                            doc.source_text = source_text
                            doc.translated_text = translated_text
                            doc.insert(ignore_permissions=True)
                            frappe.log_error(
                                f"Added translation for: {source_text}",
                                "Translation Log"
                            )
                    except Exception as e:
                        frappe.log_error(
                            f"Failed to add translation for: {source_text}\nError: {str(e)}",
                            "Translation Log Error"
                        )


def add_language_permission_for_ar_en():
    allowed_languages = ["ar", "en"]

    # Fetch all enabled users
    users = frappe.get_all("User", filters={"enabled": 1}, fields=["name"])

    for user in users:
        for lang in allowed_languages:
            if not frappe.db.exists({
                "doctype": "User Permission",
                "user": user.name,
                "allow": "Language",
                "for_value": lang
            }):
                # Create user permission
                user_perm = frappe.get_doc({
                    "doctype": "User Permission",
                    "user": user.name,
                    "allow": "Language",
                    "for_value": lang,
                    "apply_to_all_doctypes": 1
                })
                user_perm.insert(ignore_permissions=True)


def remove_reports_from_workspace_custom_link_cards():
    workspaces = frappe.get_all("Workspace", pluck="name")

    for ws_name in workspaces:
        if ws_name != "Reports":
            ws = frappe.get_doc("Workspace", ws_name)
            ws.custom_custom_link_cards_ = [
                x for x in ws.custom_custom_link_cards_ if x.link_type != "Report"
            ]
            ws.save(ignore_permissions=True)


def create_custom_fields():
    create_custom_field(  
        "Workspace Link",
        {
            "label":_("Is Below Divider"),
            "fieldname": "is_below_divider",
            "fieldtype": "Check",
            "insert_after": "type",
            "depends_on":"eval:doc.type == 'Card Break'",
        },
    )
    create_custom_field(  
        "Workspace Link",
        {
            "label":_("Custom Icon"),
            "fieldname": "custom_icon",
            "fieldtype": "Attach",
            "insert_after": "is_below_divider",
            "depends_on":"eval:doc.type == 'Card Break'",
        },
    )

def remove_gender_records():
    gender_list = frappe.get_all(
        "Gender",
        filters={"name": ["not in", ["Male", "Female"]]},
        pluck="name"
    )

    for gender in gender_list:
        frappe.delete_doc("Gender", gender, force=1)

def PropertySetter():
    make_property_setter("Workspace","icon","read_only",0,"Check")
    make_property_setter("User","role_profile_name","allow_in_quick_entry",0,"Check")

def update_currency_in_doctypes():
    """Update currency in number card to SAR."""
    number_cards = frappe.get_all("Number Card", filters={"currency": None}, pluck="name")

    for nc_name in number_cards:
        nc = frappe.get_doc("Number Card", nc_name)
        nc.currency = "SAR"
        nc.save()

    dashboard_charts = frappe.get_all(
        "Dashboard Chart",
        filters={"type": "Donut", "currency": ["!=", ""]},
        pluck="name"
    )

    for dc_name in dashboard_charts:
        dc = frappe.get_doc("Dashboard Chart", dc_name)
        dc.currency = ""
        dc.save()

def hide_workspace():
    """Hide specific workspaces from the workspace list."""
    # List of workspaces you want to hide
    workspaces_to_hide = [
        "Financial Reports",
        "ERPNext Settings",
        "ERPNext Integrations",
        "ERP Settings",
        "ERP Integrations",
        "Tools",
        "Build",
        "Users",
        "Welcome Workspace",
        "Website",
        "Integrations",
        "ZATCA ERPGulf"
    ]

    # Get all workspace docs that match and are not hidden
    ws_list = frappe.get_all(
        "Workspace",
        filters={"name": ["in", workspaces_to_hide], "is_hidden": 0},
        pluck="name"
    )

    for w in ws_list:
        ws_doc = frappe.get_doc("Workspace", w)
        ws_doc.is_hidden = 1
        ws_doc.save(ignore_permissions=True)


def update_website_setting_logo():
    website_settings = frappe.get_single("Website Settings")
    navbar_settings = frappe.get_single("Navbar Settings")

    if not website_settings.footer_powered == "Powered By <b>SCCC</b>":
        website_settings.footer_powered = "Powered By <b>SCCC</b>"
        website_settings.save(ignore_permissions=True)

    logo_path = "/files/logo.svg"
    favicon_path = "/files/logo.svg"

    website_settings.app_name = "SCCC"

    if not navbar_settings.app_logo:
        navbar_settings.app_logo = logo_path
        navbar_settings.save(ignore_permissions=True)
    
    if website_settings.home_page != "app":
        website_settings.home_page = "app"

    if not website_settings.banner_image:
        website_settings.banner_image = logo_path

    if not website_settings.splash_image:
        website_settings.splash_image = logo_path
    
    if not website_settings.app_logo:
        website_settings.app_logo = logo_path
    
    if not website_settings.footer_logo:
        website_settings.footer_logo = logo_path
    
    if not website_settings.favicon:
        website_settings.favicon = favicon_path

    website_settings.save(ignore_permissions=True)

def update_currency_symbol_for_SAR():
    """Update currency symbol for SAR to a custom HTML."""
    currency = frappe.get_doc("Currency", "SAR")
    if currency.enabled == 0:
        currency.enabled = 1
        html_symbol = '<img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" style="height: 0.9em; vertical-align: middle;">'
        if currency.symbol != html_symbol:
            currency.symbol = html_symbol
        currency.save()
    else:
        html_symbol = '<img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" style="height: 0.9em; vertical-align: middle;">'
        if currency.symbol != html_symbol:
            currency.symbol = html_symbol
        currency.save()

def transfer_workspace_shortcuts():
    """Transfer all workspace shortcuts to custom_custom__shortcuts table."""
    workspaces = frappe.get_all("Workspace", pluck="name")

    for ws_name in workspaces:
        ws = frappe.get_doc("Workspace", ws_name)

        if ws.get("shortcuts"):
            ws.custom_custom__shortcuts = []
            for sc in ws.shortcuts:
                new_row = sc.as_dict()
                new_row["name"] = None 
                ws.append("custom_custom__shortcuts", new_row)
            ws.shortcuts = []
            ws.links = []
        ws.save(ignore_permissions=True)

    frappe.db.commit()


def slugify_doctype(name: str) -> str:
    if not name:
        return ""   # or return "unknown" if you want a default slug
    return name.strip().lower().replace(" ", "-")

@frappe.whitelist(allow_guest=True)
def get_sidebar_items(page=None):
    """Get sidebar items"""
    try:
        if not frappe.db.exists('Workspace',{'name':page}):
            return [],[]
        workspace = frappe.get_doc("Workspace", page)
        if workspace.is_hidden:
            return [], []
        
        items = []
        link_cards = []
        for sc in workspace.custom_custom__shortcuts:
            # default
            route = None

            # if sc.type == "Page":
            #     route = f"/app/{sc.link_to}"
            if sc.type == "DocType":
                route = f"/app/{slugify_doctype(sc.link_to)}"
                
            # elif sc.type == "Report":
            #     route = f"/app/query-report/{sc.link_to}"
            # elif sc.type == "Dashboard":
            #     route = f"/app/dashboard-view/{sc.link_to}"
            
            if route:
                items.append({
                    "label": sc.label,
                    "icon": sc.icon,
                    "type": 'Features' if sc.type == 'DocType' else 'Reports',
                    "link_to": sc.link_to,
                    "url": sc.url,
                    "route": route,
                })

        category = None
        category_icon = None
        for lc in workspace.custom_custom_link_cards_:
            if getattr(lc, "is_below_divider", 0):
                continue
            # default
            route = None
            if lc.type == "Card Break":
                category = lc.label
                category_icon = lc.custom_icon
                continue
            if lc.link_type == "DocType":
                route = f"/app/{slugify_doctype(lc.link_to)}"

            elif lc.link_type == "Report":
                route = f"/app/query-report/{lc.link_to}"

            if route and lc.type == "Link":
                link_cards.append({
                    "label": lc.label,
                    "icon": lc.custom_icon,
                    "link_type": lc.link_type,
                    "category": category,
                    "category_icon": category_icon,
                    "link_to": lc.link_to,
                    "route": route,
                })
        # print(link_cards)
        return items, link_cards
    except ImportError:
        frappe.log_error("Could not find get_sidebar_items ", "Error")
        return []

@frappe.whitelist(allow_guest=True, methods=["GET"])
def get_user(key, old_password):
    user = None
    if key:
        hashed_key = sha256_hash(key)
        user = frappe.db.get_value(
            "User", {"reset_password_key": hashed_key}, "name"
        )
    elif old_password:
        frappe.local.login_manager.check_password(frappe.session.user, old_password)
        user = frappe.session.user
        
    return user

@frappe.whitelist()
def get_workspace_sidebar_items():
	"""Get list of sidebar items for desk"""
	has_access = "Workspace Manager" in frappe.get_roles()

	# don't get domain restricted pages
	blocked_modules = frappe.get_cached_doc("User", frappe.session.user).get_blocked_modules()
	blocked_modules.append("Dummy Module")

	# adding None to allowed_domains to include pages without domain restriction
	allowed_domains = [None, *frappe.get_active_domains()]

	filters = {
		"restrict_to_domain": ["in", allowed_domains],
		"module": ["not in", blocked_modules],
	}

	if has_access:
		filters = []

	# pages sorted based on sequence id
	order_by = "sequence_id asc"
	fields = [
		"name",
		"title",
		"for_user",
		"parent_page",
		"content",
		"public",
		"module",
		"icon",
		"indicator_color",
		"is_hidden",
	]
	all_pages = frappe.get_all(
		"Workspace", fields=fields, filters=filters, order_by=order_by, ignore_permissions=True
	)
	pages = []
	private_pages = []

	# Filter Page based on Permission
	for page in all_pages:
		try:
			workspace = Workspace(page, True)
			if has_access or workspace.is_permitted():
				if page.public and (has_access or not page.is_hidden) and page.title != "Welcome Workspace":
					pages.append(page)
				elif page.for_user == frappe.session.user:
					private_pages.append(page)
				page["label"] = _(page.get("name"))
		except frappe.PermissionError:
			pass
	if private_pages:
		pages.extend(private_pages)

	if len(pages) == 0:
		pages = [frappe.get_doc("Workspace", "Welcome Workspace").as_dict()]
		pages[0]["label"] = _("Welcome Workspace")

	return {
		"pages": pages,
		"has_access": has_access,
		"has_create_access": frappe.has_permission(doctype="Workspace", ptype="create"),
	}