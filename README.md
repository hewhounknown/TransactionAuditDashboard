# Financial Transaction Auditing

## Project Setup and Run with Docker

clone this repo
```git
git clone https://github.com/hewhounknown/TransactionAuditDashboard
```

Firstly, copy `.env.example` file and replace with your actual configured values
```
cp .env.example .env
```

Build and start backend services in Docker
```
docker compose up -d --build
```

Seed sample data and create superuser
```
docker compose exec backend python manage.py seed_data
```

Or, you can uncomment `# python manage.py seed_data` manually in `./fta_backend/entrypoint.sh` file **before building backend services in Docker**
```sh
#fta_backend/entrypoint.sh
1 #!/bin/sh
...
7 echo "Sample data seeding..."
8 python manage.py seed_data
```
**Don't forget to comment this again** after backend services is up in Docker

After backend services is up in Docker, open `fta_frontend/index.html` file with Live Server


## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`    | `/api/transactions/` | Get all transactions |
| `POST`   | `/api/transactions/` | Create a new transaction |
| `GET`    | `/api/transactions/{code}` | Get transaction by code |
| `PUT`    | `/api/transactions/{code}` | Update transaction details |
| `DELETE` | `/api/transactions/{code}` | Delete a transaction |
| `GET`    | `/api/transactions/?page={number}` | Get paginated transactions |
| `GET`    | `/api/transactions/?status={status}` | filter transactions for status |
| `GET`    |  `/api/transactions/?search={merchant}`  |  search transactions by merchant |
| `PUT`    | `/api/transactions/{id}/approve`   | set completed status in specific transaction |
| `PUT`    | `/api/transactions/{id}/flag`    | change transaction flag |
|  `GET`   | `/api/transactions/summary-per-status/` | display summary per status |
|  `GET`   | `/api/transactions/summary-per-merchant/` | display summary per merchant |

## Panel Design

- Dashboard(index page):
    - display total summary per status (`completed, pending, failed`) in status cards
    - compare total amounts for each status using pie chart
    - display transactions overview including `total amounts, transactions count` per merchant using column chart

- Transactions Table:
    - display transaction data (`merchant, amount, status, flag, approved by`) in paginated table
    - have `approve` action button to approve pending transactions
    - have  `flag` button to change flag state
    - filter transaction table by choosing status
    - search transactions by merchant name in search box