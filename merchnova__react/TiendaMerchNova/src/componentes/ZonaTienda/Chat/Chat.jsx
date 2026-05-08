import { useEffect } from 'react';
import useGlobalState from '../../../global_state/globalState';
import './Chat.css'
import { useState } from "react";
import socket_io__client_service from '../../Servicios/socket_io_client/socket_io__client_service';

function Chat() {
    const { clientData } = useGlobalState();
    const [message, setMessage] = useState('');
    const [historial, setHistorial] = useState([]);

    useEffect(
        () => {
            if (clientData.cuenta.rol === 'CLIENTE') {
                // Conectar al servidor de Socket.IO
                socket_io__client_service.joinRoom(clientData?._id);
                socket_io__client_service.listenMessages((data) => {
                    console.log('Nuevo mensaje recibido en el cliente user: ', data);
                    const newMessage = data;
                    setHistorial([...historial, newMessage]);
                });
            } else {
                socket_io__client_service.adminListen(clientData?._id);
                socket_io__client_service.listenMessages((data) => {
                    console.log('Nuevo mensaje recibido en el cliente administrador: ', data);
                    const newMessage = data;
                    setHistorial([...historial, newMessage]);
                })
            }
        }, []
    )

    function sendMessage() {
        //setMessage({...message, transmitterId: clientData._id, timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '), keyChat: `sala-${clientData._id}`});
        const messageToSend = {
            ...message,
            transmitterId: clientData._id,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            keyChat: `sala-${clientData._id}`
        };
        socket_io__client_service.sendMessage('sendMsg', messageToSend);
    }

    return (
        <div className="support-wrapper container-fluid">
            <div className="support-layout">
                {/* SIDEBAR */}
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

                    <div className="chat-user active-chat">
                        <div className="chat-user-left">
                            <div className="chat-avatar-wrapper">
                                <img src="/images/avatar1.jpg" alt="" className="chat-user-avatar" />
                                <span className="online-dot"></span>
                            </div>

                            <div>
                                <h6>Carlos Martínez</h6>
                                <p>Tengo un problema con mi pedido...</p>
                            </div>
                        </div>

                        <div className="chat-meta">
                            <small>16:42</small>
                            <span className="unread-badge">2</span>
                        </div>
                    </div>

                    <div className="chat-user">
                        <div className="chat-user-left">
                            <div className="chat-avatar-wrapper">
                                <img src="/images/avatar2.jpg" alt="" className="chat-user-avatar" />
                                <span className="online-dot"></span>
                            </div>

                            <div>
                                <h6>Laura Sánchez</h6>
                                <p>¿Cuándo llegará mi pedido?</p>
                            </div>
                        </div>

                        <div className="chat-meta">
                            <small>15:10</small>
                        </div>
                    </div>

                    <div className="chat-user">
                        <div className="chat-user-left">
                            <div className="chat-avatar-wrapper">
                                <img src="/images/avatar3.jpg" alt="" className="chat-user-avatar" />

                                <span className="offline-dot"></span>
                            </div>

                            <div>
                                <h6>David Gómez</h6>
                                <p>No puedo realizar el pago.</p>
                            </div>
                        </div>

                        <div className="chat-meta">
                            <small>Ayer</small>
                        </div>
                    </div>
                </div>

                <div className="support-main-chat">
                    <div className="chat-main-header">
                        <div className="main-user-info">
                            <img src="/images/avatar1.jpg" alt="" className="main-chat-avatar" />
                            <div>
                                <h6>Carlos Martínez</h6>
                                <span>Cliente activo</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat-messages">
                        <div className="message-row support">
                            <img src="/images/support-avatar.png" alt="" className="message-avatar" />

                            <div className="message-content">
                                <div className="message-bubble">Hola 👋 ¿En qué podemos ayudarte?</div>

                                <div className="message-info">
                                    <span>Soporte</span>
                                    <small>16:40</small>
                                </div>
                            </div>
                        </div>

                        <div className="message-row user">
                            <div className="message-content user-content">
                                <div className="message-bubble">Tengo un problema con mi pedido.</div>

                                <div className="message-info user-info">
                                    <small>16:42</small>

                                    <span className="message-seen">
                                        <i className="bi bi-check2-all"></i>Visto
                                    </span>
                                </div>
                            </div>

                            <img src="/images/avatar1.jpg" alt="" className="message-avatar" />
                        </div>
                    </div>

                    <div className="chat-input-zone">
                        <input type="text" className="form-control support-input" onChange={(e) => setMessage({...message, contenido: e.target.value})} placeholder="Escribe un mensaje..." />
                        <button className="btn btn-send" onClick={sendMessage} >
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;
