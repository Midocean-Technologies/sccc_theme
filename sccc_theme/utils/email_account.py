import smtplib

def smtp_server_test():
    sender = 'erp@apps.sccc.sa'
    password = 'OC+n0vxA6r1bq:'  

    with smtplib.SMTP_SSL('andrew.ace-host.net', 465, timeout=25) as server:
        server.login(sender, password)
        print("Login successful")
