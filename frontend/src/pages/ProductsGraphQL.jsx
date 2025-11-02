import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_PRODUCTOS, 
  GET_PRODUCTO, 
  CREAR_PRODUCTO, 
  ACTUALIZAR_PRODUCTO, 
  ELIMINAR_PRODUCTO 
} from '../graphql/queries';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, Package, Eye, X } from 'lucide-react';

const ProductsGraphQL = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        activo: true
    });

    // Query para obtener productos
    const { data, loading, refetch } = useQuery(GET_PRODUCTOS, {
        variables: { filtros: null }
    });

    // Query para obtener detalle de producto
    const { data: detailData, loading: loadingDetail } = useQuery(GET_PRODUCTO, {
        variables: { id: selectedProductId },
        skip: !selectedProductId,
        onCompleted: () => setShowDetailModal(true)
    });

    // Mutations
    const [crearProducto] = useMutation(CREAR_PRODUCTO, {
        onCompleted: () => {
            toast.success('Producto creado exitosamente');
            refetch();
            handleCloseModal();
        },
        onError: (error) => toast.error(error.message)
    });

    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO, {
        onCompleted: () => {
            toast.success('Producto actualizado exitosamente');
            refetch();
            handleCloseModal();
        },
        onError: (error) => toast.error(error.message)
    });

    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        onCompleted: () => {
            toast.success('Producto eliminado');
            refetch();
        },
        onError: (error) => toast.error(error.message)
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const input = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock),
            categoria: formData.categoria,
            activo: formData.activo
        };

        if (editMode) {
            await actualizarProducto({
                variables: {
                    id: currentProduct.id,
                    input
                }
            });
        } else {
            await crearProducto({ variables: { input } });
        }
    };

    const handleEdit = (producto) => {
        setEditMode(true);
        setCurrentProduct(producto);
        setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock,
            categoria: producto.categoria,
            activo: producto.activo
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            await eliminarProducto({ variables: { id } });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentProduct(null);
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            stock: '',
            categoria: '',
            activo: true
        });
    };

    const handleViewDetail = (id) => {
        setSelectedProductId(id);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedProductId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const productos = data?.productos?.data || [];
    const filteredProductos = productos.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const productDetail = detailData?.producto?.data;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Gestión de Productos (GraphQL)
                            </h1>
                            <p className="text-gray-600 mt-1">{productos.length} productos en total</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Nuevo Producto</span>
                        </button>
                    </div>

                    <div className="mt-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProductos.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'No se encontraron productos' : 'Comienza creando tu primer producto'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProductos.map((producto) => (
                            <div
                                key={producto.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {producto.nombre}
                                            </h3>
                                            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                                                {producto.categoria}
                                            </span>
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                producto.activo
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {producto.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {producto.descripcion}
                                    </p>

                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">
                                                ${producto.precio}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Stock: {producto.stock} unidades
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => handleViewDetail(producto.id)}
                                            className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(producto)}
                                            className="flex items-center justify-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition text-sm"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(producto.id)}
                                            className="flex items-center justify-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition text-sm"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal Detalle */}
                {showDetailModal && productDetail && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        {productDetail.nombre}
                                    </h2>
                                    <button onClick={handleCloseDetailModal}>
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <p><strong>Descripción:</strong> {productDetail.descripcion}</p>
                                    <p><strong>Precio:</strong> ${productDetail.precio}</p>
                                    <p><strong>Stock:</strong> {productDetail.stock}</p>
                                    <p><strong>Categoría:</strong> {productDetail.categoria}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Crear/Editar (similar al original) */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    {editMode ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        name="nombre"
                                        required
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Nombre"
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                    <textarea
                                        name="descripcion"
                                        required
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        placeholder="Descripción"
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="number"
                                            name="precio"
                                            required
                                            step="0.01"
                                            value={formData.precio}
                                            onChange={handleChange}
                                            placeholder="Precio"
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                        <input
                                            type="number"
                                            name="stock"
                                            required
                                            value={formData.stock}
                                            onChange={handleChange}
                                            placeholder="Stock"
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        name="categoria"
                                        required
                                        value={formData.categoria}
                                        onChange={handleChange}
                                        placeholder="Categoría"
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="activo"
                                            checked={formData.activo}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label>Producto activo</label>
                                    </div>
                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 bg-gray-200 px-4 py-2 rounded-lg"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            {editMode ? 'Actualizar' : 'Crear'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsGraphQL;