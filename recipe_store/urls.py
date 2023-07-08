"""recipe_store URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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
from django.contrib import admin
from django.urls import path
from mainapp import views



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_page, name="home-page"),
    path('search/', views.search_page, name="search-page"),
    path('favourites/', views.favourite_page, name="favourite-page"),
    path('detail/<int:id>', views.detail_page, name="detail-page"),
    path('api/chat', views.chat_api, name="chat-page"),
    path('chat', views.chatgpt_page, name="chatgpt-page"),
    path('search/api/<str:recipe_title>', views.get_all_search_api, name="search-api"),
    path('popular/breakfast/api', views.get_popular_breakfast_api, name="popular-breakfast-api"),
    path('popular/lunch/api', views.get_popular_lunch_api, name="popular-lunch-api"),
    path('popular/dinner/api', views.get_popular_dinner_api, name="popular-dinner-api"),
    path('api/detail/ingredients/<int:id>', views.get_all_ingredients_api, name="recipe-ingredients-api"),
    path('api/detail/steps/<int:id>', views.get_all_steps_api, name="recipe-steps-api"),
    path('api/detail/<int:id>', views.get_recipe_detail_api, name="recipe-detail-api")
]

