import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client/react';
import apolloClient from './api/apolloClient';
import { AuthProvider } from './context/AuthContext';
import { ApiModeProvider } from './context/ApiModeContext';
import NavbarWithMode from './components/NavbarWithMode';
import ProtectedRoute from './components/ProtectedRoute';
import ProductsRouter from './components/ProductsRouter';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import './App.css';

function App() {
    return (
        <ApolloProvider client={apolloClient}>
            <ApiModeProvider>
                <AuthProvider>
                    <Router>
                        <div className="min-h-screen bg-gray-50">
                            <NavbarWithMode />
                            <Routes>
                                {/* Páginas públicas */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/registro" element={<Register />} />

                                {/* Ruta de productos (dinámica según el modo) */}
                                <Route
                                    path="/productos"
                                    element={
                                        <ProtectedRoute>
                                            <ProductsRouter />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Redirección por defecto */}
                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 3000,
                                    style: {
                                        background: '#363636',
                                        color: '#fff',
                                    },
                                    success: {
                                        duration: 3000,
                                        iconTheme: {
                                            primary: '#4ade80',
                                            secondary: '#fff',
                                        },
                                    },
                                    error: {
                                        duration: 4000,
                                        iconTheme: {
                                            primary: '#ef4444',
                                            secondary: '#fff',
                                        },
                                    },
                                }}
                            />
                        </div>
                    </Router>
                </AuthProvider>
            </ApiModeProvider>
        </ApolloProvider>
    );
}

export default App;