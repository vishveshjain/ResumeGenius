import React from 'react';
import { cn } from '@/lib/utils';

interface KeywordChipProps extends React.HTMLAttributes<HTMLDivElement> {
  keyword: string;
  highlighted?: boolean;
  onClick?: (keyword: string) => void;
  onRemove?: (keyword: string) => void;
  removable?: boolean;
}

const KeywordChip = ({
  keyword,
  highlighted = false,
  onClick,
  onRemove,
  removable = false,
  className,
  ...props
}: KeywordChipProps) => {
  const handleClick = () => {
    if (onClick) onClick(keyword);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove(keyword);
  };

  return (
    <div
      className={cn(
        'inline-flex items-center text-xs font-medium rounded-full px-2.5 py-1 mr-2 mb-2',
        highlighted
          ? 'bg-accent/10 text-accent'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick ? handleClick : undefined}
      {...props}
    >
      {keyword}
      {removable && (
        <button
          type="button"
          className="ml-1.5 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={handleRemove}
          aria-label={`Remove ${keyword}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export { KeywordChip };
