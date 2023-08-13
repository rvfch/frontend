import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, from, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { gqlAuthMiddleware } from '../../../store/middleware/gql-auth.middleware';
import { createClient } from 'graphql-ws';
import { store } from '../../../store';

type Props = {
  children: React.ReactNode;
};

export const GraphQlProvider: React.FC<Props> = ({ children }): JSX.Element => {
  const { tenantId, accessToken } = store.getState().auth;

  const wsLink = new GraphQLWsLink(
    createClient({
      url: 'ws://localhost:3001/graphql',
      connectionParams: {
        'x-api-key': tenantId,
        authorization: `Bearer ${accessToken}`,
      },
    }),
  );

  const httpLink = new HttpLink({
    uri: 'http://localhost:3001/graphql',
    credentials: 'include',
  });

  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  const client = new ApolloClient({
    link: from([gqlAuthMiddleware, link]),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
