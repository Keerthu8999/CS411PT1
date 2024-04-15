from django.http import JsonResponse
from .models import Author

def article_data(request):
    try:
        articles = list(Author.objects.all().values())
        return JsonResponse(articles, safe=False)  # Convert QuerySet to a list and return as JSON
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
from django.db import connection

def paper_statistics(request):
    # Your SQL query as a multi-line string
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

    # Format the results into a list of dictionaries
    papers_by_year = [
        {'TotalPapers': row[0], 'YearUpdated': row[1]}
        for row in result_set
    ]

    return JsonResponse(papers_by_year, safe=False)

