#!/bin/sh

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Starting fta-backend server..."
gunicorn --config gunicorn_conf.py core.wsgi:application