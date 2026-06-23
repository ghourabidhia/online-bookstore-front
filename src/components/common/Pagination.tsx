interface Props {
  currentPage: number; // 0-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Returns page indices and 'ellipsis' markers for a windowed pagination bar. */
function buildRange(current: number, total: number): (number | 'ellipsis')[] {
  const delta = 2;
  const range: (number | 'ellipsis')[] = [];
  let prev = -1;

  for (let i = 0; i < total; i++) {
    const nearEdge = i === 0 || i === total - 1;
    const nearCurrent = Math.abs(i - current) <= delta;

    if (nearEdge || nearCurrent) {
      if (prev !== -1 && i - prev > 1) range.push('ellipsis');
      range.push(i);
      prev = i;
    }
  }

  return range;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const range = buildRange(currentPage, totalPages);

  return (
    <nav aria-label="Book pagination">
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            &laquo;
          </button>
        </li>

        {range.map((item, idx) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${idx}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={item} className={`page-item ${item === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(item)}>
                {item + 1}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}
