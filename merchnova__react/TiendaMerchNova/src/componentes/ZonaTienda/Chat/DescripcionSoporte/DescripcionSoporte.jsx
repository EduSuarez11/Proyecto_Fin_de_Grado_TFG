import { useState } from 'react';
import useGlobalState from '../../../../global_state/globalState';
import MensajeSuccess from '../../../global_components/MensajeComponent/MensajeSuccess';
import './DescripcionSoporte.css'
import { Link, useNavigate } from 'react-router';
import socket_io__client_service from '../../../Servicios/socket_io_client/socket_io__client_service';
import { request_chat } from '../../../Servicios/peticiones_chat/request_chat';

function DescripcionSoporte() {
    const { clientData, setClientData } = useGlobalState();
    const navigate = useNavigate();
    const [msgChat, setMsgChat] = useState('');
    const [code, setCode] = useState();

    async function createChat() {
        console.log('Cliente find: ', clientData);
        if (clientData?.cuenta?.rol === 'CLIENTE') {
            const createChat = {
                datosCliente: {
                    idCliente: clientData._id,
                    nombreCliente: clientData.nombreCompleto,
                    imagenCuenta: clientData.cuenta.imagenCuenta
                },
                mensajes: [], // Inicialmente el historial de mensajes estará vacío al crear el chat, aunque se le añade un mensaje de bienvenida desde el servidor de Socket.IO al crear la sala.
            }
            const getDataResponse = await request_chat.request_create_chat(createChat);
            console.log('Respuesta al crear el chat: ', getDataResponse);

            if (getDataResponse.code !== 0) {
                //console.log('Error al crear el chat: ', getDataResponse.message);
                setCode(getDataResponse.code);
                return;
            }
            socket_io__client_service.joinRoom({ salaId: getDataResponse.data.salaId });
            //setClientData({...clientData, chats: [...clientData?.chats, {...createChat, _id: getDataResponse.data.salaId}]});
            setClientData(getDataResponse.data.userUpdate);
            setMsgChat(getDataResponse.message);
            console.log('Cliente desde descripcion: ', clientData);

        }
    }

    return (
        <div className="support-info-container">
            <div className="support-info-card">

                {/* ICONO */}
                <div className="support-icon">
                    <i className="bi bi-headset"></i>
                </div>

                {/* CONTENIDO */}
                <div className="support-info-content">
                    <h2>Centro de soporte MerchNova</h2>

                    <p>Nuestro equipo de soporte está disponible para ayudarte con cualquier problema relacionado con pedidos, pagos, productos, devoluciones
                        o incidencias técnicas dentro de la plataforma.
                    </p>

                    <p>Puedes iniciar una nueva conversación con nuestro equipo o consultar el estado de tus conversaciones anteriores en tiempo real.
                        Intentamos responder todas las solicitudes lo antes posible para garantizar la mejor experiencia posible.
                    </p>
                </div>

                {msgChat !== '' && <span className={code === 0 ? 'text-danger small' : 'text-success small'} >{msgChat}</span>}

                {!clientData && <span className='text-danger small' >Debes iniciar sesión para poder utilizar el soporte de ayuda</span>}

                {/* ACCIONES */}
                <div className="support-actions">
                    <button className="btn btn-support-primary" type='button' onClick={createChat} disabled={clientData?.chats?.find(chat => chat.estado === 'ACTIVO') || !clientData}>
                        <i className="bi bi-chat-dots me-2"></i>Iniciar conversación
                    </button>


                    <button className="btn btn-support-help" type='button' disabled={clientData?.chats?.some(chat => !chat)} onClick={() => navigate(`/Portal/Soporte/Chat`)}>
                        <i className="bi bi-clock-history me-2"></i>Ver conversación
                    </button>

                </div>
            </div>
        </div >
    )
}

export default DescripcionSoporte;
