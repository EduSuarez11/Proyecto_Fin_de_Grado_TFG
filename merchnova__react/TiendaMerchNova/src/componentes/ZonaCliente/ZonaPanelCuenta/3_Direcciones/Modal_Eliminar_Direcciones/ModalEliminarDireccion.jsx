function ModalEliminarDireccion({submit, direction}) {
    return (
        <div className="modal fade" id='removeAddress' tabIndex="-1" aria-hidden='true'>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Eliminar dirección</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>¿Estás seguro de eliminar la siguiente dirección: <strong>{direction.domicilio}, {direction.municipio} ({direction.provincia}).</strong> Los cambios no se podrán deshacer?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => submit("Eliminar")}>Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalEliminarDireccion;