import { gql } from 'apollo-server-express';

export const productoTypeDefs = gql`
  type Producto {
    id: ID!
    nombre: String!
    descripcion: String!
    precio: Float!
    stock: Int!
    categoria: String!
    activo: Boolean!
    # Ambos formatos de fecha para compatibilidad
    fecha_creacion: String
    fecha_actualizacion: String
    createdAt: String
    updatedAt: String
  }

  type ProductoResponse {
    success: Boolean!
    message: String!
    data: Producto
    cantidad: Int
  }

  type ProductosResponse {
    success: Boolean!
    cantidad: Int!
    data: [Producto!]!
  }

  input FiltrosProducto {
    activo: Boolean
    categoria: String
  }

  input ProductoInput {
    nombre: String!
    descripcion: String!
    precio: Float!
    stock: Int!
    categoria: String!
    activo: Boolean
  }

  input ActualizarProductoInput {
    nombre: String
    descripcion: String
    precio: Float
    stock: Int
    categoria: String
    activo: Boolean
  }

  type Query {
    # Obtener todos los productos (con filtros opcionales)
    productos(filtros: FiltrosProducto): ProductosResponse!
    
    # Obtener producto por ID
    producto(id: ID!): ProductoResponse!
  }

  type Mutation {
    # Crear producto (requiere autenticación)
    crearProducto(input: ProductoInput!): ProductoResponse!
    
    # Actualizar producto (requiere autenticación)
    actualizarProducto(id: ID!, input: ActualizarProductoInput!): ProductoResponse!
    
    # Eliminar producto (requiere autenticación)
    eliminarProducto(id: ID!): ProductoResponse!
  }
`;