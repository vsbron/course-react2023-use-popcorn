import { useState } from "react";
import PropTypes from "prop-types";

// Inline CSS for main container
const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0 16px",
};

// Inline CSS for Stars container
const starContainerStyle = {
  display: "flex",
};

// React library for type validation (rarely used today because of TypeScript)
StarRating.propTypes = {
  maxRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
};

// Component declaration
export default function StarRating({
  maxRating = 5, // Maximus number of stars
  color = "#fcc419", // Color of stars
  size = 48, // Size of the stars and the paragraph text
  className = "", // Optional class name
  messages = [], // Array with values that can replace the default numbers in pargraph
  defaultRating = 0, // Rating by default
  onSetRating, // Rate click handler, allows to receive the data outside of the component
}) {
  // States for the chosen rating and hovered rating
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  // Handler for movie rate click
  function handleRating(rating) {
    // Set the inner state with given rating
    setRating(rating);
    // Set the outer (consumer's) state with given rating
    onSetRating(rating);
  }

  // Inline CSS for the paragraph element
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {/* Creating array with the length of maxRating */}
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i} // Unique ID for each Star
            onRate={() => handleRating(i + 1)} // Click handler
            full={tempRating ? i < tempRating : i < rating} // Checks if star is on hover state, if so, colors all the stars that hovered, if not colors all the stars that are rated
            onHoverIn={() => setTempRating(i + 1)} // On hover handler
            onHoverOut={() => setTempRating(0)} // On hover-end handler
            color={color} // Color of the star
            size={size} // Size of the star
          />
        ))}
      </div>
      {/* Paragraph with number / text for rating */}
      <p style={textStyle}>
        {/* If messages were passed, checked whether their amount is equal to maximum stars number */}
        {messages.length === maxRating
          ? // If they match, displays needed word on hover (if hover), or when rated
            messages[tempRating ? tempRating - 1 : rating - 1]
          : // If they don't match, displays the number
            tempRating || rating || ""}
      </p>
    </div>
  );
}

// Star component that receives, click handler, hover handlers, color, size and whether it should be colored
function Star({ onRate, full, onHoverIn, onHoverOut, color, size }) {
  // Inline CSS for the star icon
  const starStyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };
  return (
    // Each star is a span with SVG that has 3 handlers - Click, Mouse enter, Mouse leave
    <span
      role="button"
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {/* If star has FULL variable, shows the full star, if not, shows the one with only border */}
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
