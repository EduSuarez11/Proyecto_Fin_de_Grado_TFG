import { useEffect, useState } from 'react';
import './RestablecerClave.css'
import { redirect, useNavigate, useSearchParams } from 'react-router';
import { request_get_token } from '../../../Servicios/peticiones_auth_frontend/request_auth';
import { request_profile } from '../../../Servicios/peticiones_perfil/request_profile';


function RestablecerClave() {
    const [params] = useSearchParams();
    const clientId = params.get('clientId');
    const token = params.get('tokenPasswd');
    const navigate = useNavigate();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState({
        password: '',
        confirmPassword: '',
        clientId: clientId
    });

    useEffect(
        () => {
            const verifyUser = async () => {
                const responseToken = await request_get_token.token_verify(token);
                console.log('Token: ', token)
                console.log('Respuesta de verificado token: ', responseToken)
                if (responseToken.data?.user?._id !== clientId) return navigate('/');

                setErrorMsg('¡Mínimo entre 6 y 25 carácteres!');
            }
            verifyUser();

        }, []
    );

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
        <div className="register-wrapper mt-5">
            <div className="register-card">
                <h2 className="text-center register-title mb-4">Cambiar contraseña</h2>
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
                                <input type={typeInput} name={elemt === "Nueva contraseña" ? "password" : 'confirmPassword'} className="form-control" placeholder={elemt === "Nueva contraseña" ? 'Escribe tu nueva contraseña' : 'Repite tu contraseña'} onChange={(ev) => setPassword({ ...password, [ev.target.name]: ev.target.value })} />
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

                <div className="d-grid">
                    <button type="button" className="btn btn-custom" onClick={handlePassword} >Actualizar contraseña</button>
                </div>
            </div>
        </div>
    )
}

export default RestablecerClave;
