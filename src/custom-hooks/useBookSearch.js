import { useEffect, useState } from 'react';
import axios from "axios";

function useBookSearch(query, pageNumber) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;
        axios({
            method: "GET",
            url: "https://openlibrary.org/search.json",
            params: { q: query || '', page: pageNumber || 1 },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            let { docs } = res.data
            let { length } = docs
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...docs.map((book) => ({
                    title: book.title,
                    author: book.author_name ? book.author_name[0] : "Unknown",
                    firstPublishYear: book.first_publish_year ?? "Unknown",
                })
                )])]
            });
            setHasMore(length > 0);
            setLoading(false);
        }).catch(e => {
            setError(true);
            setLoading(false);
            if (axios.isCancel(e)) return
        })
        return () => cancel()
    }, [query, pageNumber])
    return { loading, error, books, hasMore }
}

export default useBookSearch;
