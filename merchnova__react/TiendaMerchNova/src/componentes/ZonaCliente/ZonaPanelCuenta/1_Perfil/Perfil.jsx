import './Perfil.css';
import { Link } from "react-router-dom";
import useGlobalState from "../../../../global_state/globalState";
import { useState } from "react";

function PerfilCuenta() {
    const { clientData } = useGlobalState();
    const [editProfile, setEditProfile] = useState(false);

    console.log('Cuenta: ', clientData);
    return (
        <div class="container py-5">
            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="card p-4">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2 class="mb-0 fw-bold">Mi Perfil</h2>
                            <div class="text-end">
                                <span class="badge bg-success mb-1">Cuenta Activa</span>
                            </div>
                        </div>

                        <form>
                            <div class="row">
                                <div class="col-md-4 text-center mb-4 border-end">
                                    <div class="profile-img-container mx-auto">
                                        <img src={clientData.cuenta.imagenCuenta} alt="Previsualización" class="mb-3"/>
                                        <label htmlFor="imageUpload" class="btn btn-purple btn-sm w-100">
                                            <i class="bi bi-camera me-2"></i>Cambiar Foto
                                        </label>
                                        <input type="file" id="imageUpload" hidden accept="image/*" />
                                    </div>
                                </div>

                                <div class="col-md-8 ps-md-4">
                                    <h5 class="fw-bold mb-3 text-secondary">Información Personal</h5>

                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Nombre Completo</label>
                                        <input type="text" class="form-control custom-input" placeholder="Tu nombre"
                                            defaultValue={clientData.nombreCompleto} disabled={!editProfile} />
                                    </div>

                                    <div class="row mb-4">
                                        <div class="col-md-6 mb-3 mb-md-0">
                                            <label class="form-label fw-semibold">Correo Electrónico</label>
                                            <input type="email" class="form-control custom-input" placeholder={clientData.cuenta.email} disabled />
                                            <div class="form-text small text-danger">El email no se puede cambiar.</div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold">Género</label>
                                            <select class="form-select custom-input" defaultValue={clientData.cuenta.genero} disabled={!editProfile}>
                                                <option value="">Selecciona...</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                                <option value="Otro">Otro</option>
                                                <option value="Neutro">Prefiero no decirlo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <hr class="my-4" />

                                    <h5 class="fw-bold mb-3 text-secondary">Seguridad</h5>

                                    <div class="row mb-4">
                                        <Link>¿Cambiar la contraseña de tu cuenta? Pulsa aquí para restablecerla</Link>
                                    </div>

                                    <div class="d-flex justify-content-end mt-4">

                                        {
                                            !editProfile ?
                                                <button type="button" class="btn btn-purple px-4 fw-bold" onClick={() => setEditProfile(true)}>Editar perfil</button>
                                                :
                                                <>
                                                    <button type="button" class="btn btn-outline-secondary me-2 px-4" onClick={() => setEditProfile(false)}>Cancelar</button>
                                                    <button type="button" class="btn btn-purple px-4 fw-bold">Guardar cambios</button>
                                                </>
                                        }

                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>


                <div class="col-lg-4">
                    <div class="card p-3">
                        <h4 class="px-3 mb-3 fw-bold">Mi Cuenta</h4>
                        <div class="list-group list-group-flush">

                            <a href="#" class="list-group-item list-group-item-action border-0 py-3 sidebar-link active-link">
                                <i class="bi bi-person me-2"></i> Perfil
                            </a>
                            <a href="#" class="list-group-item list-group-item-action border-0 py-3 sidebar-link">
                                <i class="bi bi-box-seam me-2"></i> Mis Pedidos
                            </a>
                            <a href="#" class="list-group-item list-group-item-action border-0 py-3 sidebar-link">
                                <i class="bi bi-geo-alt me-2"></i> Mis Direcciones
                            </a>
                            <a href="#" class="list-group-item list-group-item-action border-0 py-3 sidebar-link">
                                <i class="bi bi-cart3 me-2"></i> Mi Carrito
                            </a>
                            <hr class="text-muted my-2" />
                            <a href="#"
                                class="list-group-item list-group-item-action border-0 py-3 text-danger fw-bold sidebar-link-danger">
                                <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilCuenta;