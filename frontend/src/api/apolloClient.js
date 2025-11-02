import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Configurar el link HTTP
const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

// Configurar el link de autenticación
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Configurar manejo de errores
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Code: ${extensions?.code}, Path: ${path}`);
      
      // Manejar error de autenticación
      if (extensions?.code === 'UNAUTHENTICATED') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]:`, networkError);
  }
});

// Crear cliente Apollo
const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default apolloClient;