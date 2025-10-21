import frappe
import smtplib

@frappe.whitelist()  
def send_test_mail():
    SMTP_SERVER = "relay.sccc.sa"
    SMTP_PORT = 465
    USERNAME = "erp-product@Sccc.sa"
    PASSWORD = "OC+n0vxA6r1bq:"

    try:
        print("Attempting to send email...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10)
        print(server)
        server.ehlo()
        server.login(USERNAME, PASSWORD)
        frappe.log_error("Login successful", "Email Test")
        server.sendmail(USERNAME, "bhaveshmahavar1312@gmail.com", "Subject: Test\n\nHello from Ubuntu")
        print("Email sent successfully!")
        server.quit()
    except Exception as e:
        print("Failed to send email.")
        print("Error:", e)
