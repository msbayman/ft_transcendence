#!/bin/sh
pip install --upgrade pip
pip install -r /app/requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000