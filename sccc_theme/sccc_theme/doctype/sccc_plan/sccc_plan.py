# Copyright (c) 2025, Bhavesh Mahavar and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class scccplan(Document):
	def validate(self):
		pass
		# if self.plan_name:
		# 	role_profile = frappe.get_doc("Role Profile", self.plan_name)
		# 	if not role_profile:
		# 		frappe.throw(f"Role Profile '{self.plan_name}' does not exist.")
		# 	module_profile = frappe.get_doc("Module Profile", self.plan_name)
		# 	if not module_profile:
		# 		frappe.throw(f"Module Profile '{self.plan_name}' does not exist.")
		# 	self.role_profile = role_profile.name
		# 	self.module_profile = module_profile.name