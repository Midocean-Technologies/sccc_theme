import frappe
from frappe.core.doctype.module_profile.module_profile import ModuleProfile

class CustomModuleProfile(ModuleProfile):

    def onload(self):
        modules = self.get_modules_from_all_apps()
        self.set_onload("all_modules", sorted(m.get("module_name") for m in modules))

    def get_modules_from_all_apps(self):
        modules_list = []
        for app in frappe.get_installed_apps():
            modules_list += self.get_modules_from_app(app)
        print("Custom Module List:", modules_list)
        return modules_list

    def get_modules_from_app(self, app):
        return frappe.get_all(
            "Module Def",
            filters={
                "app_name": app,
                "module_name": ["in", ["HR", "Accounts", "Stock", "Selling", "Buying"]],
            },
            fields=["module_name", "app_name as app"]
        )
