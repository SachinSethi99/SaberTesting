BBC Article Scraper
Description
This project consists of two main components:

Python Scraper: A script that scrapes article headlines and URLs from the BBC website and stores them in a PostgreSQL database.
Next.js Frontend: A web application that displays the scraped articles and allows users to delete articles from the database.
Prerequisites
Python 3.x
Node.js
PostgreSQL

Project Structure
bbc-article-scraper/
  ├── bbc-scraper-frontend/
  │   ├── .next/
  │   ├── node_modules/
  │   ├── public/
  │   └── src/
  │       ├── app/
  │       │   ├── api/
  │       │   │   └── articles/
  │       │   │       └── route.js
  │       │   ├── test/
  │       │   ├── favicon.ico
  │       │   ├── globals.css
  │       │   ├── layout.tsx
  │       │   └── page.js
  │   ├── .env.local
  │   ├── .gitignore
  │   ├── next-env.d.ts
  │   ├── next.config.mjs
  │   ├── package.json
  │   ├── postcss.config.js
  │   ├── postcss.config.mjs
  │   ├── README.md
  │   ├── scraper.py
  │   ├── tailwind.config.js
  │   ├── tailwind.config.ts
  │   ├── tsconfig.json
  │   └── yarn.lock
  └── README.md

Setup
PostgreSQL Database
Ensure you have PostgreSQL installed and running. Create a new database for this project.

Environment Variables
DATABASE_URL:
perl

postgresql://neondb_owner:zwM1N0HrbTVA@ep-winter-truth-a24l7wjg-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
Create .env.local

Directory: bbc-scraper-frontend
Content:
makefile
DATABASE_URL="postgresql://neondb_owner:zwM1N0HrbTVA@ep-winter-truth-a24l7wjg-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

Install Required Packages
Python
Navigate to the project root directory and install the required packages:
pip install requests beautifulsoup4 psycopg2-binary aiohttp tqdm
Run the Scraper
Navigate to the bbc-scraper-frontend directory and run the scraper script to populate the database:
cd bbc-scraper-frontend
python scraper.py

Next.js Frontend
Install Dependencies
Navigate to the bbc-scraper-frontend directory:

cd bbc-scraper-frontend
Install the necessary Node.js packages:

yarn install
Start Development Server
Run the development server:

yarn dev
Open your browser and navigate to http://localhost:3000 to view the application.

Usage
The homepage will display a list of scraped articles.
Each article has a "Delete" button that allows you to remove the article from the database.

Troubleshooting
Ensure the PostgreSQL database is running and accessible.
Check the .env.local file for correct database credentials.
Ensure all dependencies are installed by following the setup steps.