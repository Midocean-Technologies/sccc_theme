# Copyright (c) 2025, midocean technologies Pvt LTD and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class scccthemesettings(Document):
	def validate(self):
		if self.current_site_plan and self.user_limitation:
			frappe.msgprint(
				msg = f"Current Plan is <b>{self.current_site_plan}</b> with User Limitation <b>{self.user_limitation}</b>",
				indicator = "green",
			)

