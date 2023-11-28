addLink("/JSX/menu-superior.css");

let _notificaciones_;

async function estadoNotificacion() {
        let sin_leer = await JSONBD({
                ruta: `usuarios/${user["PK"]}/notificaciones/sin-leer.json`
        });
        document.querySelector(".notificaciones .sin-leer").style.display = sin_leer && sin_leer.estado ? "block" : "none";
}

async function cargar15Notificaciones() {
        document.querySelectorAll(".panel-notificaciones .contenedor .contenedor-notificacion").forEach((tarjeta) => tarjeta.remove());
        if (_notificaciones_?.close) {
        }
        _notificaciones_ = notificacionesCursor();
        for (let i = 0; i < 15; i++) {
                await cargarNotificacion();
        }
        _notificaciones_ = undefined;
        await JSONBD({
                ruta: "usuarios",
                query: {
                        SET: {
                                aplicacion: {
                                        PK: user["PK"]
                                },
                                archivo: "notificaciones/sin-leer.json",
                                valor: {
                                        estado: false
                                }
                        }
                }
        });
        estadoNotificacion();
}

async function cargarNotificacion() {
        let notificacion = (await _notificaciones_.next()).value;
        console.log(notificacion);
        let div = document.createElement("div");
        div.className = "contenedor-notificacion";
        document.querySelector(".panel-notificaciones .contenedor").appendChild(div);
        if (!notificacion) {
                document.querySelectorAll(".panel-notificaciones .contenedor .tarjeta").forEach((tarjeta) => tarjeta.remove());
                document.querySelector(".panel-notificaciones .contenedor").appendChild(div);
                return ReactDOM.render(
                        <Tooltip title="No hay notificaciones" placement="left" style={{ cursor: "pointer", maxWidth: 300 }} TransitionComponent={Zoom}>
                                <div className="tarjeta">
                                        <div className="imagen">
                                                <i class="fa-solid fa-face-smile-wink"></i>
                                        </div>
                                        <div>
                                                <div className="titulo">
                                                        <b>
                                                                No hay notificaciones
                                                        </b>
                                                </div>
                                        </div>
                                </div>
                        </Tooltip>
                        ,
                        div
                );
        }
        ReactDOM.render(
                <Tooltip title={notificacion.notificacion.mensaje} placement="left" style={{ cursor: "pointer", maxWidth: 300 }} TransitionComponent={Zoom}>
                        <div className="tarjeta" onClick={() => {
                                if (notificacion.notificacion.swal) {
                                        Swal.fire(notificacion.notificacion.swal);
                                }
                        }}>
                                <div className="imagen">
                                        {
                                                notificacion.notificacion.imagen ?
                                                        <img src={notificacion.notificacion.imagen} /> :
                                                        notificacion.notificacion.icono ?
                                                                <i className={notificacion.notificacion.icono}></i> :
                                                                <i className="fa-solid fa-bell"></i>
                                        }
                                </div>
                                <div>
                                        <div className="titulo">
                                                <b>
                                                        {notificacion.notificacion.titulo}
                                                </b>
                                        </div>
                                        <div className="contenido">
                                                {notificacion.notificacion.mensaje}
                                        </div>
                                        <div className="fecha ta-right op-50P">
                                                <small>
                                                        {AGO(notificacion.notificacion.creacion)}
                                                </small>
                                        </div>
                                </div>
                        </div>
                        <div>
                                {
                                        notificacion.notificacion.cursor?.time ?? ""
                                }
                        </div>
                </Tooltip>
                ,
                div
        );
}

function MenuSuperior() {
        if (search.get("ventana-flotante") == "true") {
                return "";
        }
        return (
                <AppRender>
                        <Paper elevation={theme == darkTheme ? 24 : 3} style={{ padding: 5, marginBottom: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <LogoConNombre
                                        className={`
                                                ${theme == darkTheme ? "silueta-blanca" : "silueta-negra"}
                                                pad-10
                                        `} w={110} />
                                <div className="notificaciones"
                                        tabIndex={0}
                                        onFocus={() => {
                                                if (document.querySelector(".notificaciones .tarjeta")) {
                                                        return;
                                                }
                                        }}
                                        onBlur={(e) => {
                                                if (document.querySelector(`.notificaciones`).contains(e.relatedTarget)) {
                                                        return;
                                                }
                                                document.querySelector(`.notificaciones input[type="checkbox"]`).checked = false;
                                        }}>
                                        <input type="checkbox" className="chk-notificaciones" />
                                        <div style={{
                                                position: "relative",
                                        }}>
                                                <IconButton className="btn-notificaciones" onClick={() => {
                                                        document.querySelector(".notificaciones .chk-notificaciones").checked = !document.querySelector(".chk-notificaciones").checked;
                                                        if (document.querySelector(".notificaciones .chk-notificaciones").checked) {
                                                                cargar15Notificaciones();
                                                        }
                                                }}>
                                                        <i className="fa-solid fa-bell"></i>
                                                </IconButton>
                                                <span
                                                        style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                right: 5,
                                                                width: 10,
                                                                height: 10,
                                                                borderRadius: "50%",
                                                                backgroundColor: "red",
                                                        }}
                                                        className="sin-leer"
                                                />
                                        </div>
                                        <Paper elevation={8} className="panel-notificaciones .b-s-1px-neutro2" style={{ color: theme == darkTheme ? "white" : "slategray" }}>
                                                <div className="contenedor" />
                                                <a href="/logged/notificaciones">
                                                        <Paper className="ver-todas" >
                                                                Ver todas las notificaciones <i className="fa-solid fa-arrow-right"></i>
                                                        </Paper>
                                                </a>
                                        </Paper>
                                </div>
                        </Paper>
                </AppRender>
        );
}