import { useEffect, useState } from 'react';
import './RestablecerClave.css'
import { redirect, useLoaderData, useNavigate, useSearchParams } from 'react-router';
import { request_get_token } from '../../../Servicios/peticiones_auth_frontend/request_auth';
import { request_profile } from '../../../Servicios/peticiones_perfil/request_profile';


function RestablecerClave() {
    const { clientId, token } = useLoaderData();
    const navigate = useNavigate();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState({
        password: '',
        confirmPassword: '',
        clientId: clientId
    });

    const [validation, setValidation] = useState({
        lengthPassword: false,
        number: false,
        symbol: false
    });

    const checkPassword = (password) => {
        const passwordValidation = {
            lengthPassword: password.length >= 8,
            symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            number: /[0-9]/.test(password)
        };

        setValidation((prev) => ({
            ...prev,
            ...passwordValidation
        }));
    }

    function onChangeInput(ev) {
        setPassword({ ...password, [ev.target.name]: ev.target.value })
        if (ev.target.name === 'password') checkPassword(ev.target.value);
    }

    async function handlePassword() {
        //const email = params.get('email');
        console.log('Constraseña nueva: ', password);
        const responsePass = await request_profile.set_new_password(password);
        console.log('Respuesta del cambio de la contraseña: ', responsePass);
        if (responsePass.code !== 0) {
            setErrorMsg(responsePass.message);
            return;
        };

        navigate('/', { state: { msg: responsePass.message } })
    }


    return (
        <div className="register-wrapper d-flex justify-conter-center align-items-center mt-5">
            <div className="register-card">
                <h2 className="text-center  mb-4">Cambiar contraseña</h2>
                <div className="d-flex justify-content-center">
                    {errorMsg != '' && <span className="alert alert-danger small">{errorMsg}</span>}
                </div>
                {
                    ["Nueva contraseña", "Confirmar contraseña"].map((elemt, pos) => {
                        const showPassword = elemt === "Nueva contraseña" ? showNewPassword : showConfirmPassword;
                        const setShowPassword = elemt === "Nueva contraseña" ? setShowNewPassword : setShowConfirmPassword;
                        const typeInput = showPassword ? 'text' : 'password';

                        return (
                            <div className="mb-3 input-password" key={pos}>
                                <label className="form-label">{elemt}</label>
                                <div>

                                </div>
                                <input type={typeInput} name={elemt === "Nueva contraseña" ? "password" : 'confirmPassword'} className="form-control" placeholder={elemt === "Nueva contraseña" ? 'Escribe tu nueva contraseña' : 'Repite tu contraseña'} onChange={onChangeInput} />
                                {
                                    showPassword ?
                                        <i className="fa-solid fa-eye eye-icon" onClick={() => setShowPassword(false)}></i>
                                        :
                                        <i className='fa-solid fa-eye-slash eye-icon' onClick={() => setShowPassword(true)}></i>
                                }
                            </div>
                        );
                    })
                }
                {password.password !== '' &&
                    <ul className="small mx-2 mb-4 list-unstyled">
                        <li className={validation.lengthPassword ? "text-success" : "text-danger"}>
                            {validation.lengthPassword ? "✅ Mínimo 8 caracteres" : "❌ Mínimo 8 caracteres"}
                        </li>

                        <li className={validation.number ? "text-success" : "text-danger"}>
                            {validation.number ? "✅ Contiene al menos 1 número" : "❌ Debe contener al menos 1 número"}
                        </li>

                        <li className={validation.symbol ? "text-success" : "text-danger"}>
                            {validation.symbol ? "✅ Contiene al menos 1 símbolo" : "❌ Debe contener al menos 1 símbolo"}
                        </li>
                    </ul>
                }

                <div className="d-grid">
                    <button type="button" className="btn btn-custom" onClick={handlePassword} disabled={!validation.lengthPassword || !validation.number || !validation.symbol} >Actualizar contraseña</button>
                </div>
            </div>
        </div>
    )
}

export default RestablecerClave;
