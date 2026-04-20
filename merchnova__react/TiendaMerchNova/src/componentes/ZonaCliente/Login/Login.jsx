import { useEffect, useRef, useState } from "react"
import './Login.css'
import InputHTMLComponent from "../../global_components/InputComponent/InputHTML";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useGlobalState from "../../../global_state/globalState";
import MensajeSuccess from "../../global_components/MensajeComponent/MensajeSuccess";
import { request_set_password } from "../../Servicios/peticiones_login/peticiones_login";

function Login() {

    const navigate = useNavigate();

    const { setClientData } = useGlobalState();
    const [formLogin, setFormLogin] = useState({});
    const [email, setEmail] = useState({});
    const [params] = useSearchParams();
    const [logoutMessage, setLogoutMessage] = useState(useLocation().state?.msg);
    const [errorLogin, setErrorLogin] = useState();
    const [validationLogin, setValidationLogin] = useState({
        lengthPassword: false,
        email: false,
        number: false,
        symbol: false
    });

    const recaptchaReference = useRef(null);
    const recaptchaElement = useRef(null);

    useEffect(() => {
        if (params.get('activada') === 'true') {
            setLogoutMessage('Cuenta activada con éxito')
        } else if (params.get('activada') === 'false') {
            setErrorLogin('No se pudo activar la cuenta')
        }

    }, [params]);

    useEffect(
        () => {
            //recaptchaElement.current.innerHTML = '<div id="recaptcha"></div>';
            if (window.grecaptcha.enterprise) {
                window.grecaptcha.enterprise.ready(() => {
                    if (window.grecaptcha.enterprise && recaptchaReference.current == null) {
                        recaptchaReference.current = window.grecaptcha.enterprise.render(recaptchaElement.current, { sitekey: '6Lc6K5ksAAAAAOL8Q7ZUSBbRcgb1MPaiyvlKXrJA', action: 'LOGIN' });
                    }
                });
            }
        }, []
    )

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

    async function handleSetPassword() {
        console.log('Email: ', email);
        const response = await request_set_password.SetDataProfile(email);
        console.log('Respuesta del envio del email: ', response);
        if (response.code !== 0) {
            setErrorLogin(response.message);
            return;
        }
        setLogoutMessage(response.message);
    }

    async function handleSubmit(e) {
        try {
            let form;
            if (recaptchaReference.current != null) {
                const token = await window.grecaptcha.enterprise.getResponse(recaptchaReference.current);
                //console.log('Token Recaptcha: ', tokenRecaptcha);
                form = {
                    ...formLogin,
                    tokenRecaptcha: token
                }
            }

            const requestLogin = await fetch('http://localhost:3000/api/Cliente/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
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
            } else {
                sessionStorage.setItem("token", response.data.accessToken);
                setClientData(response.data.clientData);
                navigate('/', { state: { msg: `${response.message}` } });
            }

        } catch (error) {
            console.log('Error: ', error);
        }
    }

    return (
        <div className="login-wrapper bg-light mt-5">
            <div className="login-container">

                <h2 className="login-title">Iniciar sesión</h2>
                <div className="d-flex justify-content-center">
                    {errorLogin != null && <span className="alert alert-danger small">{errorLogin}</span>}

                    {logoutMessage && <MensajeSuccess msg={logoutMessage} setState={setLogoutMessage} />}
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
                    {/* Recaptcha */}
                    <div ref={recaptchaElement} id="recaptcha" className="my-3 d-flex justify-content-center" name="tokenRecaptcha" onChange={onChangeInput}></div>


                    <div className="text-center mt-1 mb-2 small text-muted passwd" data-bs-toggle="modal" data-bs-target="#infoModal">
                        ¿Te has olvidado de la contraseña?
                    </div>

                    <div className="modal fade" id="infoModal" tabIndex="-1" aria-labelledby="label" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5 fw-bold text-danger" id="label">¡Atención!</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <p className="mb-2 fw-semibold">Escribe el email donde quieres recibir el correo para cambiar tu contraseña</p>

                                    <div className="mb-3 text-start">
                                        <label htmlFor="recipient-name" className="form-label">Email</label>
                                        <input type="text" name="email" className="form-control" id="email" onChange={(ev) => setEmail({ ...email, [ev.target.name]: ev.target.value })} />
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSetPassword}>Confirmar</button>
                                </div>
                            </div>
                        </div>
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