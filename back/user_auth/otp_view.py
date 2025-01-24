import secrets
import time
from django.core.mail import send_mail
from django.conf import settings

# OTP Storage
otp_storage = {}

def generate_otp():
    return f"{secrets.randbelow(1000000):06d}"

def send_otp_via_email(recipient_email, otp):
    subject = 'Your One-Time Password (OTP)'
    body = f'Your OTP is: {otp}\nThis OTP is valid for 5 minutes.'
    send_mail(
        subject=subject,
        message=body,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[recipient_email],
        fail_silently=False,
    )
    store_otp(recipient_email, otp)

def store_otp(email, otp):
    otp_storage[email] = {'otp': otp, 'timestamp': time.time()}

def verify_otp(email, entered_otp):
    if email in otp_storage:
        stored_otp_info = otp_storage[email]
        if time.time() - stored_otp_info['timestamp'] > 300:  # 5 minutes
            del otp_storage[email]
            return False
        elif stored_otp_info['otp'] == entered_otp:
            del otp_storage[email]
            return True
    return False
