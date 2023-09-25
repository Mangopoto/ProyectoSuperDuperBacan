from django.db import models

# Create your models here.

class Auto(models.Model):
    modelo= models.CharField(max_length=100)
    marca= models.CharField(max_length=100)
    fecha= models.DateTimeField(auto_now=True)