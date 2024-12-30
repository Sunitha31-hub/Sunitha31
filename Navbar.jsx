import PropTypes from 'prop-types';  // Import PropTypes

const Navbar = ({ onCategoryChange }) => {
  return (
    <nav className="navbar">
      <ul>
        <li onClick={() => onCategoryChange('general')}>Home</li>
        <li onClick={() => onCategoryChange('technology')}>Technology</li>
        <li onClick={() => onCategoryChange('sports')}>Sports</li>
        <li onClick={() => onCategoryChange('business')}>Business</li>
        <li onClick={() => onCategoryChange('health')}>Health</li>
        <li onClick={() => onCategoryChange('entertainment')}>Entertainment</li>
        <li onClick={() => onCategoryChange('science')}>Science</li>
      </ul>
    </nav>
  );
};

// Prop validation for 'onCategoryChange' prop
Navbar.propTypes = {
  onCategoryChange: PropTypes.func.isRequired,  // Ensure onCategoryChange is a required function
};

export default Navbar;
