from http.server import BaseHTTPRequestHandler
import json

def handler(event, context):
    if event['httpMethod'] == 'GET':
        return {
            'statusCode': 200,
            'body': json.dumps('Hello from LINE Bot!')
        }
    elif event['httpMethod'] == 'POST':
        # Here you would handle the LINE webhook
        return {
            'statusCode': 200,
            'body': json.dumps('OK')
        }
    else:
        return {
            'statusCode': 405,
            'body': json.dumps('Method Not Allowed')
        }
