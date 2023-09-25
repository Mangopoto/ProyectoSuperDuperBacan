from django.shortcuts import render
from .models import Auto
from .forms import AutoForm

# Create your views here.
def dashboard(request):
    return render(request, 'dashboard.html')
