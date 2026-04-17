import './Perfil.css';
import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import useGlobalState from "../../../../global_state/globalState";
import { useEffect, useRef, useState } from "react";

function PerfilCuenta() {
    const { clientData, setClientData } = useGlobalState();
    const countries = useLoaderData();
    const location = useLocation();
    const [editProfile, setEditProfile] = useState(false);
    const [formProfile, setFormProfile] = useState({ email: clientData.cuenta.email });
    const imageRef = useRef(null);
    const navigate = useNavigate();


    const [validateProfile, setValidateProfile] = useState({
        nombre: false,
        telefono: false,
        codigoPostal: false,
        domicilio: false,
        municipio: false,
        provincia: false,
        sobreMi: false
    })


    const validators = {
        nombre: (value) => value.length >= 6 && value.length <= 50,
        telefono: (value) => /^\d{9}$/.test(value),
        codigoPostal: (value) => /^[a-zA-Z0-9\s-]{3,12}$/.test(value),
        calle: (value) => /^[a-zA-Z0-9.,\s\-#°ª]{8,60}$/i.test(value),
        municipio: (value) => value.length >= 2 && value.length <= 20,
        provincia: (value) => value.length >= 2 && value.length <= 20,
        sobreMi: (value) => value.length <= 200
    }

    const validateField = (fieldName, value) => {
        setValidateProfile({
            ...validateProfile,
            [fieldName]: validators[fieldName](value)
        })
    }


    function onChangeInputProfile(e) {
        setFormProfile(() => ({
            ...formProfile,
            [e.target.name]: e.target.value
        }));
    }


    function changeImagePreview(ev) {
        const archivo = ev.target.files[0];
        console.log('Archivo: ', archivo);
        if (archivo) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                imageRef.current.src = ev.target.result;
                console.log('Archivo elegido: ', ev.target.result);
                setFormProfile(oldData => ({
                    ...oldData,
                    'imagenCuenta': ev.target.result
                }))
            }
            reader.readAsDataURL(archivo);
            return;
        }
    }

    async function handleSubmitProfile() {
        try {
            console.log('Datos nuevos: ', formProfile);

            const requestNewData = await fetch('http://localhost:3000/api/Cliente/Perfil/Update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formProfile)
            });

            const responseNewData = await requestNewData.json();
            console.log('Respuesta node:', responseNewData);
            setClientData(responseNewData.data.newClientData);
            navigate('/', { state: { msg: `${responseNewData.message}` } });
        } catch (error) {
            console.log('Error al actualizar datos: ', error);
        }
    }



    //console.log('Paises obtenidos: ', countries);
    //console.log('Cliente: ', clientData);
    return (
        <div className="card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0 fw-bold">Mi Perfil</h2>
                <div className="text-end">
                    <span className="badge bg-success mb-1">Cuenta Activa</span>
                </div>
            </div>

            <form>
                <div className="row">
                    <div className="col-md-4 text-center mb-4 border-end">
                        <div className="profile-img-container mx-auto">
                            <img src={clientData.cuenta.imagenCuenta} ref={imageRef} alt="Previsualización" className="mb-3" style={{ width: '120px', height: '120px' }} />
                            <label htmlFor="imageUpload" className={!editProfile ? `btn btn-purple btn-sm w-100 opacity` : `btn btn-purple btn-sm w-100`} >
                                <i className="bi bi-camera me-2"></i>Cambiar Foto
                            </label>
                            <input type="file" id="imageUpload" hidden accept="image/*" disabled={clientData.cuenta.tipo !== 'discord' || clientData.cuenta.tipo !== 'google' ? !editProfile : true} onChange={changeImagePreview} />
                            {
                                clientData.cuenta.tipo === 'discord' || clientData.cuenta.tipo === 'google' &&
                                <div className="form-text small text-danger">
                                    No puedes cambiar tu foto de perfil si has iniciado sesión con Discord o Google
                                </div>
                            }
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
                                disabled={clientData.cuenta.tipo !== 'discord' ? !editProfile : true}
                                onChange={(ev) => {
                                    onChangeInputProfile(ev);
                                    validateField('nombre', ev.target.value);
                                }}
                            />
                            {
                                formProfile.nombreCompleto != null && (
                                    formProfile.nombreCompleto.length > 0 ?
                                        <span className={validateProfile.nombre ? "text-success small" : "text-danger small"}>{validateProfile.nombre ? '✅ Nombre válido' : '❌ Nombre inválido'}</span>
                                        :
                                        <span className="small text-danger">* Nombre obligatorio</span>
                                )
                            }

                            {
                                clientData.cuenta.tipo === 'discord' &&
                                <div className="form-text small text-danger">No puedes cambiar tu foto de perfil si has iniciado sesión con Discord o Google</div>
                            }
                        </div>

                        {/* Email + Género */}
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3 mb-md-0">
                                <label className="form-label fw-semibold">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control custom-input"
                                    value={clientData.cuenta.email}
                                    disabled
                                    onChange={onChangeInputProfile}
                                />
                                <div className="form-text small text-danger">El email no se puede cambiar.</div>
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
                            <label className="form-label fw-semibold">Domicilio</label>
                            <input
                                type="text"
                                name="calle"
                                className="form-control custom-input"
                                placeholder="Calle / Avenida ..., portal y número"
                                disabled={!editProfile}
                                defaultValue={clientData.direcciones[0]?.calle || ''}
                                onChange={(ev) => {
                                    onChangeInputProfile(ev);
                                    validateField('domicilio', ev.target.value);
                                }}
                            />
                            {
                                formProfile.calle != null && (
                                    formProfile.calle.length > 0 ?
                                        <span className={validateProfile.calle ? "text-success small" : "text-danger small"}>{validateProfile.calle ? '✅ Domicilio válido' : '❌ Domicilio inválido'}</span>
                                        :
                                        <span className="small text-danger">* Domicilio obligatorio</span>
                                )
                            }
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Código Postal</label>
                                <input
                                    type="text"
                                    name="codigoPostal"
                                    className="form-control custom-input"
                                    defaultValue={clientData.direcciones[0]?.codigoPostal || ''}
                                    disabled={!editProfile}
                                    onChange={(ev) => {
                                        onChangeInputProfile(ev);
                                        validateField('codigoPostal', ev.target.value);
                                    }}
                                />
                                {
                                    formProfile.codigoPostal != null && (
                                        formProfile.codigoPostal.length > 0 ?
                                            <span className={validateProfile.codigoPostal ? "text-success small" : "text-danger small"}>{validateProfile.codigoPostal ? '✅ Código postal válido' : '❌ Código postal inválido'}</span>
                                            :
                                            <span className="small text-danger">* Código Postal obligatorio</span>
                                    )
                                }
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Municipio</label>
                                <input
                                    type="text"
                                    name="municipio"
                                    className="form-control custom-input"
                                    defaultValue={clientData.direcciones[0]?.municipio || ''}
                                    disabled={!editProfile}
                                    onChange={(ev) => {
                                        onChangeInputProfile(ev);
                                        validateField('municipio', ev.target.value);
                                    }}
                                />
                                {
                                    formProfile.municipio != null && (
                                        formProfile.municipio.length > 0 ?
                                            <span className={validateProfile.municipio ? "text-success small" : "text-danger small"}>{validateProfile.municipio ? '✅ Municipio válido' : '❌ Municipio inválido'}</span>
                                            :
                                            <span className="small text-danger">* Municipio obligatorio</span>
                                    )
                                }
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Provincia</label>
                                <input
                                    type="text"
                                    name="provincia"
                                    className="form-control custom-input"
                                    defaultValue={clientData.direcciones[0]?.provincia || ''}
                                    disabled={!editProfile}
                                    onChange={(ev) => {
                                        onChangeInputProfile(ev);
                                        validateField('provincia', ev.target.value);
                                    }}
                                />
                                {
                                    formProfile.provincia != null && (
                                        formProfile.provincia.length > 0 ?
                                            <span className={validateProfile.provincia ? "text-success small" : "text-danger small"}>{validateProfile.provincia ? '✅ Provincia válida' : '❌ Provincia inválida'}</span>
                                            :
                                            <span className="small text-danger">* Provincia obligatoria</span>
                                    )
                                }
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">País</label>
                            <select type="text" name="pais" className="form-control custom-input" disabled={!editProfile}
                                onChange={onChangeInputProfile} defaultValue={clientData.direcciones[0]?.pais || ''}
                            >
                                <option>Selecciona tu país...</option>
                                {
                                    countries.map((country, index) =>
                                        <>
                                            {/* <img style={{ width: '30px' }} src={country.flags.svg} /> */}
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
                                defaultValue={clientData.cuenta.telefono != null ? clientData.cuenta.telefono : ''}
                                disabled={clientData.cuenta.tipo !== 'discord' || clientData.cuenta.tipo !== 'google' ? !editProfile : true}
                                onChange={(ev) => {
                                    onChangeInputProfile(ev);
                                    validateField('telefono', ev.target.value);
                                }} />

                            {
                                formProfile.telefono != null && (
                                    formProfile.telefono.length > 0 ?
                                        <span className={validateProfile.telefono ? "text-success small" : "text-danger small"}>{validateProfile.telefono ? '✅ Teléfono válido' : '❌ Teléfono inválido'}</span>
                                        :
                                        <span className="small text-danger">* Teléfono obligatorio</span>
                                )
                            }

                            {
                                clientData.cuenta.tipo === 'discord' || clientData.cuenta.tipo === 'google' &&
                                <div className="form-text small text-danger">
                                    No puedes cambiar tu teléfono si has iniciado sesión con Discord o Google
                                </div>
                            }
                        </div>

                        {/* Sobre ti */}
                        <h5 className="fw-bold mb-3 text-secondary">Sobre ti</h5>

                        <div className="mb-4">
                            <textarea
                                name="sobreMi"
                                className="form-control custom-input"
                                rows="4"
                                placeholder="Cuéntanos algo sobre ti..."
                                defaultValue={clientData.cuenta.sobreMi != null ? clientData.cuenta.sobreMi : ''}
                                disabled={!editProfile}
                                onChange={(ev) => {
                                    onChangeInputProfile(ev);
                                    validateField('sobreMi', ev.target.value);
                                }}>
                            </textarea>

                            {
                                formProfile.sobreMi != null && (
                                    formProfile.sobreMi.length > 0 &&
                                    <span className={validateProfile.sobreMi ? "text-success small" : "text-danger small"}>{validateProfile.sobreMi ? '✅ Descripción válida' : '❌ Descripción inválida'}</span>
                                )
                            }
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
    );
}

export default PerfilCuenta;