import './Perfil.css';
import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import useGlobalState from "../../../../global_state/globalState";
import { useEffect, useRef, useState } from "react";
import { request_profile } from '../../../Servicios/peticiones_perfil/request_profile';

function PerfilCuenta() {
    const { clientData, setClientData } = useGlobalState();
    const countries = useLoaderData();
    const location = useLocation();
    const [editProfile, setEditProfile] = useState(false);
    const [formProfile, setFormProfile] = useState({});
    const imageRef = useRef(null);
    const navigate = useNavigate();


    const [validateProfile, setValidateProfile] = useState({
        nombre: clientData?.nombreCompleto !== null,
        telefono: clientData?.cuenta?.telefono !== null,
        codigoPostal: clientData?.direcciones[0]?.codigoPostal ? true : false,
        domicilio: clientData?.direcciones[0]?.domicilio ? true : false,
        municipio: clientData?.direcciones[0]?.municipio ? true : false,
        provincia: clientData?.direcciones[0]?.provincia ? true : false,
        pais: clientData?.direcciones[0]?.pais ? true : false,
        sobreMi: false
    })


    const validators = {
        nombre: (value) => value.length >= 6 && value.length <= 50,
        telefono: (value) => /^\d{9}$/.test(value),
        codigoPostal: (value) => /^[a-zA-Z0-9\s-]{3,8}$/.test(value),
        domicilio: (value) => /^[a-zA-Z0-9.,\s\-#°ºª]{8,60}$/i.test(value),
        municipio: (value) => value.length >= 2 && value.length <= 20,
        pais: (value) => value === 'Ninguno' ? false : true,
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
                //console.log('Archivo elegido: ', ev.target.result);
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
            const responseNewData = await request_profile.request_update(formProfile, clientData);
            console.log('Respuesta node:', responseNewData);
            setClientData(responseNewData.data.newClientData);
            navigate('/', { state: { msg: `${responseNewData.message}` } });
        } catch (error) {
            console.log('Error al actualizar datos: ', error);
        }
    }

    return (
        <div className="card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0 fw-bold" style={{ color: '#6a0dad' }}>Mi Perfil</h2>
                <div className="text-end">
                    <span className="badge bg-info mb-1 fw-medium text-black">Tipo de cuenta - {clientData?.cuenta?.tipo}</span>
                </div>
            </div>

            <form>
                <div className="row">
                    <div className="col-md-4 text-center mb-4 border-end">
                        <div className="container mx-auto d-flex justify-content-center align-items-center flex-column">
                            <img src={clientData?.cuenta?.imagenCuenta} ref={imageRef} alt="Previsualización" className="mb-3 img-avatar" />
                            <label htmlFor="imageUpload" className={(!editProfile || clientData?.cuenta?.tipo === 'discord' || clientData?.cuenta?.tipo === 'google') ? `btn btn-save-img btn-sm w-75` : `btn btn-save btn-sm w-75`} >
                                <i className="bi bi-camera me-2"></i>Cambiar Foto
                            </label>
                            <input type="file" id="imageUpload" hidden accept="image/*" disabled={(clientData?.cuenta?.tipo !== 'discord' && clientData?.cuenta?.tipo !== 'google') ? !editProfile : true} onChange={changeImagePreview} />
                            {
                                (clientData?.cuenta?.tipo === 'discord' || clientData?.cuenta?.tipo === 'google') &&
                                <div className="form-text small text-danger">
                                    No puedes cambiar tu foto de perfil de Discord o Google.
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
                                defaultValue={clientData?.nombreCompleto}
                                disabled={(clientData?.cuenta?.tipo !== 'discord' && clientData?.cuenta?.tipo !== 'google') ? !editProfile : true}
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
                                (clientData?.cuenta?.tipo === 'discord' || clientData?.cuenta?.tipo === 'google') &&
                                <p className="form-text small text-danger">No puedes cambiar tu foto de perfil si has iniciado sesión con Discord o Google</p>
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
                                    value={clientData?.cuenta?.email}
                                    disabled
                                    onChange={onChangeInputProfile}
                                />
                                <div className="form-text small text-danger">El email no se puede cambiar.</div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Género</label>
                                <select className="form-select custom-input" name="genero" defaultValue={clientData?.cuenta?.genero}
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
                        <h5 className="fw-bold mb-3 text-secondary">Dirección (Envío)</h5>
                        {clientData?.direcciones?.length === 0 && 
                            <p className='text-danger small'>Es necesario rellenar las datos de dirección a la hora de realizar compras.</p>
                        }
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Domicilio</label>
                            <input
                                type="text"
                                name="domicilio"
                                className="form-control custom-input"
                                placeholder="Calle / Avenida ..., portal y número"
                                disabled={!editProfile}
                                defaultValue={clientData?.direcciones[0]?.domicilio || ''}
                                onChange={(ev) => {
                                    onChangeInputProfile(ev);
                                    validateField('domicilio', ev.target.value);
                                }}
                            />
                            {
                                formProfile.domicilio != null && (
                                    formProfile.domicilio.length > 0 ?
                                        <span className={validateProfile.domicilio ? "text-success small" : "text-danger small"}>{validateProfile.domicilio ? '✅ Domicilio válido' : '❌ Domicilio inválido'}</span>
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
                                    defaultValue={clientData?.direcciones[0]?.codigoPostal || ''}
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
                                            <span className="small text-danger">* CP obligatorio</span>
                                    )
                                }
                            </div>

                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Municipio</label>
                                <input
                                    type="text"
                                    name="municipio"
                                    className="form-control custom-input"
                                    defaultValue={clientData?.direcciones[0]?.municipio || ''}
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
                                    defaultValue={clientData?.direcciones[0]?.provincia || ''}
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
                            <select type="text" name="pais" value={clientData?.direcciones[0]?.pais} className="form-control custom-input" disabled={!editProfile}
                                onChange={(ev) => {
                                    onChangeInputProfile(ev)
                                    validateField('pais', ev.target.value);
                                }}
                            >
                                <option value='Ninguno'>Selecciona tu país...</option>
                                {
                                    countries.map((country, index) =>
                                        <option key={index}>
                                            {country.name.common}
                                        </option>
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
                                defaultValue={clientData?.cuenta?.telefono != null ? clientData?.cuenta?.telefono : ''}
                                disabled={clientData?.cuenta?.tipo !== 'discord' || clientData?.cuenta?.tipo !== 'google' ? !editProfile : true}
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
                                clientData?.cuenta?.tipo === 'discord' &&
                                <div className="form-text small text-danger">
                                    No puedes cambiar tu teléfono si has iniciado sesión con Discord
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
                                defaultValue={clientData?.cuenta?.sobreMi != null ? clientData?.cuenta?.sobreMi : ''}
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

                        {clientData?.cuenta?.tipo === 'email' ?
                            <div className="row mb-4">
                                <Link to='/Cliente/Login'>¿Cambiar la contraseña de tu cuenta? Pulsa aquí para restablecerla</Link>
                            </div>
                            :
                            <div className="row mb-4">
                                <span className='data-info'>Solo puedes cambiar la contraseña de tu cuenta de tipo email.</span>
                            </div>
                        }


                        {/* Botones */}
                        <div className="d-flex justify-content-end mt-4">
                            {
                                !editProfile ?
                                    <button type="button" className="btn btn-purple px-4 fw-bold" onClick={() => setEditProfile(true)}>
                                        Editar perfil
                                    </button>
                                    :
                                    <>
                                        <button type="button" className="btn btn-cancel me-2 px-4" onClick={() => setEditProfile(false)}>
                                            Cancelar
                                        </button>

                                        <button type="button" className="btn btn-purple px-4 fw-bold" onClick={handleSubmitProfile}
                                            disabled={!validateProfile.codigoPostal || !validateProfile.municipio || !validateProfile.domicilio || !validateProfile.provincia || !validateProfile.nombre || !validateProfile.pais || !validateProfile.telefono}  >
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