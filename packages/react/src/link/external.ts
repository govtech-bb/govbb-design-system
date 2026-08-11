import type { AnchorHTMLAttributes } from 'react';

export interface ExternalLinkOptions {
  /** Open the destination in a new tab with safe relationship attributes. */
  external?: boolean;
}

type NativeExternalProps = Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'rel' | 'target'
>;

export function resolveExternalLinkProps({
  external,
  rel,
  target,
}: ExternalLinkOptions & NativeExternalProps): NativeExternalProps {
  return {
    target: target ?? (external ? '_blank' : undefined),
    rel: rel ?? (external ? 'noopener noreferrer' : undefined),
  };
}
