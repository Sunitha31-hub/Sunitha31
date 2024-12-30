import { useState, useEffect } from 'react';  // Only import what's necessary

import Header from './components/Header';
import Navbar from './components/Navbar';
import NewsSearch from './components/NewsSearch';
import NewsList from './components/NewsList';
import newsService from './services/newsService';
import './App.css';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      const news = await newsService.fetchNews(category, keyword);
      setArticles(news);
    };
    fetchArticles();
  }, [category, keyword]);

  const handleCategoryChange = (category) => {
    setCategory(category);
  };

  const handleSearch = (query) => {
    setKeyword(query);
  };

  return (
    <div className="App">
      <Header />
      <Navbar onCategoryChange={handleCategoryChange} />
      <NewsSearch onSearch={handleSearch} />
      <NewsList articles={articles} />
    </div>
  );
};

export default App;

