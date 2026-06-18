import pyodbc
import pymssql
import schedule
import time
import os
from dotenv import load_dotenv

load_dotenv()

# Tally ODBC Connection
def get_tally_conn():
    return pyodbc.connect(
        f"DRIVER={{Tally ODBC Driver}};"
        f"Host={os.getenv('TALLY_HOST', 'localhost')};"
        f"Port={os.getenv('TALLY_PORT', '9000')};"
    )

# SQL Server Connection
def get_sql_conn():
    return pymssql.connect(
        server=os.getenv('SQL_SERVER'),
        user=os.getenv('SQL_USER'),
        password=os.getenv('SQL_PASSWORD'),
        database=os.getenv('SQL_DATABASE')
    )

def sync_ledgers():
    try:
        tally = get_tally_conn()
        sql = get_sql_conn()
        t_cur = tally.cursor()
        s_cur = sql.cursor()

        t_cur.execute("SELECT Name, Parent, ClosingBalance FROM Ledger")
        rows = t_cur.fetchall()

        for row in rows:
            s_cur.execute("""
                IF EXISTS (SELECT 1 FROM Ledgers WHERE Name=%s)
                    UPDATE Ledgers SET GroupName=%s, Balance=%s, UpdatedAt=GETDATE() WHERE Name=%s
                ELSE
                    INSERT INTO Ledgers (Name, GroupName, Balance) VALUES (%s, %s, %s)
            """, (row[0], row[1], row[2], row[0], row[0], row[1], row[2]))

        sql.commit()
        print(f"[Ledgers] Synced {len(rows)} records")
        tally.close()
        sql.close()
    except Exception as e:
        print(f"[Ledgers] Error: {e}")

def sync_vouchers():
    try:
        tally = get_tally_conn()
        sql = get_sql_conn()
        t_cur = tally.cursor()
        s_cur = sql.cursor()

        t_cur.execute("SELECT VoucherNumber, Date, VoucherType, Amount, Narration FROM Voucher")
        rows = t_cur.fetchall()

        for row in rows:
            s_cur.execute("""
                IF NOT EXISTS (SELECT 1 FROM Vouchers WHERE VoucherNo=%s)
                    INSERT INTO Vouchers (VoucherNo, Date, Type, Amount, Narration)
                    VALUES (%s, %s, %s, %s, %s)
            """, (row[0], row[0], row[1], row[2], row[3], row[4]))

        sql.commit()
        print(f"[Vouchers] Synced {len(rows)} records")
        tally.close()
        sql.close()
    except Exception as e:
        print(f"[Vouchers] Error: {e}")

def sync_stock_items():
    try:
        tally = get_tally_conn()
        sql = get_sql_conn()
        t_cur = tally.cursor()
        s_cur = sql.cursor()

        t_cur.execute("SELECT Name, Parent, ClosingBalance, ClosingRate FROM StockItem")
        rows = t_cur.fetchall()

        for row in rows:
            s_cur.execute("""
                IF EXISTS (SELECT 1 FROM StockItems WHERE Name=%s)
                    UPDATE StockItems SET GroupName=%s, ClosingQty=%s, Rate=%s, UpdatedAt=GETDATE() WHERE Name=%s
                ELSE
                    INSERT INTO StockItems (Name, GroupName, ClosingQty, Rate) VALUES (%s, %s, %s, %s)
            """, (row[0], row[1], row[2], row[3], row[0], row[0], row[1], row[2], row[3]))

        sql.commit()
        print(f"[StockItems] Synced {len(rows)} records")
        tally.close()
        sql.close()
    except Exception as e:
        print(f"[StockItems] Error: {e}")

def run_all():
    print("Starting full sync...")
    sync_ledgers()
    sync_vouchers()
    sync_stock_items()
    print("Sync complete!")

# Schedule every 30 minutes
schedule.every(30).minutes.do(run_all)

if __name__ == "__main__":
    print("Tally ODBC Sync Service Started")
    run_all()  # Run immediately on start
    while True:
        schedule.run_pending()
        time.sleep(1)
