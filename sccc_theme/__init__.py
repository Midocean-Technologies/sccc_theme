__version__ = "0.0.1"

# twofactor.py file
from frappe import twofactor
from sccc_theme.utils import core_method_overrides

twofactor.send_token_via_email = core_method_overrides.send_token_via_email

#login.py file
# from frappe.www import login

# login.send_login_link = core_method_overrides.send_login_link