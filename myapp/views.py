import random
from django.http import JsonResponse
import json
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

def dictfetchall(cursor):
    """
    Return all rows from a cursor as a dict.
    Assume the column names are unique.
    """
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


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

class LoginView(APIView):
    def post(self, request):
        try:
            username, password = request.data['username'], request.data['password']
        except KeyError as e:
            return Response({"error": f"Missing data: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            login_query = """
            SELECT * FROM users WHERE username = %s AND password = %s
            """
            with connection.cursor() as cursor:
                cursor.execute(login_query, [username, password])
            user = dictfetchall(cursor)[0]
            print(user)
        except Exception as e:
            return Response({"error": "Invalid user details"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"message": "Login successful for user: {}".format(username), "token": user['user_id']}, status=status.HTTP_200_OK)

class DataUserView(APIView):
    def get(self, request, user_id):
        try:
            with connection.cursor() as cursor:
                cursor.callproc('get_top_authors_and_keywords', (user_id,))

                result_sets = cursor.fetchall()

                data = []
                for result in result_sets:
                    print(result)
                    category_data = {
                        'category_id': result[0],
                        'category_name': result[1],
                        'category_description': result[2],
                        'top_authors': json.loads(result[3]),
                        'top_keywords': json.loads(result[4])
                    }

                    data.append(category_data)
        except Exception as e:
            print(e)
            return Response({"error": "Unable to complete query"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Got data for user preferences", "data": data}, status=status.HTTP_200_OK)

class InteractiveDataUserView(APIView):
    def get(self, request, user_id):
        try:
            data_query = '''
            SELECT
                YEAR(P.update_date) AS year,
                COUNT(P.paper_id) AS paper_count,
                SUM(COUNT(P.paper_id)) OVER (ORDER BY YEAR(P.update_date)) AS cumulative_count,
                C.category_name,
                C.category_description
            FROM papers P
            JOIN paper_categories PC ON P.paper_id = PC.paper_id
            JOIN categories C ON PC.category_id = C.category_id
            JOIN user_preferred_categories UPC ON C.category_id = UPC.category_id
            WHERE UPC.user_id = %s 
            GROUP BY YEAR(P.update_date), C.category_name, C.category_description
            ORDER BY YEAR(P.update_date);
            '''
            with connection.cursor() as cursor:
                cursor.execute(data_query, [user_id])

                data = dictfetchall(cursor)
        except Exception as e:
            print(e)
            return Response({"error": "Unable to complete query"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Got interactive data for user", "data": data}, status=status.HTTP_200_OK)


