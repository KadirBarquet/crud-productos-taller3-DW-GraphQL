import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { useApiMode } from '../context/ApiModeContext';
import { LOGIN } from '../graphql/queries';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Database, Zap } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showModeSelector, setShowModeSelector] = useState(false);
    const [tempUserData, setTempUserData] = useState(null);
    const [loadingRest, setLoadingRest] = useState(false);
    
    const { login } = useAuth();
    const { changeMode } = useApiMode();
    const navigate = useNavigate();

    // GraphQL Login
    const [loginGraphQL, { loading: loadingGraphQL }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            if (data.login.success) {
                setTempUserData({
                    usuario: data.login.usuario,
                    token: data.login.token
                });
                setShowModeSelector(true);
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Error al iniciar sesión');
        }
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Intentar login con GraphQL primero (más moderno)
        try {
            await loginGraphQL({
                variables: {
                    email: formData.email,
                    password: formData.password
                }
            });
        } catch (graphqlError) {
            // Si GraphQL falla, intentar con REST como fallback
            console.log('GraphQL falló, intentando REST...');
            setLoadingRest(true);
            try {
                const response = await API.post('/auth/login', formData);
                if (response.data.success) {
                    setTempUserData({
                        usuario: response.data.data.usuario,
                        token: response.data.data.token
                    });
                    setShowModeSelector(true);
                }
            } catch (restError) {
                toast.error(restError.response?.data?.message || 'Error al iniciar sesión');
            } finally {
                setLoadingRest(false);
            }
        }
    };

    const handleModeSelection = (selectedMode) => {
        if (!tempUserData) return;

        // Guardar usuario y token
        login(tempUserData.usuario, tempUserData.token);
        
        // Cambiar modo
        changeMode(selectedMode);

        toast.success(`¡Bienvenido! Usando ${selectedMode === 'rest' ? 'REST API' : 'GraphQL'}`);
        
        // Redirigir a productos según el modo
        navigate('/productos');
    };

    const loading = loadingRest || loadingGraphQL;

    // Modal de selección de modo después del login
    if (showModeSelector) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            ¡Bienvenido, {tempUserData?.usuario?.nombre}!
                        </h2>
                        <p className="text-lg text-gray-600">
                            ¿Qué modo de API prefieres usar?
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* REST Card */}
                        <div
                            onClick={() => handleModeSelection('rest')}
                            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-transparent hover:border-blue-500"
                        >
                            <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6 mx-auto">
                                <Database className="h-10 w-10 text-blue-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-center text-gray-900 mb-3">
                                REST API
                            </h3>
                            <p className="text-gray-600 text-center text-sm mb-6">
                                API tradicional con endpoints específicos
                            </p>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <span className="text-green-500">✓</span>
                                    <span>Simple y ampliamente conocido</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <span className="text-green-500">✓</span>
                                    <span>Endpoints claros</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <span className="text-green-500">✓</span>
                                    <span>Fácil de cachear</span>
                                </div>
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                                Continuar con REST
                            </button>
                        </div>

                        {/* GraphQL Card */}
                        <div
                            onClick={() => handleModeSelection('graphql')}
                            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-transparent hover:border-purple-500"
                        >
                            <div className="flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6 mx-auto">
                                <Zap className="h-10 w-10 text-purple-600" />
                            </div>
                            <h3 className="text-3xl font-bold text-center text-gray-900 mb-3">
                                GraphQL
                            </h3>
                            <p className="text-gray-600 text-center text-sm mb-6">
                                API moderna con queries flexibles
                            </p>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <span className="text-purple-500">⚡</span>
                                    <span>Solo pide lo que necesitas</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <span className="text-purple-500">⚡</span>
                                    <span>Un endpoint para todo</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-700">
                                    <span className="text-purple-500">⚡</span>
                                    <span>Menos peticiones</span>
                                </div>
                            </div>
                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition">
                                Continuar con GraphQL
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Puedes cambiar el modo después desde la barra de navegación
                    </p>
                </div>
            </div>
        );
    }

    // Formulario de login
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar Sesión
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <Link to="/registro" className="font-medium text-blue-600 hover:text-blue-500">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <LogIn className="h-5 w-5 mr-2" />
                                Iniciar Sesión
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;