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
global uid
def dictfetchall(cursor):
    """
    Return all rows from a cursor as a dict.
    Assume the column names are unique.
    """
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]

def get_user_profile(request):
    id=request.GET.get('id', None)
    try:
        with connection.cursor() as cursor:
            raw_query='''
            SELECT username, password, first_name, last_name, email
            from users
            where user_id = %s
            '''
            print('Printing id', id)
            cursor.execute(raw_query,(id,))
            result=cursor.fetchall()
            print(result)
            response={'username':result[0][0], 'password':result[0][1], 'first_name':result[0][2],'last_name':result[0][3],'email':result[0][4]}
            return JsonResponse(response, status=200)
    except Exception as e:
        print(e)

# def get_user_preferred_category(request):
#     id=request.GET.get('id', None)
#     with connection.cursor() as cursor:
#         raw_query='''
#         SELECT 

#         '''
def get_user_pref_categories(request):
    id=request.GET.get('id', None)
    print("pref cat id",id)
    try:
        with connection.cursor() as cursor:
            raw_query='''
            SELECT category_description
            from user_preferred_categories join categories on user_preferred_categories.category_id=categories.category_id
            where user_id = %s
            '''
            print('Printing id', id)
            cursor.execute(raw_query,(id,))
            result=cursor.fetchall()
            print(result)
            response = [
        {'category_name': row[0]}
        for row in result
         ]
        return JsonResponse(response, safe=False, status=200)
    except Exception as e:
        print(e)

def get_user_pref_papers(request):
    id=request.GET.get('id', None)
    print("pref cat id",id)
    try:
        with connection.cursor() as cursor:
            raw_query='''
            SELECT papers.paper_id, title, paper_link
            from user_preferred_papers join papers on user_preferred_papers.paper_id=papers.paper_id
            where user_id = %s
            '''
            print('Printing id', id)
            cursor.execute(raw_query,(id,))
            result=cursor.fetchall()
            print(result)
            response = [
        {'title': row[1],'link':row[2],'id':row[0]}
        for row in result
         ]
        return JsonResponse(response, safe=False, status=200)
    except Exception as e:
        print(e)

def get_all_papers(request):
    val = request.GET.get('val', None)
    tex = request.GET.get('text', None)
    cur = request.GET.get('currentPage', None)
    usn = request.GET.get('uname', None)
    print(val, tex, cur, usn)
    ints = (int(cur)-1 )* 15
    args = [ usn, ints]
    print(args, usn, ints)
    print(request.body)
    # if request.body and json.loads(request.body):
    #     print (json.loads(request.body))
    with connection.cursor() as cursor:
        if val == 'keyword':
            print("Keyword search applied")
            raw_query = '''
            SELECT papers.paper_id, GROUP_CONCAT(DISTINCT name ORDER BY name SEPARATOR ', ') AS names,
            title, update_date, 
            GROUP_CONCAT(DISTINCT categories.category_description ORDER BY categories.category_description SEPARATOR '; ') AS categories,
            papers.paper_link
            from papers join paper_authors on papers.paper_id = paper_authors.paper_id 
            join authors on authors.author_id = paper_authors.author_id 
            join paper_categories on papers.paper_id = paper_categories.paper_id
            join categories on paper_categories.category_id = categories.category_id
            where papers.abstract like %s
            group by papers.paper_id 
            order by papers.update_date desc
            LIMIT 15 OFFSET %s'''
            value = f"%{tex}%"
            cursor.execute(raw_query, (value,ints))
        elif val == 'author':
            print("Author search applied")
            raw_query = '''
            SELECT papers.paper_id, GROUP_CONCAT(DISTINCT name ORDER BY name SEPARATOR ', ') AS names,
            title, update_date, 
            GROUP_CONCAT(DISTINCT categories.category_description ORDER BY categories.category_description SEPARATOR '; ') AS categories,
            papers.paper_link
            from papers join paper_authors on papers.paper_id = paper_authors.paper_id 
            join authors on authors.author_id = paper_authors.author_id 
            join paper_categories on papers.paper_id = paper_categories.paper_id
            join categories on paper_categories.category_id = categories.category_id
            where authors.name like %s
            group by papers.paper_id 
            order by papers.update_date desc
            LIMIT 15 OFFSET %s'''
            value = f"%{tex}%"
            cursor.execute(raw_query, (value,ints))
        elif val == 'category':
            print("Category search applied")
            raw_query = '''
            SELECT papers.paper_id, GROUP_CONCAT(DISTINCT name ORDER BY name SEPARATOR ', ') AS names,
            title, update_date, 
            GROUP_CONCAT(DISTINCT categories.category_description ORDER BY categories.category_description SEPARATOR '; ') AS categories,
            papers.paper_link
            from papers join paper_authors on papers.paper_id = paper_authors.paper_id 
            join authors on authors.author_id = paper_authors.author_id 
            join paper_categories on papers.paper_id = paper_categories.paper_id
            join categories on paper_categories.category_id = categories.category_id
            where categories.category_full_des like %s
            group by papers.paper_id 
            order by papers.update_date desc
            LIMIT 15 OFFSET %s'''
            
            
            value = f"%{tex}%"
            cursor.execute(raw_query, (value,ints, ))
        else:
            # print("Hello there okay????")
            # print(args, usn, ints)
            cursor.callproc("paperpilot.homepage", args)
        result_set = cursor.fetchall()

        response = []
        for row in result_set: 
            raw_query = '''select paper_id from user_preferred_papers where paper_id = %s and user_id = %s'''
            cursor.execute(raw_query, (row[0], usn, ))
            is_favourite = len(cursor.fetchall()) > 0
            response.append({'paper_id': row[0], 'names': row[1], 'title': row[2], 'update_date': row[3], 'category': row[4], "link": row[5], 'is_fav': is_favourite})
    # response = [
    #     {'paper_id': row[0], 'names': row[1], 'title': row[2], 'update_date': row[3], 'category': row[4], "link": row[5]}
    #     for row in result_set
    # ]

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
'''
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
'''
        
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
            global uname, uid
            uname = user['username']
            uid = user['user_id']
            
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

