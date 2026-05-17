import { useEffect, useRef, useState } from 'react';
import './TipoLogin.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useGlobalState from '../../../global_state/globalState';
import MensajeSuccess from "../../global_components/MensajeComponent/MensajeSuccess";

import { request_google } from '../../Servicios/peticiones_auth_frontend/request_google';
import { request_discord } from '../../Servicios/peticiones_auth_frontend/request_discord';

function TipoLogin() {
    const navigate = useNavigate();
    const { setClientData } = useGlobalState();
    const [logout, setLogout] = useState(useLocation().state?.msg);
    let doubleRequest = useRef(false);
    let googlePopup = useRef(null);


    useEffect(() => {
        const popupEvent = async (event) => {
            //console.log("Mensaje recibido: ", event.data);
            if (event.data.code && !doubleRequest.current) {
                try {
                    doubleRequest.current = true;
                    const responseDiscord = await request_discord.request_callback_discord(event.data.code);
                    
                    const response = await request_discord.request_login_discord(responseDiscord.user);

                    if (response.code !== 0) throw new Error('Fallo en la peticion de discord');

                    sessionStorage.setItem("token", response.data.access_token);
                    setClientData(response.data.user);
                    navigate('/');
                } catch (error) {
                    console.log('Error al iniciar sesion en DC: ', error);
                    doubleRequest.current = false;
                }
            }
        };
        window.addEventListener('message', popupEvent);
        return () => window.removeEventListener('message', popupEvent);
    }, [])


    function getDataGoogle(ev) {
        console.log('Datos de google: ', ev.data);
        setClientData(ev.data?.dataUser?.client);
        sessionStorage.setItem("token", ev.data.dataUser.accessToken);
        window.removeEventListener('message', getDataGoogle);
        navigate('/', {state: {msg: 'Has iniciado sesión con Google'}})
    }

    async function handleLoginGoogle() {
        const response = await request_google.loginGoogle();
        //console.log('Respuesta url: ', response);

        if (response.code !== 0 ) throw new Error('Fallo en la peticion de google');
        window.addEventListener('message', getDataGoogle);
        googlePopup = window.open(response.url, 'Google_popup', 'width=800px; height=700px');
    }

    async function handleLoginDiscord() {
        const response = await request_discord.discord_url();
        console.log('Respuesta: ', response);
        window.open(response.url, 'popup', 'width=800px; height=700px');
    }

    return (
        <div className="login-tipo-container">
            {
                logout &&
                <MensajeSuccess msg={logout} setState={setLogout} />
            }

            <div className="login-tipo-card">
                <h2 className="login-tipo-title">Bienvenido a MerchNova</h2>
                <p className="login-tipo-subtitle">Elige cómo quieres iniciar sesión</p>

                <div className="login-tipo-buttons">

                    <button className="btn login-tipo-btn google" onClick={handleLoginGoogle}>
                        <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
                        Continuar con Google
                    </button>

                    <button className="btn login-tipo-btn discord" onClick={handleLoginDiscord}>
                        <img src="https://cdn-icons-png.flaticon.com/128/5968/5968756.png" alt="Discord" />
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
