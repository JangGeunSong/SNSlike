import { ApolloClient, InMemoryCache, NormalizedCacheObject } from 'apollo-boost'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const httpLink = createUploadLink({ 
  uri: 'http://localhost:5500/graphql',
  credentials: 'same-origin', 
  fetch, 
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }
})

function create (initialState: any) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const isBrowser = typeof window !== 'undefined'
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(httpLink), // For sending cookies on client side
    cache: new InMemoryCache().restore(initialState || {}),
  })
}

// createUploadLink({ 
//   uri: 'http://localhost:5500/graphql', 
//   credentials: 'same-origin', 
//   fetch
// }), // To send the file promise, I change the link part on client part

// new HttpLink({
//   uri: 'http://localhost:5500/graphql', // Server URL (must be absolute)
//   credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
//   // Use fetch() polyfill on the server
//   fetch: !isBrowser && fetch
// })    
// ==> This method is not valid at apollo-upload-client scalar Upload type. Thus change the method createUploadLink from apollo-upload-client MUST BE!!!

export default function initApollo (initialState: any) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}