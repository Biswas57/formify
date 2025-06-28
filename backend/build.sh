#!/usr/bin/env bash

# Exit on error
set -o errexit

# Install dependencies from requirements.txt
pip install -r requirements.txt

# Collect static files for production
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate --no-input
