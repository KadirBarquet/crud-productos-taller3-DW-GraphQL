import { gql } from '@apollo/client';

// ============================================
// QUERIES DE USUARIO
// ============================================

export const GET_PERFIL = gql`
  query GetPerfil {
    perfil {
      id
      nombre
      email
      fecha_registro
    }
  }
`;

export const GET_USUARIOS = gql`
  query GetUsuarios {
    usuarios {
      id
      nombre
      email
      fecha_registro
    }
  }
`;

// ============================================
// QUERIES DE PRODUCTO
// ============================================

export const GET_PRODUCTOS = gql`
  query GetProductos($filtros: FiltrosProducto) {
    productos(filtros: $filtros) {
      success
      cantidad
      data {
        id
        nombre
        descripcion
        precio
        stock
        categoria
        activo
        fecha_creacion
        fecha_actualizacion
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_PRODUCTO = gql`
  query GetProducto($id: ID!) {
    producto(id: $id) {
      success
      message
      data {
        id
        nombre
        descripcion
        precio
        stock
        categoria
        activo
        fecha_creacion
        fecha_actualizacion
        createdAt
        updatedAt
      }
    }
  }
`;

// ============================================
// MUTATIONS DE USUARIO
// ============================================

export const REGISTRO = gql`
  mutation Registro($nombre: String!, $email: String!, $password: String!) {
    registro(nombre: $nombre, email: $email, password: $password) {
      success
      message
      usuario {
        id
        nombre
        email
        fecha_registro
      }
      token
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      usuario {
        id
        nombre
        email
        fecha_registro
      }
      token
    }
  }
`;

// ============================================
// MUTATIONS DE PRODUCTO
// ============================================

export const CREAR_PRODUCTO = gql`
  mutation CrearProducto($input: ProductoInput!) {
    crearProducto(input: $input) {
      success
      message
      data {
        id
        nombre
        descripcion
        precio
        stock
        categoria
        activo
        fecha_creacion
        createdAt
      }
    }
  }
`;

export const ACTUALIZAR_PRODUCTO = gql`
  mutation ActualizarProducto($id: ID!, $input: ActualizarProductoInput!) {
    actualizarProducto(id: $id, input: $input) {
      success
      message
      data {
        id
        nombre
        descripcion
        precio
        stock
        categoria
        activo
        fecha_actualizacion
        updatedAt
      }
    }
  }
`;

export const ELIMINAR_PRODUCTO = gql`
  mutation EliminarProducto($id: ID!) {
    eliminarProducto(id: $id) {
      success
      message
      data {
        id
        nombre
      }
    }
  }
`;