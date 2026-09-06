import React from 'react';
import { ChevronRight, ChevronLeft, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollTargetId?: string;
  className?: string;
  showItemCount?: boolean;
  totalItems?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  scrollTargetId,
  className = '',
  showItemCount = false,
  totalItems = 0,
  pageSize = 6
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    
    onPageChange(page);

    // Smooth scroll to container or section
    if (scrollTargetId) {
      const el = document.getElementById(scrollTargetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // Default gentle scroll if no specific ID is provided
    window.scrollTo({
      top: Math.max(0, window.scrollY - 350),
      behavior: 'smooth'
    });
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e4ebe4] ${className}`}>
      
      {/* Items count summary (Optional) */}
      {showItemCount && totalItems > 0 ? (
        <div className="text-xs font-bold text-slate-500">
          عرض <strong className="text-[#001e00] font-black">{startItem} - {endItem}</strong> من أصل <strong className="text-[#14a800] font-black">{totalItems}</strong> عنصر
        </div>
      ) : (
        <div className="text-xs font-bold text-slate-500">
          الصفحة <strong className="text-[#001e00] font-black">{currentPage}</strong> من <strong className="text-slate-700">{totalPages}</strong>
        </div>
      )}

      {/* Navigation Controls */}
      <nav aria-label="تنقل الصفحات" className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Previous Button (RTL: ChevronRight goes backwards or previous) */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="الانتقال إلى الصفحة السابقة"
          className="px-3.5 py-2 min-h-[44px] rounded-xl border border-[#e4ebe4] text-xs font-bold text-slate-700 hover:bg-[#f2f7f2] hover:text-[#14a800] hover:border-[#14a800]/40 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14a800]"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <span>السابق</span>
        </button>

        {/* Numbered Buttons */}
        <div className="flex items-center gap-1.5">
          {pages.map((p, idx) => {
            if (p === 'ellipsis') {
              return (
                <span key={`ell-${idx}`} className="w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400">
                  <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePageClick(p)}
                aria-label={`الصفحة ${p}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`min-w-[44px] min-h-[44px] px-3 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14a800] ${
                  isCurrent 
                    ? 'bg-[#14a800] text-white shadow-xs font-black' 
                    : 'border border-[#e4ebe4] text-slate-700 hover:bg-[#f2f7f2] hover:text-[#14a800]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="الانتقال إلى الصفحة التالية"
          className="px-3.5 py-2 min-h-[44px] rounded-xl border border-[#e4ebe4] text-xs font-bold text-slate-700 hover:bg-[#f2f7f2] hover:text-[#14a800] hover:border-[#14a800]/40 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#14a800]"
        >
          <span>التالي</span>
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
      </nav>

    </div>
  );
};
