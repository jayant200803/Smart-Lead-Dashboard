import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types';
import { Button } from '../ui';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { currentPage, totalPages, totalItems, itemsPerPage, hasNextPage, hasPrevPage } = meta;

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  const pageNumbers: number[] = [];
  const delta = 1;
  const left = currentPage - delta;
  const right = currentPage + delta;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      pageNumbers.push(i);
    }
  }

  const pages: (number | '...')[] = [];
  let prev: number | undefined;
  for (const page of pageNumbers) {
    if (prev && page - prev > 1) pages.push('...');
    pages.push(page);
    prev = page;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
      <p className="text-sm text-slate-500">
        Showing{' '}
        <span className="font-medium text-slate-300">{from}–{to}</span>{' '}
        of{' '}
        <span className="font-medium text-slate-300">{totalItems}</span> leads
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
        >
          Prev
        </Button>

        <div className="flex items-center gap-1 mx-1">
          {pages.map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-500 text-sm">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150 ${
                  page === currentPage
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
