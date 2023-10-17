from django.shortcuts import render, get_object_or_404
from django.template import loader
from django.http import HttpResponse, JsonResponse
from .models import Project, Task

def index(request):
  user = "Alejandro"
  context = {
    'user': user,
  }
  return render(request, 'index.html', context)

def app(request):
  context = {
  }
  return render(request, 'app.html', context)

def about(request):
  context = {
  }
  return render(request, 'about.html', context)

def hola(request, username):
  return HttpResponse("<h1>hola mundo %s</h1>" % username)

def projects(request):
  proj = list(Project.objects.order_by("id"))
  template = loader.get_template("projects.html")
  context = {
    "proj": proj,
  }
  return HttpResponse(template.render(context,request))

def tasks(request, title):
  task = get_object_or_404(Task, title=title)
  # return HttpResponse('task: %s' % task.title)
  return render(request, 'tasks.html')