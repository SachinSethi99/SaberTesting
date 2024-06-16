"use client"; // Ensures that this file is treated as a client-side component

// Importing necessary hooks and libraries
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  // State to store articles fetched from the database
  const [articles, setArticles] = useState([]);

  // useEffect hook to fetch articles when the component mounts
  useEffect(() => {
    fetchArticles();
  }, []);

  // Function to fetch articles from the API
  const fetchArticles = async () => {
    const res = await axios.get('/api/articles');
    setArticles(res.data);
  };

  // Function to delete an article by its id
  const deleteArticle = async (id) => {
    await axios.delete(`/api/articles?id=${id}`);
    fetchArticles(); // Fetch articles again to update the list after deletion
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
