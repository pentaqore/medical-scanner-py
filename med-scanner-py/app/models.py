from ssl import create_default_context
from django.db import models
import json

# Create your models here.

itemType = (
    ('t', 'tablet'),
    ('c', 'capsule'),
    ('s', 'syrup'),
    ('i', 'injectible'),
)


class Users(models.Model):
    userName = models.CharField(max_length=200)
    role = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)


class Items(models.Model):
    name = models.CharField(max_length=200)
    available_qunatity = models.IntegerField()
    rate = models.DecimalField(decimal_places=2, max_digits=5)
    content = models.CharField(max_length=500)
    type = models.CharField(max_length=1, choices=itemType)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def toJSON(self):
        jsonObj = {}
        jsonObj['id'] = self.id
        jsonObj['name'] = self.name
        jsonObj['available_qunatity'] = self.available_qunatity
        jsonObj['rate'] = self.rate
        jsonObj['content'] = self.content
        jsonObj['type'] = self.type
        return jsonObj
