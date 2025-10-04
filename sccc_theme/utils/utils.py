import frappe
from frappe.custom.doctype.property_setter.property_setter import make_property_setter
from frappe.custom.doctype.custom_field.custom_field import create_custom_field
from frappe.utils.data import sha256_hash
from frappe import _
# from frappe.desk.utils import get_link_to

def after_migrate():
    update_currency_symbol_for_SAR()
    transfer_workspace_shortcuts()
    update_website_setting_logo()
    hide_workspace()
    update_currency_in_doctypes()
    PropertySetter()
    remove_gender_records()
    create_custom_fields()
    # remove_reports_from_workspace_custom_link_cards()

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

def update_currency_in_doctypes():
    """Update currency in number card to SAR."""
    number_cards = frappe.get_all("Number Card", filters={"currency": None}, pluck="name")

    for nc_name in number_cards:
        nc = frappe.get_doc("Number Card", nc_name)
        nc.currency = "SAR"
        nc.save(ignore_permissions=True)

def hide_workspace():
    """Hide specific workspaces from the workspace list."""
    # List of workspaces you want to hide
    workspaces_to_hide = [
        "Financial Reports",
        "ERPNext Settings",
        "ERPNext Integrations",
        "ERP Settings",
        "ERP Integrations"
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
    html_symbol = '<img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" style="height: 0.9em; vertical-align: middle;">'
    
    if currency.symbol != html_symbol:
        currency.symbol = html_symbol
        currency.save(ignore_permissions=True)
        frappe.db.commit()


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