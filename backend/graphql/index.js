import { makeExecutableSchema } from '@graphql-tools/schema';
import { usuarioTypeDefs } from './schemas/usuario.schema.js';
import { productoTypeDefs } from './schemas/producto.schema.js';
import { usuarioResolvers } from './resolvers/usuario.resolver.js';
import { productoResolvers } from './resolvers/producto.resolver.js';
import { gql } from 'apollo-server-express';

// TypeDef base para unir todos los schemas
const baseTypeDef = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

// Combinar todos los typeDefs
const typeDefs = [
    baseTypeDef,
    usuarioTypeDefs,
    productoTypeDefs
];

// Combinar todos los resolvers
const resolvers = {
    Query: {
        ...usuarioResolvers.Query,
        ...productoResolvers.Query
    },
    Mutation: {
        ...usuarioResolvers.Mutation,
        ...productoResolvers.Mutation
    }
};

// Crear schema ejecutable
export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});