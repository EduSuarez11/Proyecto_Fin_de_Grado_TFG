import { useEffect } from 'react';
import useGlobalState from '../../../global_state/globalState';
import './Chat.css'
import { useState } from "react";
import socket_io__client_service from '../../Servicios/socket_io_client/socket_io__client_service';
import { request_profile } from '../../Servicios/peticiones_perfil/request_profile';
import { useNavigate, useParams } from 'react-router';

function Chat() {
    const { clientData, setClientData } = useGlobalState();
    const { salaId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [historial, setHistorial] = useState([]);
    const [chats, setChats] = useState(clientData?.chats);
    const [chosenChat, setChosenChat] = useState();
    const chatSelected = salaId ? clientData?.chats?.find(chat => chat?._id === salaId) : null;
    const selectedChat = chats?.find(chat => chat._id === chosenChat);

    useEffect(
        () => {
            // Conectar al servidor de Socket.IO
            //console.log("🟢 [FRONTEND] El componente se montó. Activando listener receiveMsg...");
            socket_io__client_service.listenMessages((data) => {
                console.log('Nuevo mensaje recibido: ', data);
                const updatedChatSelected = clientData?.chats?.map(chat =>
                    chat?._id === chatSelected?._id
                        ? {
                            ...chat,
                            mensajes: [...chat?.mensajes, data?.mensaje]
                        }
                        : chat
                );
                //setChatSelected(updatedChatSelected);
            });
            return () => {
                //console.log("🔴 [FRONTEND] El componente se desmontó. Apagando listener...");
                socket_io__client_service.closeEvent;
            }
        }, []
    )

    useEffect(
        () => {
            if (clientData.cuenta.rol === 'ADMINISTRADOR') {
                socket_io__client_service.adminListen(clientData._id, (data) => {
                    const { salaId, datosCliente, datosAdmin, firstMsg } = data;
                    console.log('Nuevo chat en: ', salaId);
                    useGlobalState.setState().setClientData(
                        {
                            ...useGlobalState.getState().clientData,
                            chats: clientData?.chats?.map(chat =>
                                chat._id === salaId ?
                                    { ...chat, _id: salaId, datosCliente, datosAdmin, mensajes: [firstMsg] }
                                    :
                                    chat
                            )
                        }
                    );
                    console.log('Cliente: ', useGlobalState.getState().clientData);
                    socket_io__client_service.joinRoom(salaId);
                })
            }
        },[clientData._id]
    )

    //console.log('Chat seleccionado: ', chatSelected);
    //console.log('Datos del chats: ', chats);

    function sendMessage() {
        if (!message.trim()) return; // No enviar mensajes vacíos
        //const sala = clientData.cuenta.rol === 'CLIENTE' ? `sala-${clientData._id}` : room
        console.log('Enviando mensaje a la sala: ', salaId);
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

        socket_io__client_service.sendMessage('sendMsg', messageToSend);

        useGlobalState.getState().setClientData(
            {
                ...clientData,
                chats: clientData?.chats?.map(chat =>
                    chat._id === chatSelected._id ?
                        { ...chat, mensajes: [...chat.mensajes, { transmitterId: clientData._id, contenido: message, timestamp: Date.now() }] }
                        :
                        chat
                )
            }
        );

        setChats(
            clientData?.chats?.map(
                chat => chat._id === chatSelected._id
                    ? { ...chat, mensajes: [...chat.mensajes, messageToSend.mensaje] }
                    : chat
            )
        );
        //setChatSelected(chatSelected ? { ...chatSelected, mensajes: [...chatSelected.mensajes, messageToSend.mensaje] } : chatSelected);
        setMessage(''); // Limpiar el input después de enviar
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
                        <div className={chosenChat ? "chat-user active-chat" : "chat-user"} onClick={() => { setChosenChat(chat._id); navigate(`/Portal/Soporte/Chat/${chat._id}`) }} key={pos}>
                            <div className="chat-user-left">
                                <div className="chat-avatar-wrapper">
                                    <img src={chat?.datosAdmin?.idAdmin === clientData._id ? chat?.datosCliente?.imagenCuenta : chat?.datosAdmin?.imagenCuenta} alt={chat?.datosCliente?.nombreCliente} className="chat-user-avatar" />
                                    <span className="online-dot"></span>
                                </div>

                                <div>
                                    <h6>{chat?.datosAdmin?.idAdmin === clientData._id ? chat?.datosCliente?.nombreCliente : chat?.datosAdmin?.nombreAdmin}</h6>
                                    <p>{chat?.mensajes[chat?.mensajes?.length - 1]?.contenido}</p>
                                </div>
                            </div>

                            <div className="chat-meta">
                                <small>{new Date(chat?.mensajes[chat?.mensajes?.length - 1]?.timestamp).toLocaleString()}</small>
                                <span className="unread-badge">2</span>
                            </div>
                        </div>
                    )}
                </div>


                {(selectedChat !== null && selectedChat) &&
                    <div className="support-main-chat">
                        <div className="chat-main-header">
                            {/* DATOS ADMIN */}
                            <div className="main-user-info">
                                {clientData.cuenta.rol === 'ADMINISTRADOR' ? (
                                    <>
                                        <img src={chatSelected?.datosCliente?.imagenCuenta} alt={chatSelected?.datosCliente?.nombreCliente} className="main-chat-avatar" />
                                        <div>
                                            <h6>{chatSelected?.datosCliente?.nombreCliente}</h6>
                                            <span>Cliente</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img src={chatSelected?.datosAdmin?.imagenCuenta} alt={chatSelected?.datosAdmin?.nombreAdmin} className="main-chat-avatar" />
                                        <div>
                                            <h6>{chatSelected?.datosAdmin?.nombreAdmin}</h6>
                                            <span>Administrador</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="chat-messages">
                            {chatSelected?.mensajes?.map((msg, pos) =>
                                <div className={msg?.transmitterId === clientData?._id ? "message-row user" : "message-row support"} key={pos}>
                                    {msg?.transmitterId !== clientData?._id &&
                                        <img src={clientData.cuenta.rol === 'ADMINISTRADOR' ? chatSelected?.datosCliente?.imagenCuenta : chatSelected?.datosAdmin?.imagenCuenta} alt="" className="message-avatar" />
                                    }
                                    <div className={msg?.transmitterId === clientData._id ? "message-content user-content" : "message-content"}>
                                        <div className={msg?.transmitterId === clientData._id ? "message-bubble user-msg" : "message-bubble admin-info"}>{msg?.contenido}</div>

                                        <div className={msg?.transmitterId === clientData?._id ? "message-info user-info" : "message-info"}>
                                            <span>{msg?.transmitterId === clientData?._id ? clientData?.nombreCompleto : (clientData.cuenta.rol === 'ADMINISTRADOR' ? chatSelected?.datosCliente?.nombreCliente : chatSelected?.datosAdmin?.nombreAdmin)}</span>
                                            <small>{new Date(msg?.timestamp).toLocaleString()}</small>

                                            {/* {msg?.transmitterId === clientData?._id &&
                                                <span className="message-seen">
                                                    <i className="bi bi-check2-all"></i>Visto
                                                </span>
                                            } */}
                                        </div>
                                    </div>

                                    {/* MIO */}
                                    {msg?.transmitterId === clientData?._id &&
                                        <img src={`${clientData?.cuenta?.imagenCuenta}`} alt={clientData?.nombreCompleto} className="message-avatar" />
                                    }
                                </div>
                            )}
                        </div>

                        <div className="chat-input-zone">
                            <input type="text" className="form-control support-input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe un mensaje..." />
                            <button className="btn btn-send" onClick={sendMessage} >
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default Chat;
