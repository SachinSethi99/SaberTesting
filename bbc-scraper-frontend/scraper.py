import asyncio
from dotenv import load_dotenv
import os
import aiohttp
from bs4 import BeautifulSoup
import psycopg2
from urllib.parse import urljoin
import logging

# Load environment variables from .env.local file
load_dotenv('.env.local')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Retrieve PostgreSQL connection details from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        DROP TABLE IF EXISTS articles;
        CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            headline TEXT NOT NULL,
            url TEXT NOT NULL,
            UNIQUE (headline, url)
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()

async def fetch(session, url):
    try:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.text()
    except Exception as e:
        logger.error(f"Error fetching {url}: {e}")
        return None

async def scrape_bbc(max_articles=1000):
    base_url = 'https://www.bbc.com'
    visited_urls = set()
    articles = []
    urls_to_visit = [base_url]
    tasks = []

    async with aiohttp.ClientSession() as session:
        while urls_to_visit and len(articles) < max_articles:
            current_url = urls_to_visit.pop(0)
            if current_url in visited_urls:
                continue
            visited_urls.add(current_url)

            task = asyncio.create_task(fetch(session, current_url))
            tasks.append(task)

            if len(tasks) >= 10:  # Control the number of concurrent requests
                responses = await asyncio.gather(*tasks)
                for response in responses:
                    if response is None:
                        continue
                    soup = BeautifulSoup(response, 'html.parser')
                    for article in soup.find_all('a', href=True):
                        article_url = urljoin(base_url, article['href'])
                        if article_url not in visited_urls:
                            headline = article.get_text().strip()
                            if headline and article_url.startswith(base_url) and 'news' in article_url:
                                if headline not in ["More menu", "Search BBC", "Close menu"]:
                                    articles.append((headline, article_url))
                                    if len(articles) >= max_articles:
                                        break
                            urls_to_visit.append(article_url)
                tasks = []

        # Fetch any remaining tasks
        if tasks:
            responses = await asyncio.gather(*tasks)
            for response in responses:
                if response is None:
                    continue
                soup = BeautifulSoup(response, 'html.parser')
                for article in soup.find_all('a', href=True):
                    article_url = urljoin(base_url, article['href'])
                    if article_url not in visited_urls:
                        headline = article.get_text().strip()
                        if headline and article_url.startswith(base_url) and 'news' in article_url:
                            if headline not in ["More menu", "Search BBC", "Close menu"]:
                                articles.append((headline, article_url))
                                if len(articles) >= max_articles:
                                    break
                        urls_to_visit.append(article_url)

    save_articles(articles)
    logger.info("Web scraping complete. Articles saved to database.")

def save_articles(articles):
    conn = get_db_connection()
    cursor = conn.cursor()
    for headline, url in articles:
        cursor.execute('''
            INSERT INTO articles (headline, url) VALUES (%s, %s)
            ON CONFLICT (headline, url) DO NOTHING
        ''', (headline, url))
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == '__main__':
    create_table()
    asyncio.run(scrape_bbc())
