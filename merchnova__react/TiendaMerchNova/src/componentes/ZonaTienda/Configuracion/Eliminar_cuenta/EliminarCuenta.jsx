import './EliminarCuenta.css';

function EliminarCuenta() {
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
                    <h4>Esta acción es irreversible</h4>

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
                    <p className="delete-warning">⚠️ Asegúrate de que realmente deseas continuar antes de confirmar esta acción.</p>
                </div>

                <div className="delete-actions">
                    <button className="btn btn-outline-purple">Cancelar</button>
                    <button className="btn btn-delete">Eliminar cuenta</button>
                </div>
            </div>
        </div>
    )

}

export default EliminarCuenta;
