import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
const router = express.Router();

export default async (app, pool, auth) => {
    const typeDefs = gql`
        type Asset { id: ID, title: String, classification: String }
        type Query { 
            artifacts(tenant_id: Int): [Asset]
            systemStatus: String
        }
    `;
    const resolvers = {
        Query: {
            artifacts: async (_, { tenant_id }) => {
                const r = await pool.query('SELECT id, title, classification FROM legal_assets WHERE tenant_id = $1', [tenant_id]);
                return r.rows;
            },
            systemStatus: () => "Global Core Nominal"
        }
    };

    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        introspection: true, // M4-L09: Introspection ON
        playground: true 
    });
    await server.start();
    server.applyMiddleware({ app, path: '/api/v1/graphql' }); // M4-L10: Batching support enabled by default
};
