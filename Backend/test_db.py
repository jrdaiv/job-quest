import pymysql
import os
from dotenv import load_dotenv

load_dotenv()
connection = pymysql.connect(
    host='34.102.99.177',
    user='kidx',
    password=os.getenv('DB_PASSWORD'),
    database='job-quest-db',
    port=3306
)
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        print("Connected successfully!")
except Exception as e:
    print(f"Error: {e}")
finally:
    connection.close()