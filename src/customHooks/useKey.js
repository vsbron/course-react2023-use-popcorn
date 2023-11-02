import { useEffect } from "react";

export function useKey(key, action) {
  // useEffect that adds event listener for a Escape key press once the component is mounted
  useEffect(() => {
    // Creating callback function separately (so we can remove the event listener later)
    function callback(e) {
      e.code.toLowerCase() === key.toLowerCase() && action();
    }

    // Adding the event listener on keydown effect
    document.addEventListener("keydown", callback);

    // The Cleanup function
    return function () {
      document.removeEventListener("keydown", callback); // Removing the event listener
    };
  }, [key, action]);
}
