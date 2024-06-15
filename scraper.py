import requests
from bs4 import BeautifulSoup
import psycopg2
from urllib.parse import urljoin

# Replace with your actual PostgreSQL connection details from Vercel
DATABASE_URL = "postgres://yourusername:yourpassword@yourhost:yourport/yourdatabase"

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            headline TEXT NOT NULL,
            url TEXT NOT NULL
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()

def save_article(headline, url):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO articles (headline, url) VALUES (%s, %s)
    ''', (headline, url))
    conn.commit()
    cursor.close()
    conn.close()

def scrape_bbc(max_articles=1000):
    base_url = 'https://www.bbc.com'
    visited_urls = set()
    articles = []
    urls_to_visit = [base_url]

    while urls_to_visit and len(articles) < max_articles:
        current_url = urls_to_visit.pop(0)
        if current_url in visited_urls:
            continue
        visited_urls.add(current_url)

        response = requests.get(current_url)
        soup = BeautifulSoup(response.text, 'html.parser')

        for article in soup.find_all('a', href=True):
            article_url = urljoin(base_url, article['href'])
            if article_url not in visited_urls:
                headline = article.get_text().strip()
                if headline and article_url.startswith(base_url):
                    articles.append((headline, article_url))
                    save_article(headline, article_url)
                    if len(articles) >= max_articles:
                        break
                urls_to_visit.append(article_url)

if __name__ == '__main__':
    create_table()
    scrape_bbc()
