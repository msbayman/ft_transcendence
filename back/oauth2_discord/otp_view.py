import secrets
import smtplib
import time
from django.http import JsonResponse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# SMTP Configuration
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
EMAIL_ADDRESS = 'aymanmsaoub@gmail.com'  # Replace with your email
EMAIL_PASSWORD = 'adgi pcyk qimx zanw'   # Replace with your email password or app-specific password

# OTP Storage
otp_storage = {}

def generate_otp():
    otp = secrets.randbelow(1000000)
    return f"{otp:06d}"

def send_otp_via_email(recipient_email, otp):
    subject = 'Your One-Time Password (OTP)'
    body = f'Your OTP is: {otp}\nThis OTP is valid for 5 minutes.'

    msg = MIMEMultipart()
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = recipient_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
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

def send_otp_email(request, email_to_send):
    # Generate OTP
    otp = generate_otp()

    # Send the OTP to the specified email address
    if send_otp_via_email(email_to_send, otp):
        # Store the OTP in the session or some storage
        store_otp(email_to_send, otp)
        return JsonResponse({'message': f'OTP sent to {email_to_send}'}, status=200)
    else:
        return JsonResponse({'error': 'Failed to send OTP'}, status=500)
