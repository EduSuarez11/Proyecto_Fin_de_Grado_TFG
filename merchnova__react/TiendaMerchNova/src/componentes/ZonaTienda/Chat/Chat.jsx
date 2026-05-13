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
    const [chats, setChats] = useState(clientData.cuenta.rol === 'ADMINISTRADOR' ? clientData.chats : []);
    const [chosenChat, setChosenChat] = useState(null);
    const [adminInfo, setAdminInfo] = useState({ id: '', nombre: '', imagenCuenta: '' });
    const [chatSelected, setChatSelected] = useState(salaId ?
        (clientData.cuenta.rol === 'ADMINISTRADOR'
            ? clientData.chats.find(chat => chat._id === salaId)
            : clientData.chats._id === salaId ? clientData.chats : null
        ) : null); // <--- Para almacenar la lista de chats activos para el admin con objeto: { sala: '...', mensajes: '...', transmitterId: '...', horaUltimoMensaje: '...' }
    const selectedChat = chats.find(chat => chat._id === chosenChat);
    const [adminChatRooms, setAdminChatRooms] = useState([]);



    useEffect(
        () => {
            if (clientData.cuenta.rol === 'CLIENTE') {
                // Conectar al servidor de Socket.IO
                //console.log('Datos del admin: ', adminInfo);
                socket_io__client_service.listenMessages((data) => {
                    console.log('Nuevo mensaje recibido en el cliente user: ', data);
                    const newMessage = data;
                    setChatSelected({
                        ...chatSelected,
                        mensajes: [...chatSelected.mensajes, newMessage.mensaje]
                    })
                    setHistorial([...historial, newMessage]);
                });
                socket_io__client_service.joinRoom(clientData);
                socket_io__client_service.getDataAdmin((data) => {
                    console.log("Datos del admin recibidos:", data);
                    setChatSelected({
                        ...chatSelected,
                        mensajes: [...chatSelected.mensajes, newMessage.mensaje]
                    })
                    setAdminInfo(data);
                })

            } else {
                socket_io__client_service.listenMessages((data) => {
                    console.log('Nuevo mensaje recibido en el cliente administrador: ', data);
                    // Mensaje del cliente: {sala, trasmitterId, contenido, timestamp}
                    const newMessage = data;
                    setHistorial([...historial, newMessage]);

                    // setChatList((oldData) => {
                    //     const indexChat = oldData.findIndex(chat => chat.sala === newMessage.keyChat);

                    //     if (indexChat !== -1) {
                    //         const updateList = [...oldData];

                    //         updateList[indexChat] = {
                    //             ...updateList[indexChat],
                    //             ultimoMensaje: newMessage.contenido,
                    //             horaUltimoMensaje: newMessage.timestamp,
                    //             mensajes: [...updateList[indexChat].mensajes, newMessage]
                    //         }
                    //         return updateList;
                    //     } else {
                    //         const newChat = {
                    //             sala: newMessage.keyChat,
                    //             ultimoMensaje: newMessage.contenido,
                    //             horaUltimoMensaje: newMessage.timestamp,
                    //             mensajes: [newMessage]
                    //         };
                    //         return [...oldData, newChat];
                    //     }
                    // })
                })

                socket_io__client_service.getHistoryChat((messages) => {
                    console.log('Historial de mensajes recibido en el cliente administrador: ', messages);
                    setHistorial(messages);
                });

                socket_io__client_service.adminListen(clientData?._id);

            }
        }, []
    )

    console.log('Chat seleccionado: ', chatSelected);
    console.log('Datos del chats: ', chats);

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
        if (clientData.cuenta.rol === 'CLIENTE') {
            setChatSelected({
                ...chatSelected,
                mensajes: [...chatSelected.mensajes, messageToSend.mensaje]
            });
        } else {
            const updatedChats = chats.map(chat =>
                chat._id === selectedChat._id
                    ? {
                        ...chat,
                        mensajes: [...chat.mensajes, messageToSend.mensaje],
                    }
                    : chat
            );
            setChats(updatedChats);
            setChatSelected(updatedChats.find(chat => chat._id === selectedChat._id));
        }


        setMessage(''); // Limpiar el input después de enviar
    }

    return (
        <div className="container-fluid p-4">
            <div className="support-layout">
                {/* SIDEBAR */}
                {clientData.cuenta.rol === 'ADMINISTRADOR' &&
                    <div className="support-sidebar">

                        {/* HEADER */}
                        <div className="sidebar-header">
                            <h5>Chats activos</h5>
                            <span>3 conversaciones</span>
                        </div>


                        {/* BUSCADOR */}
                        <div className="sidebar-search">
                            <input type="text" placeholder="Buscar chat..." className="form-control" />
                        </div>


                        {chats?.map((chat, pos) =>
                            <div className={chosenChat ? "chat-user active-chat" : "chat-user"} onClick={() => { setChosenChat(chat._id); setChatSelected(chat); navigate(`/Portal/Soporte/Chat/${chat._id}`) }} key={pos}>
                                <div className="chat-user-left">
                                    <div className="chat-avatar-wrapper">
                                        <img src={chat?.datosCliente?.imagenCuenta} alt={chat?.datosCliente?.nombreCliente} className="chat-user-avatar" />
                                        <span className="online-dot"></span>
                                    </div>

                                    <div>
                                        <h6>{chat?.datosCliente?.nombreCliente}</h6>
                                        <p>{chat?.mensajes[chat?.mensajes.length - 1].contenido}</p>
                                    </div>
                                </div>

                                <div className="chat-meta">
                                    <small>{chat?.mensajes[chat?.mensajes?.length - 1].timestamp}</small>
                                    <span className="unread-badge">2</span>
                                </div>
                            </div>
                        )}
                    </div>
                }

                {(selectedChat !== null && selectedChat || clientData.cuenta.rol === 'CLIENTE') &&
                    <div className="support-main-chat">
                        <div className="chat-main-header">
                            {/* DATOS ADMIN */}
                            <div className="main-user-info">
                                <img src={clientData?._id !== (adminInfo?.id || clientData._id) ? chatSelected?.datosCliente?.imagenCuenta : chatSelected?.datosAdmin?.imagenCuenta} alt={clientData?._id === adminInfo?.id ? clientData?.nombreCompleto : chatSelected.datosAdmin?.nombreAdmin} className="main-chat-avatar" />
                                <div>
                                    <h6>{clientData?._id !== (adminInfo?.id || clientData._id) ? chatSelected?.datosCliente?.nombreCompleto : chatSelected?.datosAdmin?.nombreAdmin}</h6>
                                    <span>{clientData?._id === (adminInfo?.id || clientData._id) ? 'Administrador' : 'Cliente'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {chatSelected?.mensajes?.map((msg, pos) =>
                                <div className={msg?.transmitterId === clientData?._id ? "message-row user" : "message-row support"} key={pos}>
                                    {msg?.transmitterId !== clientData?._id &&
                                        <img src={chatSelected?.datosAdmin?.imagenCuenta} alt={chatSelected?.datosAdmin?.nombreAdmin} className="message-avatar" />
                                    }
                                    <div className={msg?.transmitterId === clientData._id ? "message-content user-content" : "message-content"}>
                                        <div className={msg?.transmitterId === clientData._id ? "message-bubble user-msg" : "message-bubble admin-info"}>{msg?.contenido}</div>

                                        <div className={msg?.transmitterId === clientData?._id ? "message-info user-info" : "message-info"}>
                                            <span>{msg?.transmitterId === clientData?._id ? clientData?.nombreCompleto : chatSelected.datosAdmin.nombreAdmin}</span>
                                            <small>{new Date(msg?.timestamp).toLocaleString()}</small>

                                            {/* {msg?.transmitterId === clientData?._id &&
                                                <span className="message-seen">
                                                    <i className="bi bi-check2-all"></i>Visto
                                                </span>
                                            } */}
                                        </div>
                                    </div>

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
