import './Direcciones_1.css';
import { useLoaderData } from 'react-router-dom';
import useGlobalState from '../../../../global_state/globalState';
import { useState } from "react";

function Direcciones({ onChangeAddress }) {
    const countries = useLoaderData();
    const { setOrder, clientData, order, setPayData } = useGlobalState();

    //console.log('Pedidos en el encargo: ', order);

    return (
        <div className="px-2 py-3 mb-4">

            <h3 className="mb-4">Dirección de envío</h3>

            <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input className="input" id="nombreCompleto" name="nombreCompleto" defaultValue={order?.direccionEnvio?.nombreCompleto || ''} placeholder="Ej: Juan Pérez" onChange={onChangeAddress} />
            </div>

            <div className="form-group">
                <label className="form-label">Dirección</label>
                <input className="input" id="domicilio" name="domicilio" defaultValue={order?.direccionEnvio?.domicilio || ''} placeholder="Calle, número, piso..." onChange={onChangeAddress} />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Municipio</label>
                    <input className="input" id="municipio" name="municipio" defaultValue={order?.direccionEnvio?.municipio || ''} placeholder="Municipio" onChange={onChangeAddress} />
                </div>

                <div className="form-group">
                    <label className="form-label">Provincia</label>
                    <input className="input" id="provincia" name="provincia" defaultValue={order?.direccionEnvio?.provincia || ''} placeholder="Provincia" onChange={onChangeAddress} />
                </div>


                <div className="form-group">
                    <label className="form-label">Código Postal</label>
                    <input className="input" id="codigoPostal" name="codigoPostal" defaultValue={order?.direccionEnvio?.codigoPostal || ''} placeholder="Código postal" onChange={onChangeAddress} />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">País</label>
                <select id='pais' name="pais" className="input" defaultValue={order?.direccionEnvio?.pais || ''} onChange={onChangeAddress}>
                    <option value="">Elige tu país</option>
                    {countries.map((country, index) => (
                        <option key={index} value={country.cca2}>
                            {country.name.common}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default Direcciones;
