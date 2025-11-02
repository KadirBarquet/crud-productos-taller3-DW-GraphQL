import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingCart, BarChart3, Users } from 'lucide-react';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
                        Sistema de Gestión de
                        <span className="text-blue-600"> Productos</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Administra tu inventario de forma eficiente con nuestro sistema CRUD completo.
                        Compatible con PostgreSQL y MongoDB.
                    </p>

                    {isAuthenticated ? (
                        <Link
                            to="/productos"
                            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg hover:shadow-xl"
                        >
                            <Package className="h-6 w-6" />
                            <span>Ir a Productos</span>
                        </Link>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/registro"
                                className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg hover:shadow-xl"
                            >
                                <Users className="h-6 w-6" />
                                <span>Crear Cuenta</span>
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg hover:shadow-xl border-2 border-gray-200"
                            >
                                <span>Iniciar Sesión</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <Package className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión de Productos</h3>
                        <p className="text-gray-600">
                            Crea, edita, elimina y visualiza productos de manera intuitiva y rápida.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Control de Inventario</h3>
                        <p className="text-gray-600">
                            Mantén un control preciso del stock y precios de tus productos.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <BarChart3 className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Database</h3>
                        <p className="text-gray-600">
                            Compatible con PostgreSQL y MongoDB. Cambia entre bases de datos fácilmente.
                        </p>
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="mt-20 bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Tecnologías Utilizadas
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="bg-blue-50 rounded-lg p-4 mb-2">
                                <p className="text-2xl font-bold text-blue-600">React</p>
                            </div>
                            <p className="text-sm text-gray-600">Frontend</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-50 rounded-lg p-4 mb-2">
                                <p className="text-2xl font-bold text-green-600">Node.js</p>
                            </div>
                            <p className="text-sm text-gray-600">Backend</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-blue-50 rounded-lg p-4 mb-2">
                                <p className="text-2xl font-bold text-blue-700">PostgreSQL</p>
                            </div>
                            <p className="text-sm text-gray-600">Base de Datos</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-50 rounded-lg p-4 mb-2">
                                <p className="text-2xl font-bold text-green-700">MongoDB</p>
                            </div>
                            <p className="text-sm text-gray-600">Base de Datos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;