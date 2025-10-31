import smtplib

def send_test_mail():
    server = smtplib.SMTP('smtp.sccc.sa', 25,timeout=25)
    server.starttls()
    server.login('erp-product@sccc.sa', 'OC+n0vxA6r1bq:')
    print("Login successful")
    server.quit()
