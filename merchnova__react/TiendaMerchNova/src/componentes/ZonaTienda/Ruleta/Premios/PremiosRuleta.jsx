import { useState } from "react";
import { Link } from 'react-router-dom'
import "./PremiosRuleta.css";

function PremiosRuleta() {
    const premios = [
        "50 pts", "100 pts", "25 pts", "500 pts", "75 pts", "10 pts",
        "150 pts", "250 pts", "1000 pts", "100 pts", "200 pts", "750 pts"
    ];

    return (
        <div className="modal fade" id="modalPremiosRuleta" tabIndex="-1" aria-labelledby="modalPremiosRuletaLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content premios-modal-content">
                    <div className="modal-header premios-modal-header">
                        <h1 className="modal-title fs-5" id="modalPremiosRuletaLabel">Premios de la ruleta</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>

                    <div className="modal-body premios-modal-body">
                        <div className="row g-3">
                            {premios.map((premio, pos) =>
                                <div className="col-12 col-md-4" key={pos}>
                                    <div className="premio-item">
                                        <span className="premio-puntos">{premio}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer premios-modal-footer">
                        <button type="button" className="btn premios-modal-boton-cerrar" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PremiosRuleta;