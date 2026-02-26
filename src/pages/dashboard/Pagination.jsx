import React from "react";
export default function Pagination({ page, setPage, totalResults, limit }) {
  const totalPages = Math.ceil(totalResults / limit);

  if (totalPages <= 1) return null;

  const goPrev = () => setPage(page - 1);
  const goNext = () => setPage(page + 1);

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={goPrev}
        aria-label="Previous page"
      >
        Prev
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={goNext}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}