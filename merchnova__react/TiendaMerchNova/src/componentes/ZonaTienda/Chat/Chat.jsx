import { useEffect, useEffectEvent } from 'react';
import useGlobalState from '../../../global_state/globalState';
import './Chat.css'
import { useState } from "react";
import socket_io__client_service from '../../Servicios/socket_io_client/socket_io__client_service';
import { request_profile } from '../../Servicios/peticiones_perfil/request_profile';
import { useNavigate, useParams } from 'react-router';
import { request_chat } from '../../Servicios/peticiones_chat/request_chat';

function Chat() {
    const { clientData, setClientData } = useGlobalState();
    const { salaId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [historial, setHistorial] = useState([]);
    const [chats, setChats] = useState(clientData?.chats);
    const [chosenChat, setChosenChat] = useState();
    const [chatSelected, setChatSelected] = useState(salaId ? clientData?.chats?.find(chat => chat?._id === salaId) : null);
    const selectedChat = chats?.find(chat => chat._id === chosenChat);

    function updateChats(chatId, msg) {
        const update = chats.map(chat => chat._id === chatId ? { ...chat, mensajes: [...chat.mensajes, msg] } : chat);
        console.log('Update: ', update);
        setChats(update);
        if (chatSelected && chatSelected._id === chatId) {
            setChatSelected({ ...chatSelected, mensajes: [...chatSelected.mensajes, msg] });
        }

        useGlobalState.getState().setClientData({ ...clientData, chats: update });
    }

    const setData = useEffectEvent((data) => {
        const { salaId, mensaje } = JSON.parse(data);
        console.log('Mensaje recibido: ', mensaje);
        updateChats(salaId, mensaje);
    })

    useEffect(
        () => {
            socket_io__client_service.receiveEvent('receiveMsg', setData);
            return () => {
                socket_io__client_service.closeEvent(setData);
            }
        }, []
    )

    //console.log('Chat seleccionado: ', chatSelected);
    //console.log('Datos del chats: ', chats);

    // Funcion para enviar un mensaje y cambiar el estado de los chats de los participantes
    function sendMessage() {
        if (!message.trim()) return; // No enviar mensajes vacíos

        // Enviar mensaje con los datos de ambos usuarios de la sala para mostrarlo en chat posteriormente con imagen y nombre
        //console.log('Enviando mensaje a la sala: ', salaId);
        const messageToSend = {
            salaId: salaId,
            mensaje: {
                transmitterId: clientData?._id,
                contenido: message,
                timestamp: Date.now()
            },
            datosCliente: {
                idCliente: chatSelected.datosCliente.idCliente,
                nombreCliente: chatSelected.datosCliente.nombreCliente,
                imagenCuenta: chatSelected.datosCliente.imagenCuenta
            },
            datosAdmin: {
                idAdmin: chatSelected.datosAdmin.idAdmin,
                nombreAdmin: chatSelected.datosAdmin.nombreAdmin,
                imagenCuenta: chatSelected.datosAdmin.imagenCuenta
            }
        };

        updateChats(chatSelected._id, messageToSend.mensaje);

        socket_io__client_service.sendMessage('sendMsg', messageToSend);

        setMessage(''); // Limpiar el input después de enviar
    }

    async function archivateChat() {
        if (salaId) {
            const clientEndChat = await request_chat.end_chat(salaId, clientData._id);
            console.log('Respuesta: ', clientEndChat);
            setClientData(clientEndChat.data.client);
            setChatSelected(null);
            navigate('/Portal/Soporte/Chat');
        }
    }


    return (
        <div className="container-fluid p-4">
            <div className="support-layout">
                {/* SIDEBAR */}
                <div className="support-sidebar">

                    {/* HEADER */}
                    <div className="sidebar-header">
                        <h5>Chats activos</h5>
                        <span>{clientData?.chats?.length || 0} conversaciones</span>
                    </div>

                    {/* BUSCADOR */}
                    <div className="sidebar-search">
                        <input type="text" placeholder="Buscar chat..." className="form-control" />
                    </div>

                    {chats?.map((chat, pos) =>
                        <div className={selectedChat?._id === chat._id ? "chat-user active-chat" : "chat-user"} onClick={() => { setChosenChat(chat._id); setChatSelected(chat); navigate(`/Portal/Soporte/Chat/${chat._id}`) }} key={pos}>
                            <div className="chat-user-left">
                                <div className="chat-avatar-wrapper">
                                    <img src={chat?.datosAdmin?.idAdmin === clientData._id ? chat?.datosCliente?.imagenCuenta : chat?.datosAdmin?.imagenCuenta} alt={chat?.datosCliente?.nombreCliente} className="chat-user-avatar" />
                                </div>

                                <div>
                                    <h6>{chat?.datosAdmin?.idAdmin === clientData._id ? chat?.datosCliente?.nombreCliente.slice(0, 12) + '...' : chat?.datosAdmin?.nombreAdmin.slice(0, 12) + '...'}</h6>
                                    <p>{chat?.mensajes[chat?.mensajes?.length - 1]?.contenido || ''}</p>
                                    <span className='date-last-msg'>{ chat?.mensajes.length !== 0 ? new Date(chat?.mensajes[chat?.mensajes?.length - 1]?.timestamp).toLocaleString() || '' : '---'}</span>
                                </div>
                            </div>

                            <div className="chat-meta">
                                <span className="unread-badge">2</span>
                            </div>
                        </div>
                    )}
                </div>


                {(selectedChat !== null && selectedChat) ?
                    <div className="support-main-chat">
                        <div className="chat-main-header">
                            {/* DATOS ADMIN */}
                            <div className="main-user-info">
                                {clientData.cuenta.rol === 'ADMINISTRADOR' ? (
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className='d-flex gap-2'>
                                            <img src={chatSelected?.datosCliente?.imagenCuenta} alt={chatSelected?.datosCliente?.nombreCliente} className="main-chat-avatar" />
                                            <div className='d-flex flex-column justify-content-center'>
                                                <h6>{chatSelected?.datosCliente?.nombreCliente}</h6>
                                                <span>Cliente</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className='d-flex gap-2'>
                                            <img src={chatSelected?.datosAdmin?.imagenCuenta} alt={chatSelected?.datosAdmin?.nombreAdmin} className="main-chat-avatar" />
                                            <div className='d-flex flex-column justify-content-center'>
                                                <h6>{chatSelected?.datosAdmin?.nombreAdmin}</h6>
                                                <span>Administrador</span>
                                            </div>
                                        </div>

                                        {chatSelected.estado === 'ACTIVO' &&
                                            <div className='mx-2'>
                                                <button className='btn btn-primary' onClick={archivateChat}>Archivar chat</button>
                                            </div>
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="chat-messages">
                            {chatSelected?.mensajes?.map((msg, pos) =>
                                <div className={msg?.transmitterId === clientData?._id ? "message-row user" : "message-row support"} key={pos}>
                                    {/* DESDE LA VISTA DEL USUARIO CONTRARIO */}
                                    {msg?.transmitterId !== clientData?._id &&
                                        <img src={clientData.cuenta.rol === 'ADMINISTRADOR' ? chatSelected?.datosCliente?.imagenCuenta : chatSelected?.datosAdmin?.imagenCuenta} alt="" className="message-avatar" />
                                    }
                                    <div className={msg?.transmitterId === clientData._id ? "message-content user-content" : "message-content"}>
                                        <div className={msg?.transmitterId === clientData._id ? "message-bubble user-msg" : "message-bubble admin-info"}>{msg?.contenido}</div>

                                        <div className={msg?.transmitterId === clientData?._id ? "message-info user-info" : "message-info"}>
                                            <span>{msg?.transmitterId === clientData?._id ? clientData?.nombreCompleto : (clientData.cuenta.rol === 'ADMINISTRADOR' ? chatSelected?.datosCliente?.nombreCliente : chatSelected?.datosAdmin?.nombreAdmin)}</span>
                                            <small>{msg?.timestamp !== null ? new Date(msg?.timestamp).toLocaleString() : ''}</small>

                                            {/* {msg?.transmitterId === clientData?._id &&
                                                <span className="message-seen">
                                                    <i className="bi bi-check2-all"></i>Visto
                                                </span>
                                            } */}
                                        </div>
                                    </div>

                                    {/* DESDE LA VISTA DEL USUARIO */}
                                    {msg?.transmitterId === clientData?._id &&
                                        <img src={`${clientData?.cuenta?.imagenCuenta}`} alt={clientData?.nombreCompleto} className="message-avatar" />
                                    }
                                </div>
                            )}
                        </div>

                        {chatSelected?.estado === 'ACTIVO' ?
                            <div className="chat-input-zone">
                                <input type="text" className="form-control support-input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe un mensaje..." />
                                <button className="btn btn-send" onClick={sendMessage} >
                                    <i className="bi bi-send-fill"></i>
                                </button>
                            </div>
                            : chatSelected?.estado === 'ARCHIVADO' &&
                            <div className="chat-archived-box">
                                <div className="archived-icon">
                                    <i className="bi bi-lock-fill"></i>
                                </div>

                                <h5 className='ms-2'>Conversación finalizada</h5>
                                <p>Este chat ha sido archivado por el usuario y ya no es posible enviar nuevos mensajes.</p>
                            </div>
                        }

                    </div>

                    :
                    <div className="empty-chat-wrapper">
                        <div className="empty-chat-card">
                            <div className="empty-chat-icon">
                                <i className="bi bi-chat-left-dots"></i>
                            </div>

                            <h3>Selecciona una conversación</h3>

                            <p>Elige un chat desde la barra lateral para visualizar los mensajes
                                y continuar la conversación con el soporte técnico.
                            </p>
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default Chat;
