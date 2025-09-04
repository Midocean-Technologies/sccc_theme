import frappe
# from frappe.desk.utils import get_link_to

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
                route = f"/app/{frappe.scrub(sc.link_to)}"
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