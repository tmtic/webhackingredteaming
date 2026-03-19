import { ApolloServer, gql } from 'apollo-server-express';

const typeDefs = gql`
  type Principal { id: ID!, username: String!, role: String!, clearance: Int! }
  type Query { 
    principal(id: ID!): Principal
    searchDiscovery(query: String!): [Principal]
  }
`;

const resolvers = {
  Query: {
    principal: () => ({ id: 1, username: "thiago", role: "Lead Auditor", clearance: 5 }),
    searchDiscovery: () => [
        { id: 1, username: "thiago", role: "Lead Auditor", clearance: 5 },
        { id: 2, username: "tony", role: "CEO", clearance: 10 }
    ]
  }
};

export const startGraphQL = async (app) => {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    introspection: true, // M1-L04: Vulnerável a introspecção
    playground: true 
  });
  await server.start();
  server.applyMiddleware({ app, path: '/api/v1/governance/query' });
};
