import secrets
import smtplib
from django.conf import settings
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# OTP Storage
otp_storage = {}

def generate_otp():
    otp = secrets.randbelow(1000000)
    return f"{otp:06d}"

def send_otp_via_email(recipient_email, otp):
    subject = 'Your One-Time Password (OTP)'
    body = f'Your OTP is: {otp}\nThis OTP is valid for 5 minutes.'

    msg = MIMEMultipart()
    msg['From'] = settings.EMAIL_ADDRESS
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f'OTP email sent to {recipient_email}')
        return True
    except Exception as e:
        print(f'Failed to send email to {recipient_email}. Error: {e}')
        return False

def store_otp(email, otp):
    current_time = time.time()
    otp_storage[email] = {'otp': otp, 'timestamp': current_time}

def verify_otp(email, entered_otp):
    if email in otp_storage:
        stored_otp_info = otp_storage[email]
        stored_otp = stored_otp_info['otp']
        timestamp = stored_otp_info['timestamp']
        current_time = time.time()

        if current_time - timestamp > 300:
            print('OTP has expired.')
            del otp_storage[email]
            return False
        elif stored_otp == entered_otp:
            print('OTP verified successfully!')
            del otp_storage[email]
            return True
        else:
            print('Invalid OTP.')
            return False
    else:
        print('No OTP found for this email.')
        return False
