import { useEffect, useRef, useState } from 'react';
import './TipoLogin.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useGlobalState from '../../../global_state/globalState';
import MensajeSuccess from "../../global_components/MensajeComponent/MensajeSuccess";
import requestFetch from '../../Servicios/peticiones_fetch';

function TipoLogin() {
    const { setClientData } = useGlobalState();
    const navigate = useNavigate();
    const [logout, setLogout] = useState(useLocation().state?.msg);
    let googlePopup = useRef(null);

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
                    const URL_IMAGE = `https://cdn.discordapp.com/avatars/${responseDiscord.user.id}/${responseDiscord.user.avatar}.png`
                    const dataDiscord = {
                        nombreCompleto: responseDiscord.user.global_name,
                        cuenta: {
                            tipo: 'discord',
                            email: responseDiscord.user.email,
                            password: '',
                            genero: 'Neutro',
                            cuentaActiva: true,
                            imagenCuenta: URL_IMAGE,
                            creacionCuenta: Date.now(),
                            sobreMi: '',
                            telefono: ''
                        },
                        pedidos: [],
                        carrito: [],
                        direcciones: [
                            {
                                calle: '',
                                codigoPostal: '',
                                municipio: '',
                                pais: '',
                                provincia: ''
                            }
                        ]
                    }
                    setClientData(dataDiscord);
                    navigate('/');

                } catch (error) {
                    console.log('Error al iniciar sesion en DC: ', error);
                }
            }
        };
        window.addEventListener('message', popupEvent);
        return () => window.removeEventListener('message', popupEvent);
    }, [])


    function getDataGoogle(ev) {
        console.log('Datos de google: ', ev);
        const dataGoogle = {
            nombreCompleto: ev.data.dataUser.name,
            cuenta: {
                tipo: 'google',
                email: ev.data.dataUser.email,
                password: '',
                genero: ev.data.dataUser.gender === 'male' ? 'Masculino' : 'Femenino',
                cuentaActiva: true,
                imagenCuenta: ev.data.dataUser.photo,
                creacionCuenta: Date.now(),
                sobreMi: '',
                telefono: ''
            },
            pedidos: [],
            carrito: [],
            direcciones: [
                {
                    calle: '',
                    codigoPostal: '',
                    municipio: '',
                    pais: '',
                    provincia: ''
                }
            ]
        }
        setClientData(dataGoogle);
        window.removeEventListener('message', getDataGoogle);
        navigate('/', { state: { msg: 'Has iniciado sesión con Google' } });
    }

    async function handleLoginGoogle() {
        const response = await requestFetch.loginGoogle();
        console.log('Respuesta url: ', response);
        window.addEventListener('message', getDataGoogle);
        googlePopup = window.open(response.url, 'Google_popup', 'width=800px; height=700px');
    }

    async function handleLoginDiscord() {
        const requestURL = await fetch('http://localhost:3000/api/Cliente/LoginDiscord', { method: 'GET' });
        const response = await requestURL.json();

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
