from django.views import View
from django.http import JsonResponse
import json
from django.shortcuts import render
from .models import Users, Items
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
import json

# Create your views here.


@method_decorator(csrf_exempt, name='dispatch')
class User(View):
    def post(self, request):

        print(request.body)
        data = json.loads(request.body.decode("utf-8"))
        userName = data.get('userName')
        password = data.get('password')
        role = 'admin'

        userData = {
            'userName': userName,
            'password': password,
            'role': role,
        }

        userItems = Users.objects.create(**userData)

        data = {
            "message": f"User Registration Successfull with Username: {userItems.userName}",
            "status": 201
        }
        return JsonResponse(data, status=201)


@method_decorator(csrf_exempt, name='dispatch')
class Login(View):
    def post(self, request):

        data = json.loads(request.body.decode("utf-8"))
        userName = data.get('userName')
        password = data.get('password')

        try:
            user = Users.objects.get(userName=userName)

            if(user.password == password):
                data = {
                    'msg': 'Login Success',
                    'isLogin': 'true',
                    'username': user.userName,
                    'status': 200
                }
            else:
                data = {
                    'msg': 'Invalid Credentials',
                    'isLogin': 'false',
                    'status': 404
                }
        except Users.DoesNotExist:
            data = {
                'msg': 'Invalid Credentials',
                'isLogin': 'false',
                'status': 404
            }
        return JsonResponse(data, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class ItemsOperations(View):
    def get(self, request):
        # data = json.loads(request.body.decode("utf-8"))
        data = []

        try:
            items = Items.objects.all()
            for item in items:
                jsonObj = Items.toJSON(item)
                data.append(jsonObj)
        except Items.DoesNotExist:
            items = None
        return JsonResponse(data, status=200, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class ItemOperations(View):
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        name = data.get('name')
        available_quantity = data.get('available_quantity')
        rate = data.get('rate')
        content = data.get('content')
        type = data.get('type')

        itemData = {
            'name': name,
            'available_qunatity': available_quantity,
            'rate': rate,
            'content': content,
            'type': type,
        }

        item = Items.objects.create(**itemData)

        data = {
            "message": f"Item added Successfully with name: {item.name}",
            "status": 201
        }
        return JsonResponse(data, status=201)

    def get(self, request):
        id = request.GET.get('id', None)
        name = request.GET.get('name', None)
        items = None

        try:
            if id is not None:
                items = Items.objects.get(id=id)
            else:
                if name is not None:
                    items = Items.objects.get(name=name)
        except Items.DoesNotExist:
            items = None

        return JsonResponse(items, status=200, safe=False)

    def delete(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)
        id = data.get('id')

        items = Items.objects.filter(id=id).delete()

        data = {
            
            'msg': 'Delete Success',
            'status': 200
        }
        return JsonResponse(data, status=200, safe=False)

    def put(self, request):

        id = request.GET.get('id', None)
        data = json.loads(request.body.decode("utf-8"))
        name = data.get('name')
        available_quantity = data.get('available_quantity')
        rate = data.get('rate')
        content = data.get('content')
        type = data.get('type')

        # item = Items.objects.objects.update_or_create(name=name, available_quantity=available_quantity, rate=rate, content=content, type=type, defaults={id: id})
        
        item = Items.objects.filter(id=id).update(name=name, available_qunatity=available_quantity, rate=rate, content=content, type=type)

        data = {
            "message": f"Item Updated Successfully with id: {item}",
            "status": 200
        }
        return JsonResponse(data, status=200)