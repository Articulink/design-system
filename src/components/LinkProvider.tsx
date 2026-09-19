'use client';

import { createContext, useContext } from 'react';

/**
 * Articulink LinkProvider
 *
 * The design system is router-agnostic: components that render internal
 * links (Button, BreadcrumbItem) default to a plain <a> element. Wrap your
 * app once in LinkProvider to make them use your router's link component
 * instead, e.g. next/link in the Next.js apps:
 *
 *   import Link from 'next/link';
 *   import { LinkProvider } from '@articulink/design-system';
 *
 *   <LinkProvider component={Link}>
 *     <App />
 *   </LinkProvider>
 */

export type LinkLikeProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  ref?: React.Ref<HTMLAnchorElement>;
};

export type LinkComponent = React.ComponentType<LinkLikeProps> | 'a';

const LinkContext = createContext<LinkComponent>('a');

export interface LinkProviderProps {
  component: LinkComponent;
  children: React.ReactNode;
}

export function LinkProvider({ component, children }: LinkProviderProps) {
  return <LinkContext.Provider value={component}>{children}</LinkContext.Provider>;
}

/** Returns the link component registered via LinkProvider (or 'a'). */
export function useLinkComponent(): LinkComponent {
  return useContext(LinkContext);
}

export default LinkProvider;
