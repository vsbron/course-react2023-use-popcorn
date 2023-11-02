import { useState, useEffect } from "react";
import { KEY, URL } from "../helper";

// custom hook that recevies the query
export function useMovies(query) {
  const [movies, setMovies] = useState([]); // State variable for searched movie list
  const [isLoading, setIsLoading] = useState(false); // State for loading animation
  const [error, setError] = useState(""); // State for fetching error

  // useEffect hook that fetches the movie search results after initial render
  useEffect(() => {
    // Creating the abort controller (Browser API) to cancel the fetching
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true); // Enable loading animation
        setError(""); // Resetting the error

        // Getting the data from API, passing also the signal from the controller
        const res = await fetch(`${URL}?apikey=${KEY}&s=${query}`, {
          signal: controller.signal,
        });

        // Checking if we got a response, throwing error if not
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        // Converting the received data to json
        const data = await res.json();

        // Checking whether there are movies returned, throwing error if not
        if (data.Response === "False") throw new Error("Movie not found!");

        // Setting the movies state array
        setMovies(data.Search);

        // Catching errors
      } catch (err) {
        // Checking whether error is not caused by cancelling the fetch
        err.name !== "AbortError" && setError(err.message);

        // Code that executes at the end of fetching with either result
      } finally {
        setIsLoading(false); // Disable loading animation
      }
    }

    // If query is empty or has less that 3 characters, set movies and error to empty and return the function
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // Clearing the current selected movie
    // callback();

    // Calling the function
    fetchMovies();

    // The cleanup function - cancelling the fetch
    return function () {
      controller.abort();
    };

    // Passing the query to the dependency array
  }, [query]);

  // Returns the movies, isLoading state and the current error
  return { movies, isLoading, error };
}
