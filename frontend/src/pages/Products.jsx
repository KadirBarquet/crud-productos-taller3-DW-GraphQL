import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, Package, Eye, X, Calendar, Tag, DollarSign, Box } from 'lucide-react';

const Products = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [productDetail, setProductDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
        activo: true
    });

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await API.get('/productos');
            setProductos(response.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    // 🆕 Función para obtener detalle del producto
    const fetchProductDetail = async (id) => {
        setLoadingDetail(true);
        setShowDetailModal(true);
        try {
            const response = await API.get(`/productos/${id}`);
            setProductDetail(response.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al cargar detalle del producto');
            setShowDetailModal(false);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock)
        };

        try {
            if (editMode) {
                await API.put(`/productos/${currentProduct.id || currentProduct._id}`, data);
                toast.success('Producto actualizado exitosamente');
            } else {
                await API.post('/productos', data);
                toast.success('Producto creado exitosamente');
            }

            fetchProductos();
            handleCloseModal();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al guardar producto');
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
            try {
                await API.delete(`/productos/${id}`);
                toast.success('Producto eliminado');
                fetchProductos();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Error al eliminar producto');
            }
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

    // 🆕 Cerrar modal de detalles
    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setProductDetail(null);
    };

    // 🆕 Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-EC', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredProductos = productos.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
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

                    {/* Search */}
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
                            {searchTerm ? 'No se encontraron productos con ese criterio' : 'Comienza creando tu primer producto'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProductos.map((producto) => (
                            <div
                                key={producto.id || producto._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition card-hover"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{producto.nombre}</h3>
                                            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                                                {producto.categoria}
                                            </span>
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${producto.activo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {producto.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>

                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">${producto.precio}</p>
                                            <p className="text-sm text-gray-600">Stock: {producto.stock} unidades</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {/* 🆕 Botón Ver Detalles */}
                                        <button
                                            onClick={() => fetchProductDetail(producto.id || producto._id)}
                                            className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm"
                                            title="Ver detalles"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="hidden sm:inline">Detalles</span>
                                        </button>
                                        <button
                                            onClick={() => handleEdit(producto)}
                                            className="flex items-center justify-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition text-sm"
                                            title="Editar"
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span className="hidden sm:inline">Editar</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(producto.id || producto._id)}
                                            className="flex items-center justify-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition text-sm"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="hidden sm:inline">Eliminar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 🆕 Modal de Detalles del Producto */}
                {showDetailModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-overlay">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content">
                            {loadingDetail ? (
                                <div className="flex items-center justify-center p-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : productDetail ? (
                                <div className="p-6">
                                    {/* Header del Modal */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                                {productDetail.nombre}
                                            </h2>
                                            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${productDetail.activo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {productDetail.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleCloseDetailModal}
                                            className="text-gray-400 hover:text-gray-600 transition"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {/* Contenido del Modal */}
                                    <div className="space-y-6">
                                        {/* Descripción */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Descripción</h3>
                                            <p className="text-gray-900">{productDetail.descripcion}</p>
                                        </div>

                                        {/* Información Principal */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Precio */}
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                                    <h3 className="text-sm font-semibold text-gray-700 uppercase">Precio</h3>
                                                </div>
                                                <p className="text-3xl font-bold text-blue-600">
                                                    ${productDetail.precio}
                                                </p>
                                            </div>

                                            {/* Stock */}
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Box className="h-5 w-5 text-green-600" />
                                                    <h3 className="text-sm font-semibold text-gray-700 uppercase">Stock</h3>
                                                </div>
                                                <p className="text-3xl font-bold text-green-600">
                                                    {productDetail.stock} <span className="text-lg">unidades</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Categoría */}
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Tag className="h-5 w-5 text-purple-600" />
                                                <h3 className="text-sm font-semibold text-gray-700 uppercase">Categoría</h3>
                                            </div>
                                            <p className="text-xl font-semibold text-purple-600">
                                                {productDetail.categoria}
                                            </p>
                                        </div>

                                        {/* Fechas (si existen) */}
                                        {(productDetail.createdAt || productDetail.fecha_creacion) && (
                                            <div className="border-t pt-4">
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <Calendar className="h-5 w-5 text-gray-600" />
                                                    <h3 className="text-sm font-semibold text-gray-700 uppercase">Información de Registro</h3>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Fecha de creación:</span>
                                                        <span className="font-semibold text-gray-900">
                                                            {formatDate(productDetail.createdAt || productDetail.fecha_creacion)}
                                                        </span>
                                                    </div>
                                                    {(productDetail.updatedAt || productDetail.fecha_actualizacion) && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600">Última actualización:</span>
                                                            <span className="font-semibold text-gray-900">
                                                                {formatDate(productDetail.updatedAt || productDetail.fecha_actualizacion)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* ID del Producto */}
                                        <div className="bg-gray-100 p-3 rounded-lg">
                                            <p className="text-xs text-gray-600">
                                                ID: <span className="font-mono font-semibold text-gray-900">
                                                    {productDetail.id || productDetail._id}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="flex space-x-3 mt-6 pt-6 border-t">
                                        <button
                                            onClick={() => {
                                                handleCloseDetailModal();
                                                handleEdit(productDetail);
                                            }}
                                            className="flex-1 flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition"
                                        >
                                            <Edit className="h-5 w-5" />
                                            <span>Editar Producto</span>
                                        </button>
                                        <button
                                            onClick={handleCloseDetailModal}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 text-center">
                                    <p className="text-gray-600">No se pudo cargar el producto</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Modal Crear/Editar (Sin cambios) */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-overlay">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    {editMode ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre del Producto
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            required
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: Laptop HP Pavilion"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            name="descripcion"
                                            required
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Descripción detallada del producto"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Precio
                                            </label>
                                            <input
                                                type="number"
                                                name="precio"
                                                required
                                                step="0.01"
                                                min="0"
                                                value={formData.precio}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stock
                                            </label>
                                            <input
                                                type="number"
                                                name="stock"
                                                required
                                                min="0"
                                                value={formData.stock}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Categoría
                                        </label>
                                        <input
                                            type="text"
                                            name="categoria"
                                            required
                                            value={formData.categoria}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: Electrónica, Accesorios, etc."
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="activo"
                                            id="activo"
                                            checked={formData.activo}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                                            Producto activo
                                        </label>
                                    </div>

                                    <div className="flex space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                                        >
                                            {editMode ? 'Actualizar' : 'Crear'} Producto
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

export default Products;