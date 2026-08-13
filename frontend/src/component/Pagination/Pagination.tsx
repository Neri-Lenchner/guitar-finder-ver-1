import { JSX } from 'react';
import './Pagination.css';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps): JSX.Element {
    const pages = Math.ceil(totalItems / itemsPerPage) || 1;
    const pageNumbers: number[] = [];
    for (let i = 1; i <= pages; i++) pageNumbers.push(i);

    return (
        <div className="pagination">
            <ul className="pagination-ul">
                {pageNumbers.map(page => (
                    <li key={page}>
                        <button
                            className={`pagination-btn${currentPage === page ? ' pagination-btn--active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Pagination;
