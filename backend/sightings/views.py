from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .inat_service import identify_image
from .models import SnakeSighting
from .serializers import SnakeSightingSerializer


class SnakeSightingListCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        sightings = SnakeSighting.objects.all()
        serializer = SnakeSightingSerializer(sightings, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = SnakeSightingSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        sighting = serializer.save()

        identification = None
        previous_sightings = []

        if sighting.image:
            token = request.headers.get('X-Inat-Token') or None
            identification = identify_image(sighting.image.path, token=token)

            if identification:
                SnakeSighting.objects.filter(pk=sighting.pk).update(
                    inat_taxon_id=identification['taxon_id'],
                    inat_common_name=identification['common_name'],
                    inat_scientific_name=identification['scientific_name'],
                    inat_score=identification['score'],
                )

                # Find previous sightings of the same species using stable taxon ID
                if identification['taxon_id']:
                    qs = (
                        SnakeSighting.objects
                        .filter(inat_taxon_id=identification['taxon_id'])
                        .exclude(pk=sighting.pk)
                        .order_by('-created_at')
                        .values('id', 'created_at', 'location_type', 'snake_name')
                    )
                    previous_sightings = list(qs)

        return Response({
            'sighting': serializer.data,
            'identification': identification,
            'previous_sightings': previous_sightings,
        }, status=status.HTTP_201_CREATED)
