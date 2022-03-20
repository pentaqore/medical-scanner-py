from django.contrib import admin
from .models import Users, Items ,Bill ,Transaction

# Register your models here.
admin.site.register(Users)
admin.site.register(Items)
admin.site.register(Bill)
admin.site.register(Transaction)