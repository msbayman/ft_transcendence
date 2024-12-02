#!/bin/bash

python3 -m venv venv 
source venv/bin/activate
python3 -m pip install Django
pip install -r requirements.txt
python3 manage.py runserver