class SignupView(APIView):
    def post(self, request):
        try:
            username, password, fname, lname, email= request.data['username'], request.data['password'], request.data['fname'], request.data['lname'], request.data['email']
        except KeyError as e:
            return Response({"error": f"Missing data: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE username = %s", [username])
                if cursor.fetchone():
                    return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

            signup_query = """
            INSERT INTO users (username, password, first_name, last_name, email) VALUES (%s, %s,%s,%s,%s)
            """
            with connection.cursor() as cursor:
                cursor.execute(signup_query, [username, password, fname, lname, email])
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE username = %s", [username])
            user = dictfetchall(cursor)[0]

            return Response({"message": "Signup successful for user: {}".format(username), "token": user['user_id']}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({"error": "Signup Failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@csrf_exempt
def update_user_profile(request):
    try:
        # Parse request data
        # data = request.PUT # Assuming data is sent in the request body
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)

        user_id = data.get('id', None)
        username = data.get('username', None)
        password = data.get('password', None)
        first_name = data.get('first_name', None)
        last_name = data.get('last_name', None)
        email = data.get('email', None)

        print('printing data',data)
        print('details',user_id,username,password, first_name,last_name,email)

        with connection.cursor() as cursor:
            cursor.execute('''
                UPDATE users
                SET username = %s, password = %s, first_name = %s, last_name = %s, email = %s
                WHERE user_id = %s
            ''', [username, password, first_name, last_name, email, user_id])

        return JsonResponse({'message': 'User profile updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
def delete_papers(request, user_id):
    if request.method == 'PUT':
        try:
            with connection.cursor() as cursor:
                # Assuming the paper IDs to delete are sent in the request body as a list
                data = json.loads(request.body)
                paper_ids = data.get('papers', [])
                # user_id=data.get('id',None)

                print("Deletion",user_id)
                print(paper_ids)

                # Construct the SQL query to delete preferred papers based on their IDs
                sql_query = '''DELETE FROM user_preferred_papers WHERE paper_id IN %s and user_id=%s'''
                
                # Execute the SQL query
                cursor.execute(sql_query, [tuple(paper_ids),user_id])

                # Commit the transaction
                connection.commit()

                return JsonResponse({'message': 'Preferred papers deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


class CategorySearchView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        if not query:
            return Response({"error": "Query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT DISTINCT category_id, category_name, category_description
                FROM categories  
                WHERE category_description LIKE %s
                """, [f"%{query}%"])

        category_list = dictfetchall(cursor)

        return Response(category_list, status=status.HTTP_200_OK)

class PapersCountView(APIView):
    def get(self, request):
        category = request.GET.get('category', '')
        if not category:
            return Response({"error": "Query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(p.title) AS TotalPapers, YEAR(p.update_date) AS YearUpdated
                FROM papers p 
                JOIN paper_categories pc ON p.paper_id = pc.paper_id 
                JOIN categories cat ON cat.category_id = pc.category_id 
                AND cat.category_name = %s
                WHERE p.title IS NOT NULL
                GROUP BY YearUpdated
                ORDER BY YearUpdated DESC
                """, [category])

        result=dictfetchall(cursor)

        return Response(result, status=status.HTTP_200_OK)