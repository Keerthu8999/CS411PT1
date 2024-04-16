import random
from django.http import JsonResponse
from .models import Author, User
import json
from django.db import connection
from django.views.decorators.csrf import csrf_exempt


def article_data(request):
    try:
        articles = list(Author.objects.all().values())
        return JsonResponse(articles, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
def paper_statistics(request):
    raw_query = """
    SELECT COUNT(p.title) AS TotalPapers, YEAR(p.update_date) AS YearUpdated
    FROM papers p 
    JOIN paper_categories pc ON p.paper_id = pc.paper_id 
    JOIN categories cat ON cat.category_id = pc.category_id 
    AND cat.category_full_des LIKE '%%Computer Science%%'
    WHERE p.title IS NOT NULL
    GROUP BY YearUpdated
    ORDER BY YearUpdated DESC
    LIMIT 15;
    """
    
    with connection.cursor() as cursor:
        cursor.execute(raw_query)
        result_set = cursor.fetchall()

    papers_by_year = [
        {'TotalPapers': row[0], 'YearUpdated': row[1]}
        for row in result_set
    ]

    return JsonResponse(papers_by_year, safe=False)

@csrf_exempt
def post_data(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_entry = User(user_id=random.randint(1033453, 10334539), first_name=data['fname'], last_name=data['lname'], email=data['email'], password = data['pass'])
            new_entry.save()
            return JsonResponse({'status': 'success'}, status=200)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
