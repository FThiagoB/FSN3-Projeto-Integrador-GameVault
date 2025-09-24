import { toast } from 'react-toastify';

const useNotification = () => {
    // Configuração para o alerta de sucesso
    const defaultSuccessConfig = {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    };

    // Configuração para o alerta de erro
    const defaultErrorConfig = {
        position: "bottom-right",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    };

    // Disponibiliza as funções do toast por meio dessa interface
    const notifySuccess = (message, customConfig = {}) => {
        toast.success(message, { ...defaultSuccessConfig, ...customConfig });
    };

    const notifyError = (message, customConfig = {}) => {
        toast.error(message, { ...defaultErrorConfig, ...customConfig });
    };

    const notifyInfo = (message, customConfig = {}) => {
        toast.info(message, { ...defaultSuccessConfig, ...customConfig });
    };

    const notifyWarning = (message, customConfig = {}) => {
        toast.warning(message, { ...defaultErrorConfig, ...customConfig });
    };

    return {
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarning
    };
};

export default useNotification;