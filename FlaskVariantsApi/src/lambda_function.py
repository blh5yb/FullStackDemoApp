from serverless_wsgi import handle_request
from app import app

def handler(event, context):
    # my_app = create_app('config.BaseConfig')
    return handle_request(app, event, context)
