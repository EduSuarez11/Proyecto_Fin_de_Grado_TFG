import useGlobalState from '../../../../../global_state/globalState';
import './ModalCanje.css';

function ModalCanje({ product, puntos }) {
    const { clientData } = useGlobalState();

    //console.log('Producto: ', product, puntos);
    return (
        <div className="modal fade" id={`modalConfirmarCanje`} tabIndex="-1" aria-labelledby={`modalConfirmarCanjeLabel`} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content confirmar-canje-modal">
                    <div className="modal-header confirmar-canje-header">
                        <h1 className="modal-title fs-5" id="modalConfirmarCanjeLabel">Confirmar canje</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>

                    <div className="modal-body confirmar-canje-body">
                        <p className="confirmar-canje-description">
                            Estás a punto de canjear el siguiente producto:
                        </p>

                        <div className="confirmar-canje-producto">                            
                            <div className="confirmar-canje-imagen">
                                <img src={product?.imagen} alt={product?.nombre} />
                            </div>

                            <div className="confirmar-canje-info">
                                <h2 className="confirmar-canje-nombre">{product?.nombre}</h2>

                                <div className="confirmar-canje-coste">
                                    <span className="confirmar-canje-puntos">{puntos || 0}</span>
                                    <span className="confirmar-canje-puntos-label">puntos</span>
                                </div>
                            </div>
                        </div>

                        <div className="confirmar-canje-resumen">
                            <div className="confirmar-canje-resumen-item">
                                <span>Puntos disponibles</span>
                                <strong className={clientData?.cuenta.puntos < puntos ? "text-danger" : "text-success"}>{clientData?.cuenta.puntos} puntos</strong>
                            </div>

                            <div className="confirmar-canje-resumen-item">
                                <span>Coste del producto</span>

                                <strong>{puntos || 0} puntos</strong>
                            </div>

                            <div className="confirmar-canje-resumen-separador"></div>

                            <div className="confirmar-canje-resumen-item confirmar-canje-restantes">
                                <span>Puntos restantes</span>
                                <span className={clientData?.cuenta.puntos < puntos ? "text-danger fw-semibold small" : "text-success"} >{clientData?.cuenta.puntos < puntos ? "No dispones de puntos suficientes" : (puntos - clientData?.cuenta.puntos)}</span>
                            </div>
                        </div>

                        <p className="confirmar-canje-aviso">Una vez confirmado el canje, los puntos serán descontados de tu cuenta.</p>
                    </div>

                    <div className="modal-footer confirmar-canje-footer">
                        <button type="button" className="btn confirmar-canje-cancelar" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" className="btn confirmar-canje-confirmar" data-bs-dismiss="modal">Confirmar canje</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalCanje;