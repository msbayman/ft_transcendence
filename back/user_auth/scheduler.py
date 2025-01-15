from apscheduler.schedulers.background import BackgroundScheduler
from django.utils.timezone import now
from your_app.models import User

def delete_invalid_users():
    User.objects.filter(is_validate=False).delete()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_invalid_users, 'interval', minutes=20)
    scheduler.start()
