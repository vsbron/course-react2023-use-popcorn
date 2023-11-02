import { useEffect, useRef } from "react";

// Search component that displays the searchbar
export default function Search({ query, setQuery }) {
  // Creating a reference for input field using useRef hook
  const inputEl = useRef(null);

  // Putting focus on the search field on component mount
  useEffect(() => {
    // Creating callback function
    function callback(e) {
      // if current focus is on search field - do nothing
      if (document.activeElement === inputEl.current) return;

      // If pressed key is Enter, then put the focus and reset the query
      if (e.code === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    }

    // Add the event listener
    document.addEventListener("keydown", callback);

    // Remove the eventlistener when component unmounts
    return () => document.removeEventListener("keydown", callback);
  }, [setQuery]);

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
