from django.urls import path
from . import views

urlpatterns = [
  path('', views.index, name="index"),
  path('app/', views.app, name="app"),
  path('about/', views.about, name="about"),
  path('hola/<str:username>', views.hola),
  path('projects/', views.projects),
  path('tasks/<str:title>', views.tasks),
]