import useGlobalState from "../../../../../global_state/globalState";

function ModalAgregarDireccion({submit, change}) {
    const {clientData} = useGlobalState();

    return (
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
                                <input type="text" name="domicilio" className="form-control custom-input" onChange={(ev) => change(ev)} />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>Provincia</label>
                                    <input type="text" name="provincia" className="form-control custom-input" onChange={(ev) => change(ev)} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>Municipio</label>
                                    <input type="text" name="municipio" className="form-control custom-input" onChange={(ev) => change(ev)} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label>Código postal</label>
                                <input type="text" name="codigoPostal" className="form-control custom-input" onChange={(ev) => change(ev)} />
                            </div>

                            <div className="mb-3">
                                <label>País</label>
                                <input type="text" name="pais" className="form-control custom-input" onChange={(ev) => change(ev)} />
                                {/* <select name="pais" className="form-control custom-input" onChange={(ev) => change(ev)}>
                                    {
                                        countries.map((country, index) =>
                                            <option key={index}>
                                                {country.name.common}
                                            </option>
                                        )
                                    }
                                </select> */}
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer border-0">
                        <button className="btn btn-cancel" data-bs-dismiss="modal">Cancelar</button>
                        <button className="btn btn-purple" type='submit' data-bs-dismiss="modal" onClick={() => submit("Añadir")}>Guardar dirección</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalAgregarDireccion