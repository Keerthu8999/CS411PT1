from django.http import JsonResponse
from .models import Author

def article_data(request):
    try:
        articles = list(Author.objects.all().values())
        return JsonResponse(articles, safe=False)  # Convert QuerySet to a list and return as JSON
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
