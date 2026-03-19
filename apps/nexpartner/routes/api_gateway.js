import { ApolloServer, gql } from 'apollo-server-express';
export default async (app, pool) => {
    const typeDefs = gql`
        type Partner { id: ID, username: String, internal_ext: String, tenant_id: Int }
        type Query { 
            me: Partner 
            searchPartners(tenant_id: Int): [Partner] # M4-L09/L10: Introspection ON
        }
    `;
    const resolvers = {
        Query: {
            me: () => ({ id: 1, username: "thiago", internal_ext: "9921" }),
            searchPartners: async (_, { tenant_id }) => {
                const r = await pool.query('SELECT * FROM users WHERE tenant_id = $1', [tenant_id]);
                return r.rows;
            }
        }
    };
    const server = new ApolloServer({ typeDefs, resolvers, introspection: true });
    await server.start();
    server.applyMiddleware({ app, path: '/api/v1/internal/graphql' });
};
