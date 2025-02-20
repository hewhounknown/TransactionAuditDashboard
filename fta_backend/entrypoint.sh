#!/bin/sh

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

# echo "Sample data seeding..."
# python manage.py seed_data

echo "Starting fta-backend server..."
gunicorn --config gunicorn_conf.py core.wsgi:application