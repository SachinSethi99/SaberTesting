'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get('/api/articles').then((response) => {
      setArticles(response.data);
    });
  }, []);

  const deleteArticle = async (id) => {
    await axios.delete('/api/articles', { data: { id } });
    setArticles(articles.filter((article) => article.id !== id));
  };

  return (
    <div>
      <h1>BBC Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.headline}
            </a>
            <button onClick={() => deleteArticle(article.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
