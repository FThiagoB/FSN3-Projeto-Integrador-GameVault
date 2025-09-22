import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // setCookie é necessário para ele ficar escutando os eventos
    const [cookies, setCookie, removeCookie] = useCookies(['authToken']);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userAddress, setUserAddress] = useState({});
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);

    const updateAddressFromJSON = (response) => {
        setUserAddress({
            addressID: response?.id || undefined, 
            street: response?.street || "",
            number: response?.number || "",
            complemento: response?.complemento || "",
            neighborhood: response?.neighborhood || "",
            city: response?.city || "",
            state: response?.state || "",
            zipCode: response?.zipCode || ""
        });
    };

    // Função para realizar o logout
    const logout = async () => {
        try {
            const response = await fetch(`http://localhost:4500/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${cookies.authToken}`,
                },
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message);
            };

            removeCookie('authToken', { path: '/' });
            setUser(null);
        }
        catch (error) {
            console.error(error);
        }
    }

    // Função para apagar a conta
    const deleteAcc = async () => {
        try {
            const response = await fetch(`http://localhost:4500/user`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${cookies.authToken}`,
                },
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message);
            };

            removeCookie('authToken', { path: '/' });
            setUser(null);
        }
        catch (error) {
            console.error(error);
        }
    }

    const syncData = async () => {
        setRefresh(!refresh);
    }

    useEffect(() => {
        // Função para buscar informações do usuário
        const fetchUser = async () => {
            setLoading(true);

            if (!cookies.authToken) {
                setLoading(false);
                return;
            }

            // Busca informações do usuário
            try {
                const response = await fetch(`http://localhost:4500/user`, {
                    headers: {
                        Authorization: `Bearer ${cookies.authToken}`,
                    },
                });

                const userData = await response.json();

                if (!response.ok)
                    throw new Error(userData.message);

                setUser(userData);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }

            // Busca informações sobre endereços
            try {
                const response = await fetch("http://localhost:4500/addresses", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${cookies.authToken}`,
                    }
                });

                const result = await response.json();
                updateAddressFromJSON( result?result[0]:{} );
                console.log({result})
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, [refresh]);

    // Busca dados do usuário nas mudanças de cookie
    useEffect(() => {
        // Função para buscar o usuário
        const fetchUser = async () => {
            if (!cookies.authToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4500/user`, {
                    headers: {
                        Authorization: `Bearer ${cookies.authToken}`,
                    },
                });

                const userData = await response.json();

                if (!response.ok)
                    throw new Error(userData.message);

                setUser(userData);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [cookies.authToken]);

    return (
        <AuthContext.Provider value={{ user, setUser, userAddress, loading, logout, deleteAcc, syncData }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);