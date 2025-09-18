import frappe
from frappe.custom.doctype.property_setter.property_setter import make_property_setter
from frappe.utils.data import sha256_hash
# from frappe.desk.utils import get_link_to

def after_migrate():
    update_currency_symbol_for_SAR()
    transfer_workspace_shortcuts()
    update_website_setting_logo()
    hide_workspace()
    update_currency_in_number_card()
    PropertySetter()

def PropertySetter():
    make_property_setter("User","birth_date","hidden",1,"Check")
    make_property_setter("User","interest","hidden",1,"Check")
    make_property_setter("User","location","hidden",1,"Check")
    make_property_setter("User","bio","hidden",1,"Check")
    make_property_setter("User","interest","hidden",1,"Check")


def update_currency_in_number_card():
    """Update currency in number card to SAR."""
    number_cards = frappe.get_all("Number Card", filters={"currency": None}, pluck="name")

    for nc_name in number_cards:
        nc = frappe.get_doc("Number Card", nc_name)
        nc.currency = "SAR"
        nc.save(ignore_permissions=True)

def hide_workspace():
    """Hide Financial Reports workspaces from the workspace list."""
    ws = frappe.get_doc("Workspace", "Financial Reports")
    if not ws.is_hidden:
        ws.is_hidden = 1
        ws.save(ignore_permissions=True)


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
        workspace = frappe.get_doc("Workspace", page)
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