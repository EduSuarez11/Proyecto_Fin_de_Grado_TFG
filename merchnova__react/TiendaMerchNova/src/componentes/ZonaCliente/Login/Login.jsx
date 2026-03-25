import { useRef, useState } from "react"
import './Login.css'
import InputHTMLComponent from "../../global_components/InputComponent/InputHTML";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useGlobalState from "../../../global_state/globalState";
import MensajeSuccess from "../../global_components/MensajeComponent/MensajeSuccess";

function Login() {

    const navigate = useNavigate();

    const { setClientData } = useGlobalState();
    const [formLogin, setFormLogin] = useState({});
    const [ logoutMessage, setLogoutMessage ] = useState(useLocation().state?.msg);
    const [errorLogin, setErrorLogin] = useState('');
    const [validationLogin, setValidationLogin] = useState({
        lengthPassword: false,
        email: false,
        number: false,
        symbol: false
    });

    const checkEmail = (password) => {
        const emailValidation = {
            email: /^\S+@\S+\.\S+$/.test(password),
        }

        setValidationLogin((prev) => ({
            ...prev,
            ...emailValidation
        }));
    }

    const checkPassword = (password) => {
        const passwordValidation = {
            lengthPassword: password.length >= 9,
            symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            number: /[0-9]/.test(password)
        };

        setValidationLogin((prev) => ({
            ...prev,
            ...passwordValidation
        }));
    }


    function onChangeInput(e) {
        setFormLogin({
            ...formLogin,
            [e.target.name]: e.target.value,
        });

        if (e.target.name === 'password') checkPassword(e.target.value);
        if (e.target.name === 'email') checkEmail(e.target.value);
    }

    async function handleSubmit(e) {
        try {
            const requestLogin = await fetch('http://localhost:3000/api/Cliente/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formLogin)
            });

            const response = await requestLogin.json();
            // #region ------------------------ Respuesta node ---------------------
            /* Objeto response:
                {
                    code: 0
                    message: '...',
                    data: {
                        clientData: {nombreCompleto: '...'},
                        accessToken: '...',
                        refreshToken: '...'
                    }
                }
                    */
             //#endregion ------------------------------------------------------------
            if (response.code !== 0) {
                console.log('Error en el Login: ', response.message);
                setErrorLogin(`${response.message}`);
                return;
            }

            localStorage.setItem("token", response.data.accessToken);
            
            setClientData(response.data.clientData);
            navigate('/', { state: { msg: `${response.message}` } });
        } catch (error) {
            console.log('Error: ', error);
        }

    }

    return (
        <div className="login-page bg-light">
            <div className="login-container">

                <h2 className="login-title">Iniciar sesión</h2>
                <div className="d-flex justify-content-center">
                    {
                        errorLogin != '' ? <span className="alert alert-danger small">{errorLogin}</span> : null
                    }
                    {
                        logoutMessage && <MensajeSuccess msg={logoutMessage} setState={setLogoutMessage} />
                    }
                </div>

                <form className="login-form" method="POST">
                    {
                        ['email', 'password'].map((value, index) =>
                            <InputHTMLComponent
                                key={index}
                                labelInput={value === 'email' ? 'Email' : 'Contraseña'}
                                tipo={value === 'password' ? 'password' : 'email'}
                                id={value}
                                nameInput={value}
                                placeholder={value === 'email' ? 'Introduce tu email' : 'Introduce tu contraseña'}
                                change={onChangeInput}
                                form={formLogin}
                                validation={validationLogin}
                                setValidation={setValidationLogin} />
                        )

                    }
                    <div className="text-center mt-1 mb-2">
                        <Link to="/recuperar-password" className="small text-decoration-none text-muted">
                            ¿Te has olvidado de la contraseña?
                        </Link>
                    </div>
                    <button className="login-btn" type="button" onClick={handleSubmit}>Iniciar sesión</button>
                </form>

                <p className="register-link">
                    ¿Todavía no tienes cuenta?
                    <Link to="/Cliente/Registro" className="ms-1">
                        Regístrate aquí
                    </Link>
                </p>

            </div>

        </div>
    )
}

export default Login