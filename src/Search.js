import { useEffect, useRef } from "react";

// Search component that displays the searchbar
export default function Search({ query, setQuery }) {

  // Creating a reference for input field using useRef hook
  const inputEl = useRef(null);

  // Putting focus on the search field on component mount
  useEffect(() => {
    inputEl.current.focus();
  })

  // Returns controlled input element
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl} // Putting the ref to the inputEl variable
    />
  );
}