import threading
import time
from django.apps import AppConfig
from your_app.models import User  # Replace with your actual user model path

def delete_invalid_users_periodically():
    while True:
        User.objects.filter(is_validate=False).delete()
        time.sleep(2 * 60) 
class YourAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_auth'

    def ready(self):
        threading.Thread(target=delete_invalid_users_periodically, daemon=True).start()
