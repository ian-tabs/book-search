import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "../../custom-hooks/useBookSearch";
import { Input, Table, Loader } from "semantic-ui-react";
import DynamicTableRowCells from "../../components/DynamicTableRowCells";
import { debounce } from "lodash";
import './InfiniteTable.css';

function InfiniteTable() {

  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef();

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

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
    }, 500), []
  ).current;

  function handleInputChange(e) {
    debouncedSearch(e.target.value, 1);
  }

  return (
    <>
      <Input
        type="text"
        className="search-bar"
        onChange={handleInputChange}
        placeholder="Search books"
      />
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Author</Table.HeaderCell>
            <Table.HeaderCell>Publish Year</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {books.map((book, index) => {
            const { title, author, firstPublishYear } = book;
            const refVariable = (books.length === index + 1) ? lastBookElementRef : null;
            return (<DynamicTableRowCells
              key={index + 1}
              refVariable={refVariable}
              rows={{
                rowNumber: index + 1,
                title: title,
                author: author,
                firstPublishYear: firstPublishYear
              }} />)
          })}
          {!loading && !error && books.length === 0 && (
            <Table.Row>
              <Table.Cell>No results found</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {loading && <Loader active inline='centered' />}
      {!loading && !hasMore && <div>No more results to show.</div>}
      {error && <div>Error</div>}
    </>
  );
}

export default InfiniteTable;