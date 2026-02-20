// Dashboard/Pagination.jsx
import React from "react";

export default function Pagination({ page, setPage, totalResults, limit }) {
  const totalPages = Math.ceil(totalResults / limit);
  return (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
