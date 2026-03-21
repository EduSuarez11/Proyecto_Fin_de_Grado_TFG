import './Perfil.css';
import { Link, useLoaderData } from "react-router-dom";
import useGlobalState from "../../../../global_state/globalState";
import { useState } from "react";

function PerfilCuenta() {
    const { clientData } = useGlobalState();
    const countries = useLoaderData();
    const [editProfile, setEditProfile] = useState(false);
    const [formProfile, setFormProfile] = useState({});

    function onChangeInputProfile(e) {
        setFormProfile(() => ({
            ...formProfile,
            [e.target.name]: e.target.value
        }));
    }

    function handleSubmitProfile() {
        console.log('Datos nuevos: ', formProfile);
    }

    console.log('Paises obtenidos: ', countries);
    console.log('Cliente: ', clientData);
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
                                        <img src={clientData.cuenta.imagenCuenta} alt="Previsualización" class="mb-3" />
                                        <label htmlFor="imageUpload" class="btn btn-purple btn-sm w-100">
                                            <i class="bi bi-camera me-2"></i>Cambiar Foto
                                        </label>
                                        <input type="file" id="imageUpload" hidden accept="image/*" />
                                    </div>
                                </div>

                                <div className="col-md-8 ps-md-4">
                                    <h5 className="fw-bold mb-3 text-secondary">Información Personal</h5>

                                    {/* Nombre */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre Completo</label>
                                        <input
                                            type="text"
                                            name="nombreCompleto"
                                            className="form-control custom-input"
                                            placeholder="Tu nombre"
                                            defaultValue={clientData.nombreCompleto}
                                            disabled={!editProfile}
                                            onChange={onChangeInputProfile}
                                        />
                                    </div>

                                    {/* Email + Género */}
                                    <div className="row mb-4">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <label className="form-label fw-semibold">Correo Electrónico</label>
                                            <input
                                                type="email"
                                                className="form-control custom-input"
                                                value={clientData.cuenta.email}
                                                disabled
                                            />
                                            <div className="form-text small text-danger">
                                                El email no se puede cambiar.
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Género</label>
                                            <select className="form-select custom-input" name="genero" defaultValue={clientData.cuenta.genero}
                                                disabled={!editProfile} onChange={onChangeInputProfile}>
                                                <option value="">Selecciona...</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Femenino">Femenino</option>
                                                <option value="Otro">Otro</option>
                                                <option value="Neutro">Prefiero no decirlo</option>
                                            </select>
                                        </div>
                                    </div>

                                    <hr className="my-4" />

                                    {/* Dirección */}
                                    <h5 className="fw-bold mb-3 text-secondary">Dirección</h5>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Calle</label>
                                        <input
                                            type="text"
                                            name="calle"
                                            className="form-control custom-input"
                                            placeholder="Calle y número"
                                            disabled={!editProfile}
                                            onChange={onChangeInputProfile}
                                        />
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Código Postal</label>
                                            <input
                                                type="text"
                                                name="codigoPostal"
                                                className="form-control custom-input"
                                                disabled={!editProfile}
                                                onChange={onChangeInputProfile}
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Municipio</label>
                                            <input
                                                type="text"
                                                name="municipio"
                                                className="form-control custom-input"
                                                disabled={!editProfile}
                                                onChange={onChangeInputProfile}
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Provincia</label>
                                            <input
                                                type="text"
                                                name="provincia"
                                                className="form-control custom-input"
                                                disabled={!editProfile}
                                                onChange={onChangeInputProfile}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">País</label>
                                        <select type="text" name="pais" className="form-control custom-input" disabled={!editProfile}
                                            onChange={onChangeInputProfile}
                                        >
                                            <option>Selecciona tu país...</option>
                                            {
                                                countries.map((country, index) =>
                                                    <>
                                                        <img style={{ width: '30px' }} src={country.flags.svg} />
                                                        <option key={index}>
                                                            {country.name.common}
                                                        </option>
                                                    </>
                                                )
                                            }
                                        </select>
                                    </div>

                                    {/* Teléfono */}
                                    <h5 className="fw-bold mb-3 text-secondary">Contacto</h5>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">Teléfono</label>
                                        <input
                                            type="text"
                                            name="telefono"
                                            className="form-control custom-input"
                                            placeholder="638 111 222"
                                            disabled={!editProfile}
                                            onChange={onChangeInputProfile} />
                                    </div>

                                    {/* Sobre ti */}
                                    <h5 className="fw-bold mb-3 text-secondary">Sobre ti</h5>

                                    <div className="mb-4">
                                        <textarea
                                            name="sobreMi"
                                            className="form-control custom-input"
                                            rows="4"
                                            placeholder="Cuéntanos algo sobre ti..."
                                            disabled={!editProfile}
                                            onChange={onChangeInputProfile}></textarea>
                                    </div>

                                    <hr className="my-4" />

                                    {/* Seguridad */}
                                    <h5 className="fw-bold mb-3 text-secondary">Seguridad</h5>

                                    <div className="row mb-4">
                                        <Link>¿Cambiar la contraseña de tu cuenta? Pulsa aquí para restablecerla</Link>
                                    </div>

                                    {/* Botones */}
                                    <div className="d-flex justify-content-end mt-4">
                                        {
                                            !editProfile ?
                                                <button type="button" className="btn btn-purple px-4 fw-bold" onClick={() => setEditProfile(true)}>
                                                    Editar perfil
                                                </button>
                                                :
                                                <>
                                                    <button type="button" className="btn btn-outline-secondary me-2 px-4" onClick={() => setEditProfile(false)}>
                                                        Cancelar
                                                    </button>

                                                    <button type="button" className="btn btn-purple px-4 fw-bold" onClick={handleSubmitProfile}>
                                                        Guardar cambios
                                                    </button>
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