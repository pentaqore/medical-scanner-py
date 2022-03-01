# medical-scanner-py
Medical inventory management using python

---------------------

Prerequisites:
Install Python
Setup mysql on locahost and port 3306
Create Database with name 'medicalscannar'

---------------------

How To Run Project:

A. Run BackEnd
1. Navitage to /medical-scanner-py/medical-scanner-py folder and open command prompt in it
2. Enter command: Scripts/activate
3. Enter command: pip install -r requirements.txt
4. Enter command: python manage.py makemigrations 
5. Enter command: python manage.py migrate
6. Enter command: python manage.py runserver

This will start back end application on localhost:8000

---------------------

B. run Front end(UI)
1. Navigate to /UI folder and open command promt in it
2. Enter command: python -m http.server 9000

This will start front end on localhost:9000


---------------------

Now open any browser and visit localhost:9000

Application will start.
Register new user on registration page
Insert some items in database from backend(using sql query on database)