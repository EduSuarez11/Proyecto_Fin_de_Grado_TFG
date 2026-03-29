import { useEffect, useRef } from 'react';
import './TipoLogin.css';
import { Link, useNavigate } from 'react-router-dom';

function TipoLogin() {
    const navigate = useNavigate();
    useEffect(() => {
        const popupEvent = async (event) => {
            console.log("Mensaje recibido: ", event.data);
            if (event.data.code) {
                try {
                    const requestDiscord = await fetch('http://localhost:3000/api/Cliente/DiscordCallback', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: event.data.code })
                    });

                    const responseDiscord = await requestDiscord.json();
                    console.log('Respuesta desde discord: ', responseDiscord);
                    navigate('/');
                } catch (error) {
                    console.log('Error al iniciar sesion en DC: ', error);
                }
            }
        };
        window.addEventListener('message', popupEvent);
        return () => window.removeEventListener('message', popupEvent);
    }, [])

    async function handleLoginDiscord() {
        const requestURL = await fetch('http://localhost:3000/api/Cliente/LoginDiscord', { method: 'GET' });
        const response = await requestURL.json();

        console.log('Respuesta: ', response);
        window.open(response.url, 'popup', 'width=800px; height=700px');
    }

    return (
        <div className="login-tipo-container">
            <div className="login-tipo-card">
                <h2 className="login-tipo-title">Bienvenido a MerchNova</h2>
                <p className="login-tipo-subtitle">Elige cómo quieres iniciar sesión</p>

                <div className="login-tipo-buttons">

                    <button className="btn login-tipo-btn google">
                        <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="" />
                        Continuar con Google
                    </button>

                    <button className="btn login-tipo-btn discord" onClick={handleLoginDiscord}>
                        <img src="https://cdn-icons-png.flaticon.com/128/5968/5968756.png" alt="" />
                        Continuar con Discord
                    </button>

                    <div className="divider">
                        <span>o</span>
                    </div>

                    <Link to='/Cliente/Login' className="btn login-tipo-btn email">
                        Iniciar sesión con Email
                    </Link>

                    <div className='d-flex justify-content-center'>
                        <Link to='/' className='btn btn-danger w-50'>
                            Volver
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TipoLogin;
