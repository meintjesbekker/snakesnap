from django.contrib import admin
from .models import SnakeSighting

@admin.register(SnakeSighting)
class SnakeSightingAdmin(admin.ModelAdmin):
    list_display = ['inat_common_name', 'inat_scientific_name', 'inat_score', 'snake_name', 'location_type', 'created_at']
    list_filter = ['inat_common_name', 'location_type', 'time_of_day', 'add_to_database']
    search_fields = ['snake_name', 'species', 'inat_common_name', 'inat_scientific_name', 'notes']
