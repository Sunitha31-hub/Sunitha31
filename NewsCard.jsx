import PropTypes from 'prop-types';  // Import PropTypes

const NewsCard = ({ article }) => {
  return (
    <div className="news-card">
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
    </div>
  );
};

// Prop validation for 'article' prop
NewsCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default NewsCard;

