import { redirect, useSearchParams } from "react-router";
import { request_get_token } from "../Servicios/peticiones_auth_frontend/request_auth";

export const securityApplication = async () => {
    const token = sessionStorage.getItem('token');
    const responseTokenVerify = await request_get_token.token_verify(token);
    console.log('Respuesta token: ', responseTokenVerify);
    if (!responseTokenVerify?.data?.user) return redirect('/Cliente/TipoLogin');
    return responseTokenVerify.data?.user;
}

export const accountLogged = async () => {
    const token = sessionStorage.getItem('token');
    const responseTokenVerify = await request_get_token.token_verify(token);
    console.log('Respuesta token: ', responseTokenVerify);
    if (responseTokenVerify?.data?.user) return redirect('/');
}

export const areaAdmin = async () => {
    const token = sessionStorage.getItem('token');
    const responseTokenVerify = await request_get_token.token_verify(token);
    console.log('Respuesta token: ', responseTokenVerify);
    if (responseTokenVerify?.data?.user?.cuenta?.rol !== 'ADMINISTRADOR') return redirect('/');
}

export const securityChangePassword = async ({params}) => {
    const { token, clientId } = params;
    //console.log('Parametros: ', token, clientId);
    const responseTokenVerify = await request_get_token.token_changepass_verify(token, clientId);
    //console.log('Respuesta token: ', responseTokenVerify);
    if (responseTokenVerify.code !== 0) return redirect('/Cliente/ErrorCambioClave');
    return { clientId, token };
}