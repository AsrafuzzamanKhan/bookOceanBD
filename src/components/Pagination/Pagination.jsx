
import { useState } from 'react';
const Pagination = () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const itemsPerPage = 3; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the start and end indices for the slice
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the data array based on the current page
    const slicedData = data.slice(startIndex, endIndex);

    // Function to handle page navigation
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };
    return (
        <div>
            <h1>Data Slicing in React</h1>
            <ul>
                {slicedData.map(item => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            <div>
                <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous Page
                </button>
                <button onClick={nextPage} disabled={endIndex >= data.length}>
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default Pagination;


