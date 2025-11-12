__version__ = "0.0.1"

from frappe import twofactor
from sccc_theme.utils import core_method_overrides

twofactor.send_token_via_email = core_method_overrides.send_token_via_email