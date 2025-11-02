import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ApolloProvider } from '@apollo/client/react';
import apolloClient from './api/apolloClient';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Products from './pages/Products'
import LoginGraphQL from './pages/LoginGraphQL';
import ProductsGraphQL from './pages/ProductsGraphQL';
import './App.css';

function App() {
    return (
        <ApolloProvider client={apolloClient}>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<LoginGraphQL />} />
                            <Route path="/registro" element={<Register />} />
                            <Route
                                path="/productos"
                                element={
                                    <ProtectedRoute>
                                        <ProductsGraphQL />
                                    </ProtectedRoute>
                                }
                            />
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
        </ApolloProvider>
    );
}

export default App;