import React from 'react';



function BookDetails({ bookInfo, visible, onClick }) {

    const { amount, currencyCode, authors, averageRating, categories, description, link, pageCount, publishedDate, publisher, thumbnail, title } = bookInfo

    return (
        <div className={`sidebar ${visible ? "visible" : "hidden"}`}>
            <div className="book-details-nav">
                <button onClick={onClick} className="book-details-nav-close"> X </button>

                <a href={link} className="book-details-textlink"
                    target="_blank" rel="noreferrer">
                    Open on Google Books →
                </a>
            </div>

            <div className="book-details-top">
                <a href={link} className="book-details-imagelink">
                    <img src={thumbnail} alt={title} />
                </a>
                <div>
                    <h3 className="book-details-title">{title}</h3>
                    <p className="book-details-by">by:</p>
                    <ul className="book-details-authors-list">
                        {authors.map((author, index) => {
                            return (<li className="book-details-author" key={`${link + author}`}>{author}</li>)
                        })}
                    </ul>
                    <p className="book-details-cost">{(amount && amount > 0) ? `${currencyCode} ${amount}` : "Free"}</p>
                </div>
            </div>

            <div className="book-details-mid">
                <ul className="book-details-mid-left">
                    <li>{`Publisher: ${publisher}`}</li>
                    <li>{`⭐ ${averageRating ? (averageRating + "/5") : "Not enough ratings"}`}</li>

                </ul>
                <ul className="book-details-mid-right">
                    <li>{`Date: ${publishedDate}`}</li>
                    <li> {`${pageCount} page(s)`}</li>

                </ul>
            </div>

            <div className="book-details-categories">
                <ul className="book-details-categories-list">
                    {categories.map(category => {
                        return (<li className="book-details-category" key={`${link + category}`}>{category}</li>)
                    })}
                </ul>
            </div>

            <div className="book-details-description">
                <p>{description}</p>
            </div>

        </div>
    );
}

export default BookDetails;

