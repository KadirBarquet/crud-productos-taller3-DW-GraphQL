import { gql } from 'apollo-server-express';

export const usuarioTypeDefs = gql`
  type Usuario {
    id: ID!
    nombre: String!
    email: String!
    fecha_registro: String
  }

  type AuthPayload {
    success: Boolean!
    message: String!
    usuario: Usuario
    token: String
  }

  type Query {
    # Obtener perfil del usuario autenticado
    perfil: Usuario
    
    # Listar todos los usuarios (solo para admin si implementas roles)
    usuarios: [Usuario!]!
  }

  type Mutation {
    # Registro de usuario
    registro(
      nombre: String!
      email: String!
      password: String!
    ): AuthPayload!

    # Login de usuario
    login(
      email: String!
      password: String!
    ): AuthPayload!
  }
`;