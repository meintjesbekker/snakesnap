from django.urls import path
from .views import SnakeSightingListCreateView

urlpatterns = [
    path('sightings/', SnakeSightingListCreateView.as_view(), name='sighting-list-create'),
]
