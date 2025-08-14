'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/graphql/client';
import { ReactNode } from 'react';

interface ApolloProviderProps {
  children: ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  return (
    <BaseApolloProvider client={apolloClient}>
      {children}
    </BaseApolloProvider>
  );
}

export default ApolloProvider;