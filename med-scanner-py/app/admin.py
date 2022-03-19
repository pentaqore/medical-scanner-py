from django.contrib import admin
from .models import Users, Items ,Bill

# Register your models here.
admin.site.register(Users)
admin.site.register(Items)
admin.site.register(Bill)
