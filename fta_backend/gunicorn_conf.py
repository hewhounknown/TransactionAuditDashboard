import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
threads = 2
timeout = 30
keepalive = 5
loglevel = 'info'
accesslog = '-'
errorlog = '-'