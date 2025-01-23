import secrets
import time
from django.core.mail import send_mail
from django.conf import settings
import sys
import logging
from django.utils.autoreload import run_with_reloader
from threading import Thread

# Configure logging to output immediately
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

# OTP Storage
otp_storage = {}

def generate_otp():
    otp = secrets.randbelow(1000000)
    formatted_otp = f"{otp:06d}"
    # Force immediate log output
    print(f"Generated OTP: {formatted_otp}", flush=True)
    sys.stdout.flush()
    return formatted_otp

def send_otp_via_email(recipient_email, otp):
    subject = 'Your One-Time Password (OTP)'
    body = f'Your OTP is: {otp}\nThis OTP is valid for 5 minutes.'
    
    # Force immediate log output
    print(f"Attempting to send OTP {otp} to {recipient_email}", flush=True)
    sys.stdout.flush()
    
    try:
        # Send email using Django's send_mail
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        print(f"Successfully sent OTP email to {recipient_email}", flush=True)
        sys.stdout.flush()
        
        # Store the OTP
        store_otp(recipient_email, otp)
        return True
        
    except Exception as e:
        error_msg = f"Failed to send email to {recipient_email}. Error: {str(e)}"
        print(error_msg, flush=True)
        sys.stdout.flush()
        
        # Fall back to console display for development
        print(f"\nDEVELOPMENT MODE - OTP for {recipient_email}: {otp}\n", flush=True)
        sys.stdout.flush()
        return False

def store_otp(email, otp):
    current_time = time.time()
    otp_storage[email] = {'otp': otp, 'timestamp': current_time}
    print(f"Stored OTP for {email}", flush=True)
    sys.stdout.flush()

def verify_otp(email, entered_otp):
    if email in otp_storage:
        stored_otp_info = otp_storage[email]
        stored_otp = stored_otp_info['otp']
        timestamp = stored_otp_info['timestamp']
        current_time = time.time()
        
        if current_time - timestamp > 300:  # 5 minutes
            print('OTP has expired.', flush=True)
            del otp_storage[email]
            return False
        elif stored_otp == entered_otp:
            print('OTP verified successfully!', flush=True)
            del otp_storage[email]
            return True
        else:
            print('Invalid OTP.', flush=True)
            return False
    else:
        print('No OTP found for this email.', flush=True)
        return False