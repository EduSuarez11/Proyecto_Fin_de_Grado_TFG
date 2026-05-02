import './ComoFunciona.css'

function ComoFunciona() {
    return (
        <div className="help-center-container container-fluid">

            <div className="row">

                {/* SIDEBAR */}
                <div className="col-lg-3">

                    <div className="help-sidebar">

                        <h5>Centro de ayuda</h5>

                        <ul>

                            <li>
                                <a href="#inicio">
                                    <i className="bi bi-house-door"></i>
                                    Inicio
                                </a>
                            </li>

                            <li>
                                <a href="#registro">
                                    <i className="bi bi-person-plus"></i>
                                    Registro
                                </a>
                            </li>

                            <li>
                                <a href="#login">
                                    <i className="bi bi-box-arrow-in-right"></i>
                                    Inicio de sesión
                                </a>
                            </li>

                            <li>
                                <a href="#productos">
                                    <i className="bi bi-bag"></i>
                                    Productos
                                </a>
                            </li>

                            <li>
                                <a href="#carrito">
                                    <i className="bi bi-cart3"></i>
                                    Carrito
                                </a>
                            </li>

                            <li>
                                <a href="#compras">
                                    <i className="bi bi-credit-card"></i>
                                    Compras
                                </a>
                            </li>

                            <li>
                                <a href="#perfil">
                                    <i className="bi bi-person-circle"></i>
                                    Perfil
                                </a>
                            </li>

                            <li>
                                <a href="#pedidos">
                                    <i className="bi bi-box-seam"></i>
                                    Pedidos
                                </a>
                            </li>

                            <li>
                                <a href="#seguridad">
                                    <i className="bi bi-shield-lock"></i>
                                    Seguridad
                                </a>
                            </li>

                        </ul>

                    </div>

                </div>

                {/* CONTENIDO */}
                <div className="col-lg-9">
                    <div className="help-content">
                        {/* HERO */}
                        <section className="help-hero">
                            <span className="help-badge">💜 Centro de ayuda MerchNova</span>
                            <h1>Aprende cómo funciona la tienda</h1>

                            <p>Aquí encontrarás toda la información necesaria para navegar por MerchNova,
                                comprar productos y gestionar tu cuenta.
                            </p>
                        </section>

                        {/* INICIO */}
                        <section id="inicio" className="help-section">
                            <h2>🏠 Página de inicio</h2>

                            <p>La página principal muestra los productos destacados, novedades y promociones
                                disponibles dentro de la tienda.
                            </p>

                            <p>Desde aquí podrás navegar rápidamente entre categorías como camisetas,
                                sudaderas, tazas, peluches y mucho más.
                            </p>
                        </section>

                        {/* REGISTRO */}
                        <section id="registro" className="help-section">
                            <h2>📝 Registro</h2>

                            <p>Para realizar compras y guardar tus pedidos necesitas crear una cuenta.</p>

                            <div className="help-card">
                                <h5>¿Qué necesitas?</h5>
                                <ul>
                                    <li>Nombre de usuario</li>
                                    <li>Correo electrónico válido</li>
                                    <li>Contraseña segura</li>
                                </ul>
                            </div>

                            <p>También puedes iniciar sesión mediante Google o Discord si está disponible.</p>
                        </section>

                        {/* LOGIN */}
                        <section id="login" className="help-section">
                            <h2>🔐 Inicio de sesión</h2>

                            <p>Una vez registrado podrás acceder a tu cuenta utilizando tu correo y contraseña.</p>

                            <p>Si olvidas tu contraseña, MerchNova dispone de un sistema de recuperación
                                mediante correo electrónico.
                            </p>
                        </section>

                        {/* PRODUCTOS */}
                        <section id="productos" className="help-section">
                            <h2>🛍️ Productos</h2>
                            <p>En la sección de productos podrás:</p>
                            <div className="help-grid">
                                <div className="mini-help-card">Buscar productos</div>
                                <div className="mini-help-card">Filtrar por categoría</div>
                                <div className="mini-help-card">Filtrar por precio</div>
                                <div className="mini-help-card">Ver valoraciones</div>
                            </div>

                            <p>Cada producto incluye imágenes, descripción, precio, stock y valoraciones
                                realizadas por otros usuarios.
                            </p>
                        </section>

                        {/* CARRITO */}
                        <section id="carrito" className="help-section">
                            <h2>🛒 Carrito</h2>

                            <p>Los productos seleccionados se almacenan en el carrito de compra.</p>

                            <p>Desde esta sección podrás modificar cantidades, eliminar productos y revisar
                                el total antes de realizar el pago.
                            </p>

                        </section>

                        {/* COMPRAS */}
                        <section id="compras" className="help-section">
                            <h2>💳 Compras y pagos</h2>

                            <p>MerchNova utiliza métodos de pago seguros para proteger la información de los usuarios.</p>

                            <div className="help-card">
                                <h5>Métodos disponibles</h5>
                                <ul>
                                    <li>PayPal</li>
                                    <li>Tarjeta bancaria</li>
                                </ul>
                            </div>
                            <p>Una vez completado el pago, el pedido quedará registrado automáticamente en tu cuenta.</p>
                        </section>

                        {/* PERFIL */}
                        <section id="perfil" className="help-section">
                            <h2>👤 Perfil de usuario</h2>
                            <p>Dentro de tu perfil podrás:</p>

                            <div className="help-grid">
                                <div className="mini-help-card">Cambiar foto de perfil</div>
                                <div className="mini-help-card">Actualizar datos personales</div>
                                <div className="mini-help-card">Gestionar direcciones</div>
                                <div className="mini-help-card">Cambiar contraseña</div>
                            </div>
                        </section>

                        {/* PEDIDOS */}
                        <section id="pedidos" className="help-section">
                            <h2>📦 Pedidos</h2>
                            <p>Todos tus pedidos realizados aparecerán
                                dentro de la sección “Mis pedidos”.
                            </p>

                            <p>Allí podrás consultar:</p>

                            <ul className="help-list">
                                <li>Estado del pedido</li>
                                <li>Productos comprados</li>
                                <li>Fecha de compra</li>
                                <li>Total pagado</li>
                                <li>Dirección de envío</li>
                            </ul>
                        </section>

                        {/* SEGURIDAD */}
                        <section id="seguridad" className="help-section">
                            <h2>🛡️ Seguridad</h2>
                            <p>MerchNova protege la información de los usuarios utilizando autenticación segura
                                y conexiones protegidas.
                            </p>
                            <p>Nunca compartimos datos personales ni información bancaria con terceros.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComoFunciona;
