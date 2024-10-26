# stock_analytics/celery.py
from __future__ import absolute_import
import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stock_analytics.settings')

app = Celery('stock_analytics')


# Load task modules from all registered Django app configs.
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Define periodic tasks using beat_schedule
app.conf.beat_schedule = {
    'fetch-stock-data-every-minute': {
        'task': 'stocks.tasks.fetch_stock_data',
        'schedule': crontab(minute='*/1'),
        'args': ('AAPL',),  # Replace 'AAPL' with the stock symbol you want to track
    },
}






@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
