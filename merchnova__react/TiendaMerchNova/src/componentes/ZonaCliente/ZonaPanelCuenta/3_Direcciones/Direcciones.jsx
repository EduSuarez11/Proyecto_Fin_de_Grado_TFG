import './Direcciones.css'
import { useLoaderData, useNavigate } from "react-router";
import useGlobalState from "../../../../global_state/globalState";
import { useRef, useState } from 'react';
import SuccessOrError from '../../../global_components/SuccessErrorComponent/SuccessOrError';
import ModalEliminarDireccion from './Modal_Eliminar_Direcciones/ModalEliminarDireccion';
import ModalAgregarDireccion from './Modal_Agregar_Direcciones/ModalAgregarDireccion';
import { request_profile } from '../../../Servicios/peticiones_perfil/request_profile';

function MisDirecciones() {
    const { clientData, setClientData } = useGlobalState();
    const countries = useLoaderData();
    const [direction, setDirection] = useState({});
    const navigate = useNavigate();
    const errorRef = useRef(null);
    const [message, setMessage] = useState({
        msg: '',
        successOrError: false
    });

    const [newAddress, setNewAddress] = useState({
        domicilio: '',
        provincia: '',
        municipio: '',
        codigoPostal: '',
        pais: ''
    });

    function handleInputChange(ev) {
        setNewAddress({
            ...newAddress,
            [ev.target.name]: ev.target.value
        })
    }

    async function handleSubmitAddress(action) {
        let responseData;
        let updateDir;
        let msgResponse;
        console.log('Action: ', action);

        switch (action) {
            case "Añadir":
                responseData = await request_profile.update_direction({ clientId: clientData._id, data: newAddress }, 'NewDirection');
                updateDir = [...clientData.direcciones, responseData.data];
                break;
        
            case "Eliminar":
                responseData = await request_profile.update_direction({ clientId: clientData._id, data: direction }, 'RemoveDirection');
                updateDir = clientData.direcciones.filter(dir => dir.domicilio !== responseData.data);
                break;
            default:
                break;
        }
        console.log('Respuesta de direccion: ', responseData);
        if (responseData.code === 0) {
            // Modificar los datos del state
            setClientData({...clientData, direcciones: updateDir});
            msgResponse = responseData.message; 

            // Modal de confimarcion
            const modal = new window.bootstrap.Modal('#' + errorRef.current.id);
            modal.show();
        } else {
            msgResponse = responseData.message;

            // Modal de error si falla
            const modal = new window.bootstrap.Modal('#' + errorRef.current.id);
            modal.show();
        }
        setMessage({ msg: msgResponse, successOrError: responseData.code === 0 ? true : false });
    }

    return (
        <div className="addresses-container">

            <h3 className="addresses-title">Mis direcciones</h3>

            <div className="addresses-grid">
                {
                    clientData.direcciones.map((direccion, pos) =>
                        <div className="address-card" title={`Dirección ${pos + 1}`}>
                            <div className='d-flex justify-content-between'>
                                <p className="address-name">Dirección {pos === 0 ? `${pos + 1} (Principal)` : `${pos + 1}`}</p>
                                {
                                    pos !== 0 &&
                                    <button className="delete-address-btn btn btn-sm btn-outline-danger ms-3" title="Eliminar dirección" data-bs-toggle="modal" data-bs-target="#removeAddress" onClick={() => setDirection(direccion)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                }

                            </div>
                            <p className="address-line">{direccion.domicilio}, {direccion.municipio}</p>
                            <p className="address-line">{direccion.provincia} ({direccion.codigoPostal}), {direccion.pais}</p>
                            <p className="address-phone">Tel: {clientData.cuenta.telefono ? `+34 ${clientData.cuenta.telefono}` : 'Sin añadir'}</p>
                        </div>
                    )
                }

                {/* BOTÓN AÑADIR (solo si < 3 direcciones) */}
                {
                    clientData.direcciones.length < 3 &&
                    <div className="address-card add-card" data-bs-toggle="modal" data-bs-target="#addressModal">
                        <div className="add-content">
                            <span className="plus">+</span>
                            <p>Añadir dirección</p>
                        </div>
                    </div>
                }

                <ModalAgregarDireccion submit={handleSubmitAddress}  change={handleInputChange} />

                <ModalEliminarDireccion submit={handleSubmitAddress} direction={direction} />

                <SuccessOrError errorRef={errorRef} message={message} />

            </div>

        </div>
    )
}

export default MisDirecciones;