from django.db import models


class SnakeSighting(models.Model):
    THICKNESS_CHOICES = [('thin', 'Thin'), ('medium', 'Medium'), ('thick', 'Thick')]
    HEAD_CHOICES = [('rounded', 'Rounded'), ('triangular', 'Triangular'), ('narrow', 'Narrow')]
    EYE_CHOICES = [('round', 'Round pupil'), ('vertical', 'Vertical pupil'), ('not_visible', 'Not visible')]
    LOCATION_CHOICES = [
        ('garden', 'Garden'), ('forest', 'Forest'), ('roadside', 'Roadside'),
        ('farmland', 'Farmland'), ('wetland', 'Wetland'), ('urban', 'Urban'),
    ]
    TIME_CHOICES = [('morning', 'Morning'), ('afternoon', 'Afternoon'), ('evening', 'Evening'), ('night', 'Night')]

    snake_name = models.CharField(max_length=200, blank=True)
    species = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to='sightings/', blank=True, null=True)

    length_cm = models.PositiveIntegerField(default=50)
    thickness = models.CharField(max_length=20, choices=THICKNESS_CHOICES, blank=True)
    pattern = models.JSONField(default=list, blank=True)
    head_shape = models.CharField(max_length=20, choices=HEAD_CHOICES, blank=True)
    eye_type = models.CharField(max_length=20, choices=EYE_CHOICES, blank=True)

    behaviour = models.JSONField(default=list, blank=True)
    condition = models.JSONField(default=list, blank=True)
    num_snakes = models.PositiveSmallIntegerField(default=1)
    confidence = models.PositiveSmallIntegerField(default=50)

    location_type = models.CharField(max_length=20, choices=LOCATION_CHOICES, blank=True)
    micro_habitat = models.JSONField(default=list, blank=True)
    time_of_day = models.CharField(max_length=20, choices=TIME_CHOICES, blank=True)
    weather = models.JSONField(default=list, blank=True)

    notes = models.TextField(blank=True)
    add_to_database = models.BooleanField(default=False)

    # iNaturalist computer vision result
    inat_taxon_id = models.IntegerField(null=True, blank=True)
    inat_common_name = models.CharField(max_length=200, blank=True)
    inat_scientific_name = models.CharField(max_length=200, blank=True)
    inat_score = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.species or 'Unknown'} — {self.created_at:%Y-%m-%d %H:%M}"
