import React, { useState, useRef, useCallback, useEffect } from "react";
import useGoogleBooksApi from "./custom-hooks/useGoogleBooksApi"
import { Input, Ref } from "semantic-ui-react";
import BooksPreview from "./components/BooksPreview";
import BookDetails from "./components/BookDetails";
import { debounce, isEmpty, keys } from "lodash";
import './BookFinder.css';


function BookSearch() {

  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [currentId, setCurrentId] = useState(null)
  const [bookDetailsVisible, setBookDetailsVisible] = useState(false);
  const observer = useRef();

  const { books, hasMore, loading, error } = useGoogleBooksApi(query, pageNumber);

  const booksKeys = keys(books);

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (inputRef.current.contains(event.target)) {
        setBookDetailsVisible(false)
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const lastBookElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {

      if (entries[0].isIntersecting && hasMore) {

        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    }, { threshold: 1.0, debounce: 500 });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const debouncedSearch = useRef(
    debounce((query, pageNumber) => {
      setQuery(query);
      setPageNumber(pageNumber);
      setBookDetailsVisible(false);
      setCurrentId(null);
    }, 500), []
  ).current;

  function handleInputChange(e) {
    debouncedSearch(e.target.value, 1);
  }

  function handleSeeMore(bookId) {
    setCurrentId(bookId);
    setBookDetailsVisible(true);
    console.log(books[bookId]);
  }

  function handleDetailsCloseButton() {
    setBookDetailsVisible(false);
  }

  return (
    <div>
      <Ref innerRef={inputRef}>
        <Input
          type="text"
          className={`search-bar ${isEmpty(books) ? "empty-page" : loading ? "loading" : ""}`}
          onChange={handleInputChange}
          placeholder="Search books"
        />
      </Ref>

      <div className="container">

        {(!isEmpty(books) && currentId) && <BookDetails
          className="sidebar"
          bookInfo={books[currentId]}
          visible={bookDetailsVisible}
          onClick={() => handleDetailsCloseButton()}
        />}

        <div className="books">
          {booksKeys.map((id, index) => {

            const refVariable = (booksKeys.length === index + 1) ? lastBookElementRef : null;

            return (<BooksPreview
              key={id}
              refVariable={refVariable}
              bookInfo={books[id]}
              seeMore={() => handleSeeMore(id)}
            />)
          })}

          {!loading && !hasMore && !isEmpty(books) && <div className="no-more-results"><h3>No more results to show. Try another book!</h3></div>}

          {error && !isEmpty(books) && <div className="error"><h3>Oops! We encountered an error somewhere. Please try again</h3></div>}

        </div>

      </div>

      {!loading && !error && isEmpty(books) && (
        <div className="no-results">No results found for "{query}", try something else! </div>
      )}

    </div>
  );
}

export default BookSearch;



