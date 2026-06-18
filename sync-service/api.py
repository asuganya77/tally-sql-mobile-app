from flask import Flask, jsonify, request
from flask_cors import CORS
import pymssql
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db():
    return pymssql.connect(
        server=os.getenv('SQL_SERVER'),
        user=os.getenv('SQL_USER'),
        password=os.getenv('SQL_PASSWORD'),
        database=os.getenv('SQL_DATABASE')
    )

@app.route('/')
def index():
    return jsonify({"status": "Tally SQL API Running", "version": "1.0"})

@app.route('/api/ledgers')
def ledgers():
    conn = get_db()
    cursor = conn.cursor(as_dict=True)
    cursor.execute("SELECT * FROM Ledgers ORDER BY Name")
    return jsonify(cursor.fetchall())

@app.route('/api/vouchers')
def vouchers():
    conn = get_db()
    cursor = conn.cursor(as_dict=True)
    limit = request.args.get('limit', 100)
    cursor.execute(f"SELECT TOP {limit} * FROM Vouchers ORDER BY Date DESC")
    return jsonify(cursor.fetchall())

@app.route('/api/vouchers/<voucher_type>')
def vouchers_by_type(voucher_type):
    conn = get_db()
    cursor = conn.cursor(as_dict=True)
    cursor.execute("SELECT * FROM Vouchers WHERE Type=%s ORDER BY Date DESC", (voucher_type,))
    return jsonify(cursor.fetchall())

@app.route('/api/stock-items')
def stock_items():
    conn = get_db()
    cursor = conn.cursor(as_dict=True)
    cursor.execute("SELECT * FROM StockItems ORDER BY Name")
    return jsonify(cursor.fetchall())

@app.route('/api/sales-summary')
def sales_summary():
    conn = get_db()
    cursor = conn.cursor(as_dict=True)
    cursor.execute("""
        SELECT
            YEAR(Date) as Year,
            MONTH(Date) as Month,
            SUM(Amount) as Total,
            COUNT(*) as Count
        FROM Vouchers
        WHERE Type='Sales'
        GROUP BY YEAR(Date), MONTH(Date)
        ORDER BY Year DESC, Month DESC
    """)
    return jsonify(cursor.fetchall())

@app.route('/api/dashboard')
def dashboard():
    conn = get_db()
    cursor = conn.cursor(as_dict=True)

    cursor.execute("SELECT COUNT(*) as total FROM Ledgers")
    ledger_count = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as total FROM Vouchers WHERE CAST(Date AS DATE) = CAST(GETDATE() AS DATE)")
    today_vouchers = cursor.fetchone()['total']

    cursor.execute("SELECT ISNULL(SUM(Amount),0) as total FROM Vouchers WHERE Type='Sales' AND CAST(Date AS DATE) = CAST(GETDATE() AS DATE)")
    today_sales = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as total FROM StockItems")
    stock_count = cursor.fetchone()['total']

    return jsonify({
        "ledger_count": ledger_count,
        "today_vouchers": today_vouchers,
        "today_sales": today_sales,
        "stock_count": stock_count
    })

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5000))
    print(f"API running at http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
