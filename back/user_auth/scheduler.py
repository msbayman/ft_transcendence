from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from django.utils import timezone
from django.conf import settings
from user_auth.models import Player
import logging

logger = logging.getLogger(__name__)

def cleanup_unvalidated_users():
    try:
        unvalidated_users = Player.objects.filter(is_validate=False)
        count = unvalidated_users.count()
        deletion_result = unvalidated_users.delete()
        logger.info(f'Successfully deleted {count} unvalidated users at {timezone.now()}')
    except Exception as e:
        logger.error(f'Error deleting unvalidated users: {str(e)}')

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")
    
    # Run job every 2 minutes
    scheduler.add_job(
        cleanup_unvalidated_users,
        'interval',
        minutes=2,
        name='cleanup_unvalidated_users',
        jobstore='default'
    )
    
    scheduler.start()