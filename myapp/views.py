import random
import traceback
from django.http import JsonResponse
import json
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

global uname
def dictfetchall(cursor):
    """
    Return all rows from a cursor as a dict.
    Assume the column names are unique.
    """
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def get_all_papers(request):
    val = request.GET.get('val', None)
    tex = request.GET.get('text', None)
    print(val, tex)
    args = [ uname]
    print(request.body)
    if request.body and json.loads(request.body):
        print (json.loads(request.body))
    with connection.cursor() as cursor:
        if val == 'keyword':
            raw_query = '''
            SELECT papers.paper_id, GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') AS names,
            title, update_date, 
            GROUP_CONCAT(DISTINCT categories.category_description ORDER BY categories.category_description SEPARATOR '; ') AS categories
            from papers join paper_authors on papers.paper_id = paper_authors.paper_id 
            join authors on authors.author_id = paper_authors.author_id 
            join paper_categories on papers.paper_id = paper_categories.paper_id
            join categories on paper_categories.category_id = categories.category_id
            where papers.abstract like %s
            group by papers.paper_id 
            order by papers.update_date desc
            LIMIT 15'''
            value = f"%{tex}%"
            cursor.execute(raw_query, (value,))
        elif val == 'author':
            raw_query = '''
            SELECT papers.paper_id, GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') AS names,
            title, update_date, 
            GROUP_CONCAT(DISTINCT categories.category_description ORDER BY categories.category_description SEPARATOR '; ') AS categories
            from papers join paper_authors on papers.paper_id = paper_authors.paper_id 
            join authors on authors.author_id = paper_authors.author_id 
            join paper_categories on papers.paper_id = paper_categories.paper_id
            join categories on paper_categories.category_id = categories.category_id
            where authors.name like %s
            group by papers.paper_id 
            order by papers.update_date desc
            LIMIT 15'''
            value = f"%{tex}%"
            cursor.execute(raw_query, (value,))
        elif val == 'category':
            raw_query = '''
            SELECT papers.paper_id, GROUP_CONCAT(name ORDER BY name SEPARATOR ', ') AS names,
            title, update_date, 
            GROUP_CONCAT(DISTINCT categories.category_description ORDER BY categories.category_description SEPARATOR '; ') AS categories
            from papers join paper_authors on papers.paper_id = paper_authors.paper_id 
            join authors on authors.author_id = paper_authors.author_id 
            join paper_categories on papers.paper_id = paper_categories.paper_id
            join categories on paper_categories.category_id = categories.category_id
            where categories.category_full_des like %s
            group by papers.paper_id 
            order by papers.update_date desc
            LIMIT 15'''
            value = f"%{tex}%"
            cursor.execute(raw_query, (value,))
        else:
            cursor.callproc("paperpilot.homepage", args)
        result_set = cursor.fetchall()

    response = [
        {'paper_id': row[0], 'names': row[1], 'title': row[2], 'update_date': row[3], 'category': row[4]}
        for row in result_set
    ]

    return JsonResponse(response, safe=False)
    
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
        
@csrf_exempt
def post_upp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            with connection.cursor() as cursor:
                cursor.execute("SELECT user_id FROM users WHERE username = %s", [data['user_id']])
                row = cursor.fetchone()
                if row is not None:
                    user_id = row[0]
                    sql = """INSERT INTO user_preferred_papers (user_id, paper_id, preference_ranking) VALUES (%s, %s, %s)"""
                    print(data, user_id, data['paper_id'])
                    cursor.execute(sql, [user_id, data['paper_id'], 1])
                    connection.commit()
                    return JsonResponse({'status': 'success', 'user_id': user_id}, status=200)
                else:
                    traceback.print_exc()
                    return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
        except Exception as e:
            traceback.print_exc()
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
            global uname
            uname = user['username']
            
            print(user)
        except Exception as e:
            return Response({"error": "Invalid user details"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"message": "Login successful for user: {}".format(username), "token": user['user_id']}, status=status.HTTP_200_OK)

class SignupView(APIView):
    def post(self, request):
        try:
            username, password = request.data['username'], request.data['password']
        except KeyError as e:
            return Response({"error": f"Missing data: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE username = %s", [username])
                if cursor.fetchone():
                    return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

            signup_query = """
            INSERT INTO users (username, password) VALUES (%s, %s)
            """
            with connection.cursor() as cursor:
                cursor.execute(signup_query, [username, password])

            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE username = %s", [username])
            user = dictfetchall(cursor)[0]

            return Response({"message": "Signup successful for user: {}".format(username), "token": user['user_id']}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Signup Failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

