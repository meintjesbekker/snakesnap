import requests
from django.conf import settings

INAT_CV_URL = 'https://api.inaturalist.org/v1/computervision/score_image'


def identify_image(image_path, token=None):
    """
    Submit an image to iNaturalist's computer vision API.
    Returns the top species match or None if unavailable.
    token: caller-supplied value (from request header); falls back to settings.
    """
    token = token or getattr(settings, 'INATURALIST_API_TOKEN', '')
    if not token:
        return None

    try:
        with open(image_path, 'rb') as f:
            resp = requests.post(
                INAT_CV_URL,
                headers={'Authorization': f'Bearer {token}'},
                files={'image': ('image.jpg', f, 'image/jpeg')},
                timeout=15,
            )
        resp.raise_for_status()
        results = resp.json().get('results', [])
        if not results:
            return None

        top = results[0]
        taxon = top.get('taxon', {})
        return {
            'taxon_id': taxon.get('id'),
            'common_name': taxon.get('preferred_common_name', taxon.get('name', '')),
            'scientific_name': taxon.get('name', ''),
            'score': round(top.get('score', 0) * 100, 1),
            'taxon_photo_url': (taxon.get('default_photo') or {}).get('medium_url', ''),
        }
    except Exception:
        return None
