from django.core.management.base import BaseCommand
from django.utils import timezone
from user_auth.models import Player

class Command(BaseCommand):
    help = 'Deletes all unvalidated users at midnight'

    def handle(self, *args, **options):
        try:
            unvalidated_users = Player.objects.filter(is_validate=False)
            count = unvalidated_users.count()
            deletion_result = unvalidated_users.delete()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully deleted {count} unvalidated users at {timezone.now()}'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(
                    f'Error deleting unvalidated users: {str(e)}'
                )
            )