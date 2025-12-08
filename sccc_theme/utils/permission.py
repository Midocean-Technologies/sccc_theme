import frappe

def user_permission_query_conditions(user):
    roles = frappe.get_roles(user)
    
    if (
        "HR User" in roles
        or "HR Manager" in roles
        or "System Manager" in roles
        or user == "Administrator"
    ):
        return None
    
    return "1=2"


