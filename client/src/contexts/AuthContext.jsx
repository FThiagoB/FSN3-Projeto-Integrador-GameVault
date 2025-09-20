import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // setCookie é necessário para ele ficar escutando os eventos
    const [cookies, setCookie, removeCookie] = useCookies(['authToken']);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Função para realizar o logout
    const logout = async () => {
        try{
            const response = await fetch(`http://localhost:4500/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${cookies.authToken}`,
                },
            });

            if (!response.ok){
                const {message} = await response.json();
                throw new Error( message );
            };

            removeCookie('authToken', { path: '/' });
            setUser(null);
            navigate('/');
        }
        catch(error){
            console.error( error );
        }
    }

    // Busca dados do usuário nas mudanças de cookie
    useEffect(() => {
        // Função para buscar o usuário
        const fetchUser = async () => {
            if (!cookies.authToken){
                setLoading(false);
                return;
            }

            try{
                const response = await fetch(`http://localhost:4500/user`, {
                    headers: {
                        Authorization: `Bearer ${cookies.authToken}`,
                    },
                });

                const userData = await response.json();

                if (!response.ok)
                    throw new Error( userData.message );
                
                setUser(userData);
            }
            catch(error){
                console.error( error );
            }
            finally{
                setLoading(false);
            }
        };

        fetchUser();
    }, [cookies.authToken]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);