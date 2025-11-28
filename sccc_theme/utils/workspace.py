import frappe
from frappe.desk.desktop import Workspace
from frappe import _

def validate(doc, method):
    if not doc.custom_custom_link_cards_:
        return

    for item in doc.custom_custom_link_cards_:
        has_below_divider = hasattr(item, "is_below_divider")
        has_below_reports = hasattr(item, "is_below_reports_divider")

        if has_below_divider and has_below_reports:
            if item.type == "Card Break":
                if item.is_below_divider and item.is_below_reports_divider:
                    frappe.throw(_("A card cannot be below both dividers."))


@frappe.whitelist()
def get_workspace_sidebar_items():
    """Get list of sidebar items for desk"""
    has_access = "Workspace Manager" in frappe.get_roles()

    blocked_modules = frappe.get_cached_doc("User", frappe.session.user).get_blocked_modules()
    blocked_modules.append("Dummy Module")

    allowed_domains = [None, *frappe.get_active_domains()]

    filters = {
        "restrict_to_domain": ["in", allowed_domains],
        "module": ["not in", blocked_modules],
        "is_hidden": 0,
    }

    if has_access:
        filters = {"is_hidden": 0}

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

    for page in all_pages:
        try:
            workspace = Workspace(page, True)
            if has_access or workspace.is_permitted():
                if page.public and page.title != "Welcome Workspace":
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


def slugify_doctype(name: str) -> str:
    if not name:
        return ""   # or return "unknown" if you want a default slug
    return name.strip().lower().replace(" ", "-")

@frappe.whitelist(allow_guest=True)
def get_sidebar_items(page=None):
    """Get sidebar items"""
    try:
        if not frappe.db.exists('Workspace', {'name': page}):
            return [], []

        workspace = frappe.get_doc("Workspace", page)

        if workspace.is_hidden:
            return [], []

        items = []
        link_cards = []

        # default values
        category = None
        category_icon = None
        is_below_divider = 0

        for lc in workspace.custom_custom_link_cards_:

            # If Card Break — update category set
            if lc.type == "Card Break":
                category = lc.label
                category_icon = lc.custom_icon

                # assign divider flags properly
                is_below_divider = getattr(lc, "is_below_divider", 0)
                continue

            # skip items without link
            if lc.type != "Link":
                continue

            route = None

            # DocType Routes
            if lc.link_type == "DocType":
                route = f"/app/{slugify_doctype(lc.link_to)}"

            # Report Routes
            elif lc.link_type == "Report":
                route = f"/app/query-report/{lc.link_to}"

            if not route:
                continue

            link_cards.append({
                "label": lc.label,
                "icon": lc.custom_icon or "",
                "link_type": lc.link_type,
                "category": category,
                "category_icon": category_icon,
                "link_to": lc.link_to,
                "route": route,
                "is_below_divider": is_below_divider,
            })

        return items, link_cards

    except Exception as e:
        frappe.log_error(f"Error in get_sidebar_items: {frappe.get_traceback()}", "Sidebar Exception")
        return []
