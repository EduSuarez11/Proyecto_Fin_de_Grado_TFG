import './TipoLogin.css';
import { Link, useSearchParams } from 'react-router-dom';

function TipoLogin() {
    const [searchParams] = useSearchParams();
    async function handleLoginDiscord() {
        const code = searchParams.get('code');
        const URL_REDIRECT = encodeURIComponent('http://localhost:3000/api/Cliente/DiscordCallback');
        const URL_DISCORD = `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${URL_REDIRECT}&scope=identify+email`;
        window.open(URL_DISCORD, 'popup', 'width=800px; height=700px');

        const requestDiscord = await fetch('http://localhost:3000/api/Cliente/DiscordCallback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code })
        });

        const responseDiscord = await requestDiscord.json();
        console.log('Respuesta de discord: ', responseDiscord);

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

                    <button className="btn login-tipo-btn discord">
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
