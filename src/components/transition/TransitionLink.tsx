"use client";

import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTransitionContext } from "./TransitionContext";

type TransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement>;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
};

export function TransitionLink({
  href,
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onClick,
  "aria-label": ariaLabel,
}: TransitionLinkProps) {
  const pathname = usePathname();
  const { phase, startTransition } = useTransitionContext();

  const isActive = pathname === href;
  // Belt-and-suspenders guard — TransitionContext also blocks mid-transition calls
  const isBusy = phase !== "idle";

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    onClick?.(e);

    // Already here, or transition in progress — do nothing
    if (isActive || isBusy) return;

    startTransition(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={ariaLabel}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={isActive || isBusy ? true : undefined}
    >
      {children}
    </a>
  );
}
