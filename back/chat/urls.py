from django.urls import path
from .views import user_list_view
from .views import LastMessageView
from .views import GetConversation
from .views import BlockUser
from .views import IsBlocked
from .views import UnBlockUser
from .views import GetUserInfo

urlpatterns = [
    path('api/users/', user_list_view.as_view(), name='user-list-api'),
    path('last-message/', LastMessageView.as_view(), name='last-message'),
    path('getconversation/<str:username>/', GetConversation.as_view(), name='getconversation'),
    path('block_user/<str:username>/', BlockUser.as_view(), name='block_user'),
    path('get_user_info/<str:username>/', GetUserInfo.as_view(), name='get_user_info'),
    path('unblock_user/<str:username>/', UnBlockUser.as_view(), name='unblock_user'),
    path('isblocked/<str:username>/', IsBlocked.as_view(), name='isblocked'),
]
