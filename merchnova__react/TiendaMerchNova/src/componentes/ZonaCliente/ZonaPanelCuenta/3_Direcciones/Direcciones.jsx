import './Direcciones.css'
import { useLoaderData, useNavigate } from "react-router";
import useGlobalState from "../../../../global_state/globalState";
import { useRef, useState } from 'react';
import Error from '../../../global_components/SuccessErrorComponent/SuccessOrError';
import SuccessOrError from '../../../global_components/SuccessErrorComponent/SuccessOrError';
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

    function handleInputChange(e) {
        setNewAddress({
            ...newAddress,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmitAddress() {
        //console.log('Direccion nueva: ', newAddress);
        const responseData = await request_profile.add_new_direction({ clientData, data: newAddress });

        console.log(responseData)
        if (responseData.code === 0) {
            setClientData(responseData.dataUpdate);
            setMessage({ msg: responseData.message, successOrError: true });
            const modal = new window.bootstrap.Modal('#' + errorRef.current.id);
            modal.show();
        } else {
            setMessage({ msg: responseData.message, successOrError: true });
            const modal = new window.bootstrap.Modal('#' + errorRef.current.id);
            modal.show();
        }
    }

    async function handleRemoveAddress() {
        const responseData = await request_profile.remove_direction(clientData, direction);
        console.log(responseData);
        if (responseData.code === 0) {
            setClientData(responseData.dataUpdate);
            setMessage({ msg: responseData.message, successOrError: true });
            const modal = new window.bootstrap.Modal('#' + errorRef.current.id);
            modal.show();
        } else {
            setMessage({ msg: responseData.message, successOrError: true });
            const modal = new window.bootstrap.Modal('#' + errorRef.current.id);
            modal.show();
        }
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
                            <p className="address-phone">+34 {clientData.cuenta.telefono}</p>
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

                <div className="modal fade" id="addressModal" tabIndex="-1" aria-hidden='true'>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content custom-modal">

                            {/* HEADER */}
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Añadir dirección</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            {/* BODY */}
                            <div className="modal-body">
                                <div className="address-form">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label>Nombre</label>
                                            <input type="text" name="nombre" className="form-control custom-input" value={`Dirección ${clientData.direcciones.length + 1}`} disabled />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label>Teléfono</label>
                                            <input type="text" name="telefono" className="form-control custom-input" value={clientData.cuenta?.telefono || ''} disabled />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Dirección</label>
                                        <input type="text" name="domicilio" className="form-control custom-input" onChange={handleInputChange} />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label>Provincia</label>
                                            <input type="text" name="provincia" className="form-control custom-input" onChange={handleInputChange} />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Municipio</label>
                                            <input type="text" name="municipio" className="form-control custom-input" onChange={handleInputChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Código postal</label>
                                        <input type="text" name="codigoPostal" className="form-control custom-input" onChange={handleInputChange} />
                                    </div>

                                    <div className="mb-3">
                                        <label>País</label>
                                        <select type="text" name="pais" className="form-control custom-input" onChange={handleInputChange}>
                                            {
                                                countries.map((country, index) =>
                                                    <option key={index}>
                                                        {country.name.common}
                                                    </option>
                                                )
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="modal-footer border-0">
                                <button className="btn btn-cancel" data-bs-dismiss="modal">Cancelar</button>
                                <button className="btn btn-purple" type='submit' data-bs-dismiss="modal" onClick={handleSubmitAddress}>Guardar dirección</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="modal fade" id='removeAddress' tabIndex="-1" aria-hidden='true'>
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Eliminar dirección</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>¿Estás seguro de eliminar está dirección, los cambios no se podrán deshacer?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleRemoveAddress}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <SuccessOrError errorRef={errorRef} message={message} />

            </div>

        </div>
    )
}

export default MisDirecciones;