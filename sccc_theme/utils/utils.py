import frappe
from frappe.custom.doctype.property_setter.property_setter import make_property_setter
from frappe.utils.data import sha256_hash
# from frappe.desk.utils import get_link_to

def after_migrate():
    update_currency_symbol_for_SAR()
    transfer_workspace_shortcuts()
    update_website_setting_logo()
    hide_workspace()
    update_currency_in_doctypes()
    PropertySetter()
    remove_gender_records()

def remove_gender_records():
    # Fetch all genders except Male and Female
    gender_list = frappe.get_all(
        "Gender",
        filters={"name": ["not in", ["Male", "Female"]]},
        pluck="name"
    )

    for gender in gender_list:
        frappe.delete_doc("Gender", gender, force=1)

def PropertySetter():
    pass
    # make_property_setter("User","birth_date","hidden",1,"Check")
    # make_property_setter("User","interest","hidden",1,"Check")
    # make_property_setter("User","location","hidden",1,"Check")
    # make_property_setter("User","bio","hidden",1,"Check")
    # make_property_setter("User","interest","hidden",1,"Check")


def update_currency_in_doctypes():
    """Update currency in number card to SAR."""
    number_cards = frappe.get_all("Number Card", filters={"currency": None}, pluck="name")

    for nc_name in number_cards:
        nc = frappe.get_doc("Number Card", nc_name)
        nc.currency = "SAR"
        nc.save(ignore_permissions=True)
    
    # """Update currency in Dashboard Chart to SAR."""
    # number_cards = frappe.get_all("Dashboard Chart", filters={"currency": None}, pluck="name")

    # for nc_name in number_cards:
    #     nc = frappe.get_doc("Dashboard Chart", nc_name)
    #     nc.currency = "SAR"
    #     nc.save(ignore_permissions=True)

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
        page = page or "Home"
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
                
            elif sc.type == "Report":
                route = f"/app/query-report/{sc.link_to}"
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
        for lc in workspace.custom_custom_link_cards_:
            # default
            route = None
            if lc.type == "Card Break":
                category = lc.label
                continue
            if lc.link_type == "DocType":
                route = f"/app/{slugify_doctype(lc.link_to)}"
                
            elif lc.link_type == "Report":
                route = f"/app/query-report/{lc.link_to}"
           
            if route and lc.type == "Link":
                link_cards.append({
                    "label": lc.label,
                    "icon": lc.icon,
                    "link_type": lc.link_type,
                    "category": category,
                    "link_to": lc.link_to,
                    "route": route,
                })
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