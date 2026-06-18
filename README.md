# Tally to SQL Mobile App

A mobile application that connects **Tally ERP** to **SQL Server** using **ODBC** method (no TDL required).

## Architecture

```
Tally ERP → ODBC Driver → SQL Server → REST API → Mobile App
```

## Project Structure

```
tally-sql-mobile-app/
├── sync-service/
│   ├── tally_sync.py       ← ODBC to SQL sync service
│   ├── api.py              ← REST API (Flask)
│   ├── requirements.txt    ← Python dependencies
│   └── .env.example        ← Sample environment config
├── database/
│   └── schema.sql          ← SQL Server table schema
├── mobile-app/
│   └── TallyMobileApp/     ← React Native mobile app
└── README.md
```

## Requirements

- Tally ERP 9 or TallyPrime (with ODBC enabled on port 9000)
- SQL Server or MySQL
- Python 3.8+
- Node.js 16+ (for mobile app)
- React Native CLI

## Setup Instructions

### 1. Enable Tally ODBC
- Open Tally → F12 Configure → Advanced Configuration
- Enable ODBC Server → Port: 9000

### 2. Configure ODBC on Windows
- Control Panel → ODBC Data Sources (64-bit)
- Add System DSN → Tally ODBC Driver
- Host: localhost, Port: 9000

### 3. Setup Sync Service
```bash
cd sync-service
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your SQL credentials
python tally_sync.py
```

### 4. Start REST API
```bash
cd sync-service
python api.py
```

### 5. Run Mobile App
```bash
cd mobile-app/TallyMobileApp
npm install
npx react-native run-android
```

## Tally ODBC Tables Available

| Table | Description |
|-------|-------------|
| Ledger | All ledger accounts |
| Voucher | All transactions |
| Stock Item | Inventory items |
| Group | Account groups |
| Company | Company details |

## Author
- GitHub: [asuganya77](https://github.com/asuganya77)
