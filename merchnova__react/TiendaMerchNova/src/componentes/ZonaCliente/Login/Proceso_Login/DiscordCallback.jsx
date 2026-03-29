import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function LoginCallback() {
    const [param] = useSearchParams();
    useEffect(
        () => {
            const code = param.get('code');
            //const canal = new BroadcastChannel('discord');

            console.log('codigo: ', code);
            if (code && window.opener) {
                window.opener.postMessage({ code });
                window.close();
            }
        }, []
    );
    return (
        <div className="container">
            <p className="text-center p-3">Autentificado con éxito en Discord, cerrando la ventana...</p>
        </div>
    );
}

export default LoginCallback;
