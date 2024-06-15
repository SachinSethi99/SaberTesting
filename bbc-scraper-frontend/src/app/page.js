"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const res = await axios.get('/api/articles');
    setArticles(res.data);
  };

  const deleteArticle = async (id) => {
    await axios.delete(`/api/articles?id=${id}`);
    fetchArticles();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">BBC Articles</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {articles.length > 0 ? (
          <ul className="space-y-4">
            {articles.map((article) => (
              <li key={article.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 hover:text-gray-900">{article.headline}</h2>
                  <a href={article.url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    {article.url}
                  </a>
                </div>
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No articles found.</p>
        )}
      </div>
    </div>
  );
}
