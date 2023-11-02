import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import NavBar from "./NavBar";
import NumResults from "./NumResults";
import Search from "./Search";
import WatchedMovieList from "./WatchedMovieList";
import WatchedSummary from "./WatchedSummary";
import { useMovies } from "./useMovies";

export default function App() {
  const [query, setQuery] = useState(""); // State for the input value
  const [selectedId, setSelectedId] = useState(null); // State for selected movie from search results

  // Custom hook from another file that establishes fetch request and gets the data
  const { movies, isLoading, error } = useMovies(query);

  // Initializing state and passing a callback function into it instead of the value that will be executed only once on the initial render
  const [watched, setWatched] = useState(() => {
    // Here, we're getting the watched movie list from the local storage
    const storedValue = localStorage.getItem("watched");
    // And return the parsed JSON object (return MUST be included)
    return JSON.parse(storedValue);
  }); // This callback funxtion needs to be pure function and cannot receive any arguments

  // Handle function that displays selected movie
  function handleSelectMovie(id) {
    // Checkes whether selected ID is the one in the state, if so, sets it to null
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  // Handle function that clears selected movie
  function handleCloseMovie() {
    setSelectedId(null);
  }

  // Handle function that adds a new movie into watched movies list
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // Handle function that deletes the movie from watched movies list
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect that stores a new watched array to the local storage each time the list is updated
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]); // The current watched movie list in the dependency array

  // Main component tree
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* If data is loading -> Display loader */}
          {isLoading && <Loader />}

          {/* If data is not loading and there's no error -> Display the movie list */}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}

          {/* If there's an error - Display error message */}
          {error && <ErrorMessage error={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watchedMovies={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// Main component with the main grid container
function Main({ children }) {
  return <main className="main">{children}</main>;
}

// Box component that holds a container for the main grid container
function Box({ children }) {
  // State for whether the box is expanded or collapsed
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "-" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
