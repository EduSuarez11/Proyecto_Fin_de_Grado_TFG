import './EliminarCuenta.css';
import useGlobalState from '../../../../global_state/globalState';
import { request_profile } from '../../../Servicios/peticiones_perfil/request_profile';
import { useNavigate } from 'react-router';
import { useState } from 'react';

function EliminarCuenta() {

    const { clientData, logOut } = useGlobalState();
    const [confirm, setConfirm] = useState('');
    const navigate = useNavigate();

    async function deleteAccount() {
        const req = await request_profile.delete_account(clientData);
        if (req.code === 0) {
            logOut();
            navigate('/');
        }
    }

    return (
        <div className="delete-container container">
            <div className="delete-header">
                <h2>Eliminar cuenta</h2>
                <p>Gestiona la eliminación permanente de tu cuenta</p>
            </div>

            <div className="delete-card">
                <div className="delete-icon">
                    <i className="bi bi-exclamation-triangle"></i>
                </div>

                <div className="delete-content">
                    <h4>¡Atención! Esta acción es irreversible</h4>

                    <p>Estás a punto de eliminar tu cuenta de forma permanente.
                        Esta acción no se puede deshacer y conlleva la eliminación total de todos tus datos asociados.
                    </p>

                    <p>Al eliminar tu cuenta, perderás el acceso a tu historial de pedidos, direcciones guardadas,
                        configuraciones personalizadas y cualquier otra información vinculada a tu perfil. Además,
                        no podrás recuperar tus datos una vez completado el proceso.
                    </p>

                    <p>Si tienes pedidos en curso, te recomendamos esperar a que se completen antes de proceder.
                        En caso de tener incidencias o dudas, puedes contactar con soporte antes de eliminar tu cuenta.
                    </p>
                    <p className="delete-warning">⚠️ Asegúrate de que realmente deseas continuar antes de confirmar esta acción.
                        Una vez realizado la acción, sera redirigido al inicio de la página web.
                    </p>
                </div>

                <div className="delete-actions">
                    <button className="btn btn-delete" data-bs-toggle="modal" data-bs-target="#deleteAccountModal">Eliminar cuenta</button>
                </div>

                <div className="modal fade" id="deleteAccountModal" tabIndex="-1" aria-labelledby="deleteAccountModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">

                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title d-flex align-items-center" id="deleteAccountModalLabel">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Eliminar cuenta
                                </h5>

                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                            </div>


                            <div className="modal-body p-4">

                                <div className="text-center mb-4">
                                    <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center"
                                        style={{width: '80px', height: '80px'}} >
                                        <i className="bi bi-trash-fill text-danger fs-1"></i>
                                    </div>
                                </div>

                                <h4 className="text-center fw-bold mb-3">
                                    ¿Estás seguro de que deseas eliminar tu cuenta?
                                </h4>

                                <p className="text-muted text-center mb-4">
                                    Esta acción es <strong>permanente</strong> y no se puede deshacer.
                                    Se eliminarán todos tus datos, configuraciones y acceso a la plataforma.
                                </p>


                                <div className="alert alert-warning border-0">
                                    <h6 className="fw-bold mb-2">
                                        <i className="bi bi-info-circle-fill me-1"></i>
                                        Antes de continuar:
                                    </h6>

                                    <ul className="mb-0 ps-3">
                                        <li>Perderás acceso a tu historial y configuraciones.</li>
                                        <li>No podrás recuperar la cuenta posteriormente.</li>
                                        <li>Todos los datos asociados serán eliminados definitivamente.</li>
                                    </ul>
                                </div>


                                <div className="mt-4">
                                    <label htmlFor="confirmDelete" className="form-label fw-semibold">
                                        Escribe <span class="text-danger">ELIMINAR</span> para confirmar:
                                    </label>

                                    <input type="text" class="form-control" id="confirmDelete" placeholder="Escribe ELIMINAR" onChange={(ev) => setConfirm(ev.target.value)} />
                                </div>
                            </div>

                            <div class="modal-footer border-0 px-4 pb-4">
                                <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancelar</button>

                                <button type="button" class="btn btn-danger px-4" id="deleteAccountBtn" data-bs-dismiss="modal" onClick={deleteAccount} disabled={confirm !== 'ELIMINAR'}>
                                    <i class="bi bi-trash-fill me-1"></i>Eliminar cuenta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default EliminarCuenta;
