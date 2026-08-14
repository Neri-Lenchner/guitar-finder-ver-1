import { JSX, useMemo } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import './Pagination.css';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps): JSX.Element {
    const isMobile = useIsMobile();
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const pageNumbers = useMemo((): (number | '...')[] => {
        if (isMobile) {
            const start = Math.max(1, Math.min(currentPage - 1, totalPages - 3));
            const end = Math.min(totalPages, start + 3);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }

        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages: (number | '...')[] = [1];
        const left = Math.max(2, currentPage - 1);
        const right = Math.min(totalPages - 1, currentPage + 1);

        if (left > 2) pages.push('...');
        for (let i = left; i <= right; i++) pages.push(i);
        if (right < totalPages - 1) pages.push('...');
        pages.push(totalPages);

        return pages;
    }, [isMobile, currentPage, totalPages]);

    return (
        <div className="pagination">
            <span className="pagination-info">Page {currentPage} of {totalPages}</span>
            <ul className="pagination-ul">
                <li>
                    <button
                        className="pagination-btn pagination-btn--nav"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &laquo; Prev
                    </button>
                </li>

                {pageNumbers.map((page, i) =>
                    page === '...' ? (
                        <li key={`ellipsis-${i}`} className="pagination-ellipsis">...</li>
                    ) : (
                        <li key={page}>
                            <button
                                className={`pagination-btn${currentPage === page ? ' pagination-btn--active' : ''}`}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        </li>
                    )
                )}

                <li>
                    <button
                        className="pagination-btn pagination-btn--nav"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next &raquo;
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Pagination;
