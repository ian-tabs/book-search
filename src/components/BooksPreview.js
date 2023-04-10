import React from 'react';

function BooksPreview({ refVariable, bookInfo, seeMore }) {

    const { amount, currencyCode, link, thumbnail, title } = bookInfo

    return (
        <>
            {<div ref={refVariable} className='book'>
                <a href={link} target="_blank" rel="noreferrer">
                    <img src={thumbnail} alt={title} />
                </a>
                <h3>{title}</h3>
                <p className="book-preveiew-cost">{(amount && amount > 0) ? `${currencyCode} ${amount}` : "Free"}</p>
                <button className="see-more-button" onClick={seeMore} >More Details</button>
            </ div>}
        </>
    );
}

function memoize(component) {
    return React.memo(component, (prevProps, nextProps) => {
        return (
            prevProps.rowKey === nextProps.rowKey &&
            prevProps.refVariable === nextProps.refVariable &&
            JSON.stringify(prevProps.rows) === JSON.stringify(nextProps.rows)
        );
    });
}

export default memoize(BooksPreview);


