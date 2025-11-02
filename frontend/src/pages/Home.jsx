import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApiMode } from '../context/ApiModeContext';
import { Package, ShoppingCart, BarChart3, Users, Database, Zap } from 'lucide-react';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const { apiMode, isRest, isGraphQL } = useApiMode();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
                        Sistema de Gestión de
                        <span className="text-blue-600"> Productos</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
                        Administra tu inventario de forma eficiente con nuestro sistema CRUD completo.
                    </p>
                    <p className="text-lg text-gray-500 mb-8">
                        Compatible con <span className="font-bold text-blue-600">REST API</span> y{' '}
                        <span className="font-bold text-purple-600">GraphQL</span>
                    </p>

                    {/* Indicador de modo actual */}
                    <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg mb-8">
                        {isRest ? (
                            <>
                                <Database className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold text-blue-600">Modo: REST API</span>
                            </>
                        ) : (
                            <>
                                <Zap className="h-5 w-5 text-purple-600" />
                                <span className="font-semibold text-purple-600">Modo: GraphQL</span>
                            </>
                        )}
                    </div>

                    {isAuthenticated ? (
                        <Link
                            to={isGraphQL ? '/productos-graphql' : '/productos'}
                            className={`inline-flex items-center space-x-2 px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg hover:shadow-xl ${
                                isGraphQL
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            <Package className="h-6 w-6" />
                            <span>Ir a Productos</span>
                        </Link>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/seleccionar-modo"
                                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-lg hover:shadow-xl"
                            >
                                <Users className="h-6 w-6" />
                                <span>Comenzar Ahora</span>
                            </Link>
                            <Link
                                to="/login-unified"
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
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Dual API</h3>
                        <p className="text-gray-600">
                            Elige entre REST API o GraphQL según tus necesidades.
                        </p>
                    </div>
                </div>

                {/* Comparación REST vs GraphQL */}
                <div className="mt-20 bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        REST API vs GraphQL
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* REST */}
                        <div className="border-4 border-blue-500 rounded-lg p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 mx-auto">
                                <Database className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-center text-blue-600 mb-4">REST API</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-500">✓</span>
                                    <span className="text-sm">Simple y ampliamente conocido</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-500">✓</span>
                                    <span className="text-sm">Endpoints claros y predecibles</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-500">✓</span>
                                    <span className="text-sm">Fácil de cachear</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-green-500">✓</span>
                                    <span className="text-sm">Compatible con todo</span>
                                </li>
                            </ul>
                        </div>

                        {/* GraphQL */}
                        <div className="border-4 border-purple-500 rounded-lg p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 mx-auto">
                                <Zap className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-center text-purple-600 mb-4">GraphQL</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start space-x-2">
                                    <span className="text-purple-500">⚡</span>
                                    <span className="text-sm">Solo pide lo que necesitas</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-purple-500">⚡</span>
                                    <span className="text-sm">Un endpoint para todo</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-purple-500">⚡</span>
                                    <span className="text-sm">Documentación auto-generada</span>
                                </li>
                                <li className="flex items-start space-x-2">
                                    <span className="text-purple-500">⚡</span>
                                    <span className="text-sm">Menos peticiones al servidor</span>
                                </li>
                            </ul>
                        </div>
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