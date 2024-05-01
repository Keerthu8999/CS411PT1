"""
URL configuration for cs411pt1 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from myapp import views
from myapp.views import paper_statistics, LoginView, DataUserView, InteractiveDataUserView,  SignupView, CategorySearchView, PapersCountView
from django.contrib import admin

urlpatterns = [
    path('api/categories/search', CategorySearchView.as_view(), name='category-search'),
    path('api/papers/count', PapersCountView.as_view(), name='papers-count'),
    path('api/data/interactive/user/<int:user_id>/', InteractiveDataUserView.as_view(), name='interactive-data-user'),
    path('api/data/user/<int:user_id>/', DataUserView.as_view(), name='data-user'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('admin/', admin.site.urls),
    path('', views.paper_statistics, name='article-data'),
    path('api/post_data/', views.post_data, name='post-data'),
    path('api/post_upp/', views.post_upp, name='post_upp'),
    path('api/get_all_papers/', views.get_all_papers, name = 'get_all_papers'),
    path('api/get_user_profile/', views.get_user_profile, name = 'get_user_profile'),
    path('api/update_user_profile/', views.update_user_profile, name = 'update_user_profile'),
    path('api/user_pref_categories/', views.get_user_pref_categories, name = 'get_user_pref_cat'),
    path('api/user_pref_papers/', views.get_user_pref_papers, name = 'get_user_pref_papers'),
    path('api/delete_papers/<int:user_id>/', views.delete_papers, name = 'delete_pref_papers')
]
