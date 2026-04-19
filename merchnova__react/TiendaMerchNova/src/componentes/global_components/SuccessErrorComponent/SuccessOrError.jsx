import './SuccessOrError.css'
function SuccessOrError({ errorRef, message }) {
    //console.log('Message:', message)
    console.log('True or false: ', message)
    return (
        <div className="modal fade" id="successErrorModal" tabIndex="-1" ref={errorRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className={message.successOrError ? 'modal-content success-modal modal-success' : 'modal-content error-modal modal-error'} >

                    <div className="modal-header border-0">
                        <h5 className={message.successOrError ? `modal-title text-success` : 'modal-title text-danger'}>{message.successOrError ? 'Éxito' : 'Error'}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div className="modal-body text-center">
                        <div className={message.successOrError ? 'success-icon' : 'error-icon'}>{message.successOrError ? '✓' : '✕'} </div>
                        <p className={message.successOrError ? 'success-text' : 'error-text'}>{message.msg}</p>
                    </div>

                    <div className="modal-footer border-0 justify-content-center">
                        <button className="btn btn-purple" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default SuccessOrError;
