import frappe
from frappe.utils.data import sha256_hash
# from frappe.desk.utils import get_link_to

def after_migrate():
    update_currency_symbol_for_SAR()
    remove_workspace_items()

def update_currency_symbol_for_SAR():
    """Update currency symbol for SAR to a custom HTML."""
    currency = frappe.get_doc("Currency", "SAR")
    html_symbol = '<img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" style="height: 0.9em; vertical-align: middle;">'
    
    if currency.symbol != html_symbol:
        currency.symbol = html_symbol
        currency.save(ignore_permissions=True)
        frappe.db.commit()


def remove_workspace_items():
    """Remove all workspace items (shortcuts and links) from all workspaces."""
    workspaces = frappe.get_all("Workspace", pluck="name")
    for ws_name in workspaces:
        ws = frappe.get_doc("Workspace", ws_name)

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

        for sc in workspace.shortcuts:
            # default
            route = None

            if sc.type == "Page":
                route = f"/app/{sc.link_to}"
            elif sc.type == "DocType":
                route = f"/app/{slugify_doctype(sc.link_to)}"
            elif sc.type == "Report":
                route = f"/app/query-report/{sc.link_to}"
            elif sc.type == "Dashboard":
                route = f"/app/dashboard-view/{sc.link_to}"
            
            if route:
                items.append({
                    "label": sc.label,
                    "icon": sc.icon,
                    "type": sc.type,
                    "link_to": sc.link_to,
                    "url": sc.url,
                    "route": route,
                })

        return items
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