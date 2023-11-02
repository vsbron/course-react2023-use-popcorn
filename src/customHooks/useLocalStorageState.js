import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  // Initializing state and passing a callback function into it instead of the value that will be executed only once on the initial render
  const [value, setValue] = useState(() => {
    // Here, we're getting the watched movie list from the local storage
    const storedValue = localStorage.getItem(key);

    // And return the parsed JSON object (return MUST be included)
    return storedValue ? JSON.parse(storedValue) : initialState;
  }); // This callback funxtion needs to be pure function and cannot receive any arguments

  // useEffect that stores a new watched array to the local storage each time the list is updated
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]); // The current watched movie list in the dependency array

  return [value, setValue];
}
