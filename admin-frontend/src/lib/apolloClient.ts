import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:3002/graphql", // Replace with your backend URL
    credentials: "include", // if you're using cookies for auth
  }),
  cache: new InMemoryCache(),
});

export default client;
