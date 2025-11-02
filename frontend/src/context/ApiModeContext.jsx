import { createContext, useContext, useState, useEffect } from 'react';

const ApiModeContext = createContext();

export const useApiMode = () => {
    const context = useContext(ApiModeContext);
    if (!context) {
        throw new Error('useApiMode debe usarse dentro de ApiModeProvider');
    }
    return context;
};

export const ApiModeProvider = ({ children }) => {
    const [apiMode, setApiMode] = useState(() => {
        // Cargar del localStorage o usar 'rest' por defecto
        return localStorage.getItem('apiMode') || 'rest';
    });

    useEffect(() => {
        // Guardar en localStorage cuando cambie
        localStorage.setItem('apiMode', apiMode);
    }, [apiMode]);

    const changeMode = (mode) => {
        setApiMode(mode);
    };

    const value = {
        apiMode,
        changeMode,
        isRest: apiMode === 'rest',
        isGraphQL: apiMode === 'graphql'
    };

    return (
        <ApiModeContext.Provider value={value}>
            {children}
        </ApiModeContext.Provider>
    );
};