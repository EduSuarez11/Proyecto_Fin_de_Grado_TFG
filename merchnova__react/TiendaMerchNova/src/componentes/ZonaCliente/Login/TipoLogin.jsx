import './TipoLogin.css';
import { Link, useSearchParams } from 'react-router-dom';

function TipoLogin() {
    const [searchParams] = useSearchParams();

    async function handleLoginDiscord() {
        let popupDiscord;

        const requestURL = await fetch('http://localhost:3000/api/Cliente/LoginDiscord', { method: 'GET' });
        const response = await requestURL.json();

        console.log('Respuesta: ', response);
        popupDiscord = window.open(response.url, 'popup', 'width=800px; height=700px');
        //const code = searchParams.get('code');

        const popupEvent = async (ev) => {
            const { tipo } = ev.data;
            if (tipo === 'DISCORD_GETCODE') {
                const { code } = ev.data;

                if (code) {
                    const requestDiscord = await fetch('http://localhost:3000/api/Cliente/DiscordCallback', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: ev.data })
                    });

                    const responseDiscord = await requestDiscord.json();
                    console.log('Respuesta desde discord: ', responseDiscord);
                    popupDiscord.postMessage({ responseDC: responseDiscord});
                    window.removeEventListener('message', popupEvent);
                }
            }

        }
        popupDiscord.addEventListener('message', popupEvent);
        

        // window.addEventListener('message', async (ev) => {
        //     const code = searchParams.get('code');
        //     
        // });

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
                </div>
            </div>
        </div>
    )
}

export default TipoLogin;
