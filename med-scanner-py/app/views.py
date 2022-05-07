from types import new_class
from django.views import View
from django.http import JsonResponse
import json
from django.shortcuts import render
from .models import Users, Items, Bill, Transaction
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

        userName = ''
        password = ''
        fromAndroid = ''

        data = json.loads(request.body.decode("utf-8"))

        dataFromAdroid = data.get('nameValuePairs')
        if dataFromAdroid is not None:
            fromAndroid = dataFromAdroid.get('fromAndroid')

        if fromAndroid:
            userName = dataFromAdroid.get('userName')
            password = dataFromAdroid.get('password')
        else:
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


@ method_decorator(csrf_exempt, name='dispatch')
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

    # api to get all items details by item names in body array
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        print(data)

        resp = []

        try:
            for itemName in data:
                items = Items.objects.filter(name=itemName).first()
                print(items)
                if items is not None:
                    item = Items.toJSON(items)
                    resp.append(item)
        except Items.DoesNotExist:
            print("Error")
            items = None

        return JsonResponse(resp, status=200, safe=False)


@ method_decorator(csrf_exempt, name='dispatch')
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
        item = None

        try:
            if id is not None:
                items = Items.objects.get(id=id)
                item = Items.toJSON(items)
            else:
                if name is not None:
                    items = Items.objects.get(name=name)
                    item = Items.toJSON(items)
        except Items.DoesNotExist:
            item = None

        return JsonResponse(item, status=200, safe=False)

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

        data = json.loads(request.body.decode("utf-8"))
        id = data.get('id')
        name = data.get('name')
        available_quantity = data.get('available_quantity')
        rate = data.get('rate')
        content = data.get('content')
        type = data.get('type')

        # item = Items.objects.objects.update_or_create(name=name, available_quantity=available_quantity, rate=rate, content=content, type=type, defaults={id: id})

        item = Items.objects.filter(id=id).update(
            name=name, available_qunatity=available_quantity, rate=rate, content=content, type=type)

        data = {
            "message": f"Item Updated Successfully with name: {name}",
            "status": 200
        }
        return JsonResponse(data, status=200)


@ method_decorator(csrf_exempt, name='dispatch')
class BillOperations(View):
    def get(self, request):

        # data = json.loads(request.body.decode("utf-8"))
        # print(data)
        tansact_id = request.GET.get('tansact_id', None)
        print(tansact_id)
        data = []
        try:
            # if tansact_id is not None:
            bills = Bill.objects.filter(tansact_id=tansact_id)

            for bill in bills:
                jsonObj = Bill.toJSON(bill)
                print(jsonObj)
                data.append(jsonObj)
        except bills.DoesNotExist:
            bills = None
        return JsonResponse(data, status=200, safe=False)


@ method_decorator(csrf_exempt, name='dispatch')
class TransactionOperations(View):
    def get(self, request):
        # data = json.loads(request.body.decode("utf-8"))
        data = []

        try:
            transactions = Transaction.objects.all()
            for transaction in transactions:
                jsonObj = Transaction.toJSON(transaction)
                data.append(jsonObj)
        except transactions.DoesNotExist:
            transactions = None
        return JsonResponse(data, status=200, safe=False)

    def post(self, request):
        initialData = json.loads(request.body.decode("utf-8"))
        data = initialData.get('nameValuePairs')
        print('##################')
        print(data)
        name = data.get('name')
        mobile_no = data.get('mobile_no')
        itemId = data.get('itemId')
        quantity = data.get('quantity')

        transactionData = {
            'name': name,
            'mobile_no': mobile_no,
        }

        transaction = Transaction.objects.create(**transactionData)

        # fetch item details using id
        itemDetails = Items.objects.get(id=itemId)

        # add items to bill
        billItemData = {
            'tansact_id': transaction.id,
            'medicineId': itemId,
            'qunatity': quantity,
            'rate': itemDetails.rate
        }
        billItem = Bill.objects.create(**billItemData)

        new_quantity = itemDetails.available_qunatity - quantity

        # decrease Item available quantity
        item = Items.objects.filter(id=itemId).update(
            available_qunatity=new_quantity)

        data = {
            "message": f"Bill successfully generated for: {transactionData}",
            "status": 201
        }
        return JsonResponse(data, status=201)
