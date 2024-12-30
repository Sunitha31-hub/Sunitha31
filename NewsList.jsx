import PropTypes from 'prop-types';  // Import PropTypes
import NewsCard from './NewsCard';

const NewsList = ({ articles }) => {
  return (
    <div className="news-list">
      {articles.map((article, index) => (
        <NewsCard key={index} article={article} />
      ))}
    </div>
  );
};

// Add PropTypes validation for 'articles' prop
NewsList.propTypes = {
  articles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default NewsList;
