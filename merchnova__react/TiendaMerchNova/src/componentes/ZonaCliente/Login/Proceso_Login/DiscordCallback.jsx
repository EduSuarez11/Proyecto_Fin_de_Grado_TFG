import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function LoginCallback() {
    const [param] = useSearchParams();
    useEffect(
        () => {
            const code = param.get('code');
            //console.log('codigo: ', code, ', datos del padre: ');
            if (code) {
                window.opener.postMessage({ tipo: 'DISCORD_GETCODE', code }, window.location.origin);
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
