import { useEffect } from 'react';
import useGlobalState from '../../../global_state/globalState';
import './Chat.css'
import { useState } from "react";
import socket_io__client_service from '../../Servicios/socket_io_client/socket_io__client_service';

function Chat() {
    const { clientData } = useGlobalState();
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState('');
    const [historial, setHistorial] = useState([]);
    const [chosenChat, setChosenChat] = useState(null);
    const [adminInfo, setAdminInfo] = useState({ id: '', nombre: '', imagenCuenta: '' });
    const [chatUsers, setChatUsers] = useState({
        sala: `sala-${clientData._id}`,
        datosAdmin: {
            _id: adminInfo.id,
            nombreCompleto: adminInfo.nombre,
            imagenCuenta: adminInfo.imagenCuenta
        },
        mensajes: []
    });
    const [chatList, setChatList] = useState([]); // <--- Para almacenar la lista de chats activos para el admin con objeto: { sala: '...', contenido: '...', transmitterId: '...', timestamp: '...' }
    const [selectedChat, setSelectedChat] = useState(chatList?.find(chat => chat.sala === chosenChat))
    const [adminChatRooms, setAdminChatRooms] = useState([]);

    useEffect(
        () => {
            if (clientData.cuenta.rol === 'CLIENTE') {
                // Conectar al servidor de Socket.IO
                console.log('Datos del admin: ', adminInfo);
                socket_io__client_service.listenMessages((data) => {
                    console.log('Nuevo mensaje recibido en el cliente user: ', data);
                    const newMessage = data;
                    setHistorial([...historial, newMessage]);
                });
                socket_io__client_service.joinRoom(clientData?._id);
                socket_io__client_service.getDataAdmin((data) => {
                    console.log("Datos del admin recibidos:", data);
                    setAdminInfo(data);
                })

            } else {
                socket_io__client_service.listenMessages((data) => {
                    console.log('Nuevo mensaje recibido en el cliente administrador: ', data);
                    const newMessage = data;
                    setHistorial([...historial, newMessage]);
                    // Actualizar el último mensaje en la lista de chats activos para el admin
                    setChatList((oldData) => {
                        const indexChat = oldData.findIndex(chat => chat.sala === newMessage.keyChat);
                        console.log('Index: ', indexChat)

                        if (indexChat !== -1) {
                            const updateList = [...oldData];
                            const actualChat = updateList[indexChat];

                            updateList[indexChat] = {
                                ...actualChat.mensajes,
                                mensajes: [...(actualChat.contenido), newMessage]
                            }
                            console.log(`✅ Sala ${newMessage.keyChat}: Ahora tiene ${updateList[indexChat].mensajes.length} mensajes.`);
                            return updateList;
                        } else {
                            // Si el chat no existe, lo creamos con su primer mensaje
                            const nuevoChat = {
                                sala: newMessage.keyChat,
                                datosCliente: newMessage.datosCliente,
                                mensajes: [newMessage]
                            };
                            return oldData;
                        }
                        
                    });
                })

                socket_io__client_service.getHistoryChat((messages) => {
                    console.log('Historial de mensajes recibido en el cliente administrador: ', messages);
                    setHistorial(messages);
                });

                socket_io__client_service.adminListen(clientData?._id, setRoom, setChatList);

            }
            //return () => {
            // Es buena práctica apagar el socket al desmontar
            // socket_io__client_service.connectionServer.off('receiveMsg');
            //};
        }, []
    )

    console.log('Mensajes en el historial: ', chatList);
    //console.log('Chat elegido: ', chosenChat)
    //console.log('Chat: ', selectedChat)
    //console.log('True o false: ', chatList.find(chat => chat.sala === chosenChat));

    function sendMessage() {
        //setMessage({...message, transmitterId: clientData._id, timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '), keyChat: `sala-${clientData._id}`});
        if (!message.contenido) return; // No enviar mensajes vacíos
        const sala = clientData.cuenta.rol === 'CLIENTE' ? `sala-${clientData._id}` : room
        console.log('Enviando mensaje a la sala: ', sala);
        const messageToSend = {
            ...message,
            transmitterId: clientData?._id,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            keyChat: clientData.cuenta.rol === 'CLIENTE' ? `sala-${clientData._id}` : room
        };
        socket_io__client_service.sendMessage('sendMsg', messageToSend);
        if (clientData.cuenta.rol === 'CLIENTE') {
            setChatUsers({
                ...chatUsers,
                mensajes: [...chatUsers.mensajes, messageToSend],
            });
        }

        setMessage({ contenido: '' }); // Limpiar el input después de enviar
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


                        {chatList?.map((chat, pos) =>
                            <div className={chosenChat ? "chat-user active-chat" : "chat-user"} onClick={() => setChosenChat(chat.sala)}>
                                <div className="chat-user-left">
                                    <div className="chat-avatar-wrapper">
                                        <img src={chat?.datosCliente?.cuenta?.imagenCuenta} alt={chat?.datosCliente?.nombreCompleto} className="chat-user-avatar" />
                                        <span className="online-dot"></span>
                                    </div>

                                    <div>
                                        <h6>{chat?.datosCliente?.nombreCompleto}</h6>
                                        <p>{chat?.mensajes}</p>
                                    </div>
                                </div>

                                <div className="chat-meta">
                                    <small>{chat?.timestamp}</small>
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
                                <img src={clientData?._id === adminInfo?.id ? clientData?.cuenta?.imagenCuenta : adminInfo?.imagenCuenta} alt={clientData?._id === adminInfo?.id ? clientData?.nombreCompleto : adminInfo?.nombre} className="main-chat-avatar" />
                                <div>
                                    <h6>{clientData?._id === adminInfo?.id ? clientData?.nombreCompleto : adminInfo?.nombre}</h6>
                                    <span>{clientData?._id !== adminInfo?.id ? 'Administrador' : 'Cliente'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {chatUsers.mensajes.map((msg, pos) =>
                                <div className={msg?.transmitterId === clientData?._id ? "message-row user" : "message-row support"} key={pos}>
                                    {msg?.transmitterId !== clientData?._id &&
                                        <img src={adminInfo?.imagenCuenta} alt={adminInfo?.nombre} className="message-avatar" />
                                    }
                                    <div className={msg?.transmitterId === clientData._id ? "message-content user-content" : "message-content"}>
                                        <div className="message-bubble">{msg?.contenido}</div>

                                        <div className={msg?.transmitterId === clientData?._id ? "message-info user-info" : "message-info"}>
                                            <span>{msg?.transmitterId === clientData?._id ? clientData?.nombreCompleto : ''}</span>
                                            <small>{msg?.timestamp}</small>

                                            {msg?.transmitterId === clientData?._id &&
                                                <span className="message-seen">
                                                    <i className="bi bi-check2-all"></i>Visto
                                                </span>
                                            }
                                        </div>
                                    </div>

                                    {msg?.transmitterId === clientData?._id &&
                                        <img src={`${clientData?.cuenta?.imagenCuenta}`} alt={clientData?.nombreCompleto} className="message-avatar" />
                                    }
                                </div>
                            )}
                        </div>

                        <div className="chat-input-zone">
                            <input type="text" className="form-control support-input" onChange={(e) => setMessage({ ...message, contenido: e.target.value })} placeholder="Escribe un mensaje..." />
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
