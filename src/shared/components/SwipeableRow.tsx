import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface SwipeAction {
  icon: ReactNode;
  color: string;
  onClick: () => void;
  ariaLabel: string;
}

interface SwipeableRowProps {
  children: ReactNode;
  actions: SwipeAction[];
  className?: string;
}

const ACTION_WIDTH = 72;
const SWIPE_THRESHOLD = 0.4;

export function SwipeableRow({ children, actions, className }: SwipeableRowProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const baseX = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const maxSwipe = actions.length * ACTION_WIDTH;

  const handleAction = useCallback((onClick: () => void) => {
    setTranslateX(0);
    setIsOpen(false);
    onClick();
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    let dragging = false;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      baseX.current = isOpen ? -maxSwipe : 0;
      dragging = true;
      setIsDragging(true);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      const deltaX = e.touches[0].clientX - touchStartX.current;
      const deltaY = e.touches[0].clientY - touchStartY.current;

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        dragging = false;
        setIsDragging(false);
        return;
      }

      e.preventDefault();
      const newX = baseX.current + deltaX;
      setTranslateX(Math.min(0, Math.max(-maxSwipe, newX)));
    };

    const onTouchEnd = () => {
      if (!dragging) return;
      dragging = false;
      setIsDragging(false);

      setTranslateX(prev => {
        const movement = Math.abs(prev - baseX.current);

        if (isOpen && movement < 5) {
          setIsOpen(false);
          return 0;
        }

        if (Math.abs(prev) > maxSwipe * SWIPE_THRESHOLD) {
          setIsOpen(true);
          return -maxSwipe;
        } else {
          setIsOpen(false);
          return 0;
        }
      });
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [isOpen, maxSwipe]);

  return (
    <div className="swipe-row position-relative overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="swipe-actions position-absolute top-0 end-0 h-100 d-flex">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleAction(action.onClick)}
            aria-label={action.ariaLabel}
            className="border-0 d-flex align-items-center justify-content-center text-white flex-column gap-1 fw-bold"
            style={{ width: ACTION_WIDTH, backgroundColor: action.color, fontSize: '10px' }}
          >
            {action.icon}
          </button>
        ))}
      </div>

      <div
        ref={contentRef}
        className={`swipe-content position-relative ${className || ''}`}
        style={{
          transform: `translate3d(${translateX}px, 0, 0)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
          backgroundColor: '#1C1C1E',
        }}
      >
        {children}
      </div>
    </div>
  );
}
