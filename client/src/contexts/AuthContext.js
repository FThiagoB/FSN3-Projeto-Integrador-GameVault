import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useCart } from "./CartContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // setCookie é necessário para ele ficar escutando os eventos
    const [cookies, setCookie, removeCookie] = useCookies(['authToken']);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userAddress, setUserAddress] = useState({});
    const [userPaymentMethod, setUserPaymentMethod] = useState({});

    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(true);

    const { logoutClearInfo } = useCart();

    const updateAddressFromJSON = (response) => {
        setUserAddress({
            addressID: response?.id || undefined, 
            street: response?.street || "",
            number: response?.number || "",
            complemento: response?.complemento || "",
            neighborhood: response?.neighborhood || "",
            city: response?.city || "",
            state: response?.state || "",
            zipCode: response?.zipCode || "",
            isDefaultShipping: response?.isDefaultShipping || false
        });
    };

    const updatePaymentMethodFromJSON = (response) => {
        setUserPaymentMethod({
            paymentMethodID: response?.id || undefined,
            type: response?.type || "",
            name: response?.name || "",
            data: response?.data || {}
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
            setUserAddress({});
            setUserPaymentMethod({});
            logoutClearInfo();
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
            setUserAddress({});
            setUserPaymentMethod({});
        }
        catch (error) {
            console.error(error);
        }
    }

    const syncData = async () => {
        setRefresh(!refresh);
    }

    // Função para buscar informações do usuário
    const fetchUserData = async () => {
        setLoading(true);

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

            if (!response.ok) {
                throw new Error(userData.message);
            }

            setUser(userData);
            
            // Atualiza endereço se disponível
            if (userData.address) {
                updateAddressFromJSON(userData.address);
            }
            
            // Atualiza método de pagamento se disponível
            if (userData.paymentMethod) {
                updatePaymentMethodFromJSON(userData.paymentMethod);
            }
            
            // Verifica flags para informar se o usuário tem endereço e método de pagamento
            if (userData.hasAddress === false) {
                setUserAddress({});
            }
            
            if (userData.hasPaymentMethod === false) {
                setUserPaymentMethod({});
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [refresh, cookies.authToken]);

    return (
        <AuthContext.Provider value={{ user, setUser, userAddress, userPaymentMethod, loading, logout, deleteAcc, syncData }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);