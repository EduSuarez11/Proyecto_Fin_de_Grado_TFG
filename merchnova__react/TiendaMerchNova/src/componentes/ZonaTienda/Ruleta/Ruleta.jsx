import { useRef, useState, useEffect } from "react";
import { Link, useLoaderData } from 'react-router-dom';
import useGlobalState from './../../../global_state/globalState';
import "./Ruleta.css";
import PremiosRuleta from "./Premios/PremiosRuleta";
import { request_ruleta } from "../../Servicios/peticiones_ruleta/request_ruleta";

function Ruleta() {
    let refRuleta = useRef(null);
    let refAnimacion = useRef(null);
    let estaGirando = useRef(false);
    let anguloActual = useRef(0);

    const { clientData, setClientData } = useGlobalState();
    const product = useLoaderData();
    const [premio, setPremio] = useState('');
    const [timeForNextSpin, setTimeForNextSpin] = useState();
    const [numTiradas, setNumTiradas] = useState(1);
    let tiempoNuevaTirada = useRef('');
    let diference = 0;

    const opciones = {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }

    function GetHourTime(diference) {
        let hours = Math.floor((diference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        let minutes = Math.floor((diference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        let seconds = Math.floor((diference % (1000 * 60)) / 1000).toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    function IntervalTime(nextDayCountdown) {
        const timeCount = setInterval(function () {
            const dateFormat = Intl.DateTimeFormat('en-US', opciones).format(nextDayCountdown); // fecha en formato 15 Sep... 
            const date = new Date(dateFormat).getTime(); // fecha dia siguiente
            const nowMiliseconds = new Date().getTime();

            diference = date - nowMiliseconds;

            if (diference < 1) {
                clearInterval(timeCount);
                tiempoNuevaTirada.current.innerHTML = ``;
                setNumTiradas(1);
            } else {
                //console.log(GetHourTime(diference));
                if (tiempoNuevaTirada.current) {
                    tiempoNuevaTirada.current.innerHTML = GetHourTime(diference);
                }
            }
        }, 1000);
    }

    useEffect(
        () => {
            async function ReqDateOfNewSpin() {
                const pet = await request_ruleta.getDateFromNewSpin(clientData._id);
                //console.log('Datos de la respuesta dentro de useEffect: ', pet);
                if (new Date().getTime() < pet.data?.proximaTirada) {
                    // Modificamos valor para obtener la fecha de la siguiente tirada guardada en la base de datos
                    setTimeForNextSpin(pet.data.proximaTirada);

                    // El número de tiradas es 0 si la fecha de la proxima tirada es mayor a la fecha actual
                    setNumTiradas(0);

                    // Utilizamos setInterval para conocer el tiempo restante para la siguiente tirada
                    IntervalTime(pet.data.proximaTirada);
                }
            }

            ReqDateOfNewSpin();
        }, []
    )

    const premios = [
        "50 pts", "100 pts", "25 pts", "500 pts", "75 pts", "10 pts ",
        "150 pts", "250 pts", "1000 pts", "100 pts", "200 pts", "750 pts"
    ];


    async function spinToWheel() {
        if (estaGirando.current) return;
        if (!refRuleta.current) return;
        estaGirando.current = true;
        let date = null;

        /* Premio obtenido */
        const indicePremio = Math.floor(Math.random() * premios.length);
        const premioObt = premios[indicePremio];

        const premioPorGrado = 360 / premios.length;

        const anguloPremio = indicePremio * premioPorGrado + premioPorGrado / 2;

        /** --------------------------------------------------------------- */

        const vueltasCompletas = Math.floor(Math.random() * 5) + 5;
        //const gradosAdicionales = Math.floor(Math.random() * 360);

        const anguloInicial = anguloActual.current;
        const anguloFinal = anguloInicial + (vueltasCompletas * 360) + (180 - anguloPremio);

        anguloActual.current = anguloFinal;

        if (refAnimacion.current) refAnimacion.current.cancel();

        // Creamos la animación
        refAnimacion.current = refRuleta.current.animate(
            [{ transform: `rotate(${anguloInicial}deg)` }, { transform: `rotate(${anguloFinal}deg)` }],
            { duration: 10000, easing: "cubic-bezier(0.12, 0.8, 0.18, 1)", fill: "forwards" }
        );

        // Cuando termina
        refAnimacion.current.onfinish = async () => {
            estaGirando.current = false;

            const dateNow = new Date(); // fecha actual en formato milisegundos
            const nextDayCountdown = dateNow.setDate(dateNow.getDate() + 1); // fecha dia siguiente en formato milisegundos
            //const dateFormat = Intl.DateTimeFormat('en-US', opciones).format(nextDayCountdown); // fecha en formato 15 Sep... 

            const response = await request_ruleta.saveSpinWheel({ puntos: parseInt(premioObt.split(" ")[0]), proximaTirada: nextDayCountdown, premioObtenido: premioObt, clientId: clientData._id, puntosCuenta: clientData.cuenta.puntos });

            if (response.code === 0) {
                console.log('Respuesta de la tirada: ', response);
                setNumTiradas(numTiradas - 1);
                setClientData(response.data);
            } else {
                alert('Error en la tirada');
                return;
            }

            // Mostramos el tiempo restante para el siguiente tiro
            IntervalTime(nextDayCountdown);

            // Dejamos el transform final de forma permanente
            refRuleta.current.style.transform = `rotate(${anguloFinal}deg)`;
            setPremio(premioObt);
        };


    }


    return (
        <section className="ruleta-section">
            <div className="container-fluid">
                <div className="row align-items-center justify-content-center">
                    {/* =========================================
                        PARTE IZQUIERDA
                    ========================================== */}
                    <div className="col-12 col-lg-6">
                        <div className="ruleta-info">

                            {/* Título */}
                            <div className="ruleta-header">
                                <h1 className="ruleta-title">Ruleta de la fortuna</h1>
                                <p className="ruleta-description">Gira la ruleta y consigue tu premio.</p>
                            </div>

                            {/* Tiradas */}
                            <div className="ruleta-card">
                                <div className="ruleta-card-title">Tiradas restantes</div>

                                <div className="ruleta-attempts">
                                    <span>{numTiradas}</span>
                                </div>

                                <span className="fw-bold" ref={tiempoNuevaTirada}></span>
                            </div>

                            {/* Botón tirar */}
                            <button type="button" className="btn ruleta-spin-button" onClick={() => spinToWheel()} disabled={numTiradas === 0}>Girar ruleta</button>

                            {/* Premio obtenido */}
                            <div className="ruleta-card prize-card">
                                <div className="ruleta-card-title">Premio obtenido</div>
                                <div className="ruleta-prize">{premio || clientData.ruleta.premiosObtenidos.at(-1)}</div>
                            </div>

                            {/* Botón lista de premios */}
                            <div className="d-flex justify-content-between gap-3 align-items-center">
                                <button type="button" data-bs-toggle="modal" data-bs-target="#modalPremiosRuleta" className="btn ruleta-prizes-button">Ver todos los premios</button>
                                <Link to='/Portal/ZonaPremios/CanjearPuntos'>
                                    <button className="btn ruleta-prizes-button">Canjear puntos</button>
                                </Link>
                            </div>

                            <PremiosRuleta product={product} />
                        </div>
                    </div>

                    {/* =========================================
                        PARTE DERECHA
                    ========================================== */}
                    <div className="col-12 col-lg-6">
                        <div className="ruleta-wrapper">
                            {/* Flecha */}
                            <div className="ruleta-pointer">
                                <span></span>
                            </div>

                            {/* Ruleta */}
                            <div className="ruleta" ref={refRuleta} onTransitionEnd={() => estaGirando.current = false}>
                                <button type="button" className="ruleta-center" onClick={() => spinToWheel()} disabled={numTiradas === 0}>
                                    <span>GIRAR</span>
                                </button>

                                {/* Premios */}
                                <div className="ruleta-labels" ref={refRuleta} onTransitionEnd={() => estaGirando.current = false}>
                                    {premios.map((premio, index) => (
                                        <div key={index} className={`ruleta-label ruleta-label-${index + 1}`}>
                                            {premio}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Ruleta;