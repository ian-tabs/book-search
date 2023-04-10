import { useEffect, useState } from 'react';
import axios from "axios";

function useGoogleBooksApi(query, pageNumber) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState({});
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks({})
    }, [query])

    useEffect(() => {
        setLoading(true);
        setError(false);
        const maxResults = 40;
        const startIndex = (pageNumber - 1) * maxResults;
        let cancel;
        axios({
            method: "GET",
            url: "https://www.googleapis.com/books/v1/volumes",
            params: {
                q: query || '',
                filter: `ebooks`,
                key: process.env.REACT_APP_GOOGLE_BOOKS_API_KEY,
                startIndex: startIndex,
                maxResults: maxResults
            },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(res => {
            let { items } = res.data;
            console.log(res.data);
            if (items !== undefined) {
                setBooks(prevBooks => {
                    const filteredBooks = items.filter((book) => {
                        if (book.saleInfo.saleability === "NOT_FOR_SALE") return false;
                        return true
                    });

                    const parsedBooks = filteredBooks.reduce((acc, book) => {
                        let { volumeInfo, saleInfo, id } = book;
                        let { listPrice } = saleInfo;
                        acc[id] = {
                            title: volumeInfo.title,
                            authors: volumeInfo.authors || [],
                            publishedDate: volumeInfo.publishedDate || undefined,
                            averageRating: volumeInfo.averageRating || undefined,
                            publisher: volumeInfo.publisher || undefined,
                            pageCount: volumeInfo.pageCount || undefined,
                            thumbnail: volumeInfo.imageLinks.thumbnail || undefined,
                            description: volumeInfo.description || undefined,
                            categories: volumeInfo.categories || [],
                            link: volumeInfo.canonicalVolumeLink || undefined,
                            amount: listPrice ? `${listPrice.amount}` : undefined,
                            currencyCode: listPrice ? `${listPrice.currencyCode}` : undefined,
                        }
                        return acc
                    }, {});

                    return {
                        ...prevBooks,
                        ...parsedBooks
                    }
                })
            }
            setHasMore(items !== undefined);
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

export default useGoogleBooksApi;

