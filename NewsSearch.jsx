import { useState } from 'react';
import NewsSearch from './NewsSearch'; // Assuming NewsSearch is in the same folder

const App = () => {
  const [articles, setArticles] = useState([]);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=70e11c540c234c6eb03e8a7ca831b406`);
      const data = await response.json();
      setArticles(data.articles); // Assuming API returns an array of articles
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <div>
      <NewsSearch onSearch={handleSearch} />
      <div>
        {articles.map((article, index) => (
          <div key={index}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
