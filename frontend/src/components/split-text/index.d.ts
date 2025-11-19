import React from "react";

export type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: string;
  from?: { opacity: number; y: number };
  to?: { opacity: number; y: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties["textAlign"];
  tag?: string;
  onLetterAnimationComplete?: () => void;
};

declare const SplitText: React.FC<SplitTextProps>;
export default SplitText;
