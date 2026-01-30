import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Orientation = 'horizontal' | 'vertical';

type Options = {
  orientation: Orientation;
  activeIndex: number;
  /** If your tabs have spacing/padding, you can nudge the rail. */
  insetStart?: number; // px offset from left (horizontal) or top (vertical)
  /** Height of the indicator for horizontal, width of the rail for vertical. */
  thickness?: number; // default 2
  /** Animate with CSS transitions. */
  durationMs?: number; // default 200
  easing?: string; // default '.2,.8,.2,1'
};

type UseTabIndicator = {
  /** Attach to the strip that contains the tabs (position:relative). */
  containerRef: React.RefObject<HTMLElement>;
  /** Attach to each tab element by its index: ref={getTabRef(i)} */
  getTabRef: (index: number) => (el: HTMLElement | null) => void;
  /** Spread onto your indicator element (Box, span, etc.). */
  indicatorProps: {
    style: React.CSSProperties;
    'aria-hidden': true;
  };
};

export function useTabIndicator(opts: Options): UseTabIndicator {
  const {
    orientation,
    activeIndex,
    insetStart = 0,
    thickness = 2,
    durationMs = 200,
    easing = '.2,.8,.2,1',
  } = opts;

  const containerRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLElement | null)[]>([]);
  const [pos, setPos] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const getTabRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      tabRefs.current[index] = el;
    },
    []
  );

  const measure = useCallback(() => {
    const container = containerRef.current;
    const target = tabRefs.current[activeIndex];
    if (!container || !target) return;

    const cr = container.getBoundingClientRect();
    const tr = target.getBoundingClientRect();

    // Account for scroll inside the container
    const scrollLeft = (container as HTMLElement).scrollLeft || 0;
    const scrollTop = (container as HTMLElement).scrollTop || 0;

    const x = tr.left - cr.left + scrollLeft;
    const y = tr.top - cr.top + scrollTop;

    setPos({
      x: Math.max(0, x + (orientation === 'horizontal' ? 0 : insetStart)),
      y: Math.max(0, y + (orientation === 'vertical' ? 0 : insetStart)),
      w: tr.width,
      h: tr.height,
    });
  }, [activeIndex, orientation, insetStart]);

  // Re-measure on layout changes
  useEffect(() => {
    measure();
  }, [measure, activeIndex]);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    const ro = new ResizeObserver(measure);
    ro.observe(c);
    tabRefs.current.forEach((el) => el && ro.observe(el));

    const mo = new MutationObserver(measure);
    mo.observe(c, { childList: true, subtree: true, attributes: true });

    // Handle font-load layout shifts
    if ((document as any).fonts?.addEventListener) {
      (document as any).fonts.addEventListener('loadingdone', measure);
    }

    const onScroll = () => measure();
    c.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      mo.disconnect();
      c.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if ((document as any).fonts?.removeEventListener) {
        (document as any).fonts.removeEventListener('loadingdone', measure);
      }
    };
  }, [measure]);

  const indicatorProps = useMemo(() => {
    const base: React.CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      transform:
        orientation === 'horizontal'
          ? `translate(${pos.x}px, ${pos.y + pos.h - (thickness ?? 2)}px)`
          : `translate(${pos.x}px, ${pos.y}px)`,
      width: orientation === 'horizontal' ? `${pos.w}px` : `${thickness}px`,
      height: orientation === 'horizontal' ? `${thickness}px` : `${pos.h}px`,
      transition: `transform ${durationMs}ms cubic-bezier(${easing}), width ${durationMs}ms cubic-bezier(${easing}), height ${durationMs}ms cubic-bezier(${easing})`,
      willChange: 'transform,width,height',
    };

    return { style: base, 'aria-hidden': true as const };
  }, [pos, orientation, thickness, durationMs, easing]);

  return { containerRef, getTabRef, indicatorProps };
}
