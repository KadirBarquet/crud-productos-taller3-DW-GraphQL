import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApiMode } from '../context/ApiModeContext';
import { LogOut, User, Package, Database, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const NavbarWithMode = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { apiMode, changeMode, isRest, isGraphQL } = useApiMode();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Sesión cerrada exitosamente');
        navigate('/');
    };

    const handleModeChange = (newMode) => {
        if (newMode === apiMode) return;
        
        changeMode(newMode);
        toast.success(`Cambiado a modo ${newMode === 'rest' ? 'REST API' : 'GraphQL'}`);
        
        // Si está autenticado, redirigir a productos del nuevo modo
        if (isAuthenticated) {
            if (newMode === 'graphql') {
                navigate('/productos-graphql');
            } else {
                navigate('/productos');
            }
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Package className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-800">CRUD Productos</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Selector de Modo */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => handleModeChange('rest')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                                    isRest
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Database className="h-4 w-4" />
                                <span>REST</span>
                            </button>
                            <button
                                onClick={() => handleModeChange('graphql')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                                    isGraphQL
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Zap className="h-4 w-4" />
                                <span>GraphQL</span>
                            </button>
                        </div>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/productos"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Productos
                                </Link>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <User className="h-5 w-5" />
                                    <span className="text-sm font-medium">{user?.nombre}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Salir</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={isGraphQL ? '/login-graphql' : '/login'}
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to={isGraphQL ? '/registro-graphql' : '/registro'}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                        isGraphQL
                                            ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarWithMode;