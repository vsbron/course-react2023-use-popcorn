import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import NavBar from "./NavBar";
import NumResults from "./NumResults";
import Search from "./Search";
import WatchedMovieList from "./WatchedMovieList";
import WatchedSummary from "./WatchedSummary";
import { useMovies } from "./customHooks/useMovies";
import { useLocalStorageState } from "./customHooks/useLocalStorageState";

export default function App() {
  /* STATE */
  const [query, setQuery] = useState(""); // State for the input value
  const [selectedId, setSelectedId] = useState(null); // State for selected movie from search results

  /* CUSTOM HOOKS */
  const { movies, isLoading, error } = useMovies(query); // Custom hook that establishes fetch request and gets the data
  const [watched, setWatched] = useLocalStorageState([], "watched"); // Custom hook that takes care of storing the watched movies inside localStorage and getting it out on mount

  /* HANDLER FUNCTIONS */
  // Handler function that displays selected movie
  function handleSelectMovie(id) {
    // Checkes whether selected ID is the one in the state, if so, sets it to null
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  // Handler function that clears selected movie
  function handleCloseMovie() {
    setSelectedId(null);
  }

  // Handler function that adds a new movie into watched movies list
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // Handler function that deletes the movie from watched movies list
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

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
