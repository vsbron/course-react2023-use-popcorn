import { useEffect, useRef } from "react";
import { useKey } from "./customHooks/useKey";

// Search component that displays the searchbar
export default function Search({ query, setQuery }) {
  // Creating a reference for input field using useRef hook
  const inputEl = useRef(null);

  // Custom hook
  useKey("Enter", () => {
    // If in the search input fields, don't react
    if (document.activeElement === inputEl.current) return;

    // If pressed key is Enter, then put the focus and reset the query
    inputEl.current.focus();
    setQuery("");
  });

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
