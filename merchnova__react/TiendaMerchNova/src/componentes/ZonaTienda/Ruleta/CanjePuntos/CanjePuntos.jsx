import { useLoaderData } from "react-router";
import useGlobalState from "../../../../global_state/globalState";
import "./CanjePuntos.css";
import ModalCanje from "./ModalCanje/ModalCanje";
import { useState } from "react";


function CanjePuntos() {
    const { clientData } = useGlobalState();
    const [productChoose, setProductChoose] = useState();
    const [puntos, setPuntos] = useState();
    const productsCanje = useLoaderData().data;
    const puntosProductos = [22100, 19300, 27500, 26400, 25800, 32000, 21850, 21300];

    return (
        <section className="canje-section">
            <div className="container">
                <div className="canje-header">
                    <div className="canje-header-content">
                        <h1 className="canje-title">Canjea tus puntos</h1>

                        <p className="canje-description">Utiliza los puntos que has conseguido en la ruleta para conseguir productos exclusivos.</p>
                    </div>

                    {/* Puntos disponibles */}
                    <div className="canje-puntos-box">
                        <span className="canje-puntos-label">Tus puntos</span>
                        <span className="canje-puntos-value">{clientData.cuenta.puntos}</span>
                        <span className="canje-puntos-text">puntos disponibles</span>
                    </div>
                </div>

                {/* SEPARADOR */}
                <div className="canje-separator"></div>

                {/* PRODUCTOS */}
                <div className="canje-products-header">
                    <h2 className="canje-products-title">Productos disponibles</h2>
                    <span className="canje-products-count">{productsCanje.length} productos</span>
                </div>

                <div className="row g-4">
                    {productsCanje.map((producto, pos) => (
                        <div key={pos} className="col-12 col-sm-6 col-lg-3">
                            <article className="canje-product-card">
                                <div className="canje-product-image-container">
                                    <img src={producto.imagen} alt={producto.nombre} className="canje-product-image" />
                                </div>

                                <div className="canje-product-body">
                                    <h3 className="canje-product-name">{producto.nombre}</h3>

                                    <div className="canje-product-points">
                                        <span className="canje-product-points-value">{puntosProductos[pos]}</span>
                                        <span className="canje-product-points-label">puntos</span>
                                    </div>

                                    <div className="canje-product-stock">
                                        <span>Stock disponible: {producto.stock}</span>
                                    </div>

                                    <button type="button" data-bs-toggle="modal" data-bs-target={`#modalConfirmarCanje`} className="canje-product-button" onClick={() => {setProductChoose(producto); setPuntos(puntosProductos[pos])} }>
                                        Canjear producto
                                    </button>
                                </div>
                            </article>
                        </div>
                    ))}
                    <ModalCanje product={productChoose} puntos={puntos} />
                </div>


                {/* INFORMACIÓN */}
                <div className="canje-info">
                    <div className="canje-info-content">
                        <h3 className="canje-info-title">¿Cómo funciona?</h3>

                        <p className="canje-info-text">Consigue puntos en la ruleta y utilízalos para
                            canjear productos. Cada producto requiere una cantidad determinada de puntos.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CanjePuntos;