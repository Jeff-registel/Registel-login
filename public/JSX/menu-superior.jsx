addLink("/JSX/menu-superior.css");

let end;

async function estadoNotificacion() {
        let sin_leer = await JSONBD({
                ruta: `usuarios/${user["PK"]}/notificaciones/sin-leer.json`
        });
        document.querySelector(".notificaciones .sin-leer").style.display = sin_leer && sin_leer.estado ? "block" : "none";
}

async function cargar15Notificaciones() {
        for (let i = 0; i < 15; i++) {
                await cargarNotificacion();
        }
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
        if (!end) {
                end = await JSONBD({
                        ruta: `usuarios/${user["PK"]}/notificaciones/end.json`
                });
        } else {
                if (!end.antecesor) {
                        return;
                }
                end = await JSONBD({
                        ruta: `usuarios/${user["PK"]}/notificaciones/${end.antecesor.file}.json`
                });
        }
        let div = document.createElement("div");
        document.querySelector(".panel-notificaciones .contenedor").appendChild(div);
        if (!end) {
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


        let value = await JSONBD({
                ruta: `usuarios/${user["PK"]}/notificaciones/${end.cursor.file}.json`
        });
        end = value;
        ReactDOM.render(
                <Tooltip title={value.notificacion.mensaje} placement="left" style={{ cursor: "pointer", maxWidth: 300 }} TransitionComponent={Zoom}>
                        <div className="tarjeta" onClick={() => {
                                if (value.notificacion.swal) {
                                        Swal.fire(value.notificacion.swal);
                                }
                        }}>
                                <div className="imagen">
                                        {
                                                value.notificacion.imagen ?
                                                        <img src={value.notificacion.imagen} /> :
                                                        value.notificacion.icono ?
                                                                <i className={value.notificacion.icono}></i> :
                                                                <i className="fa-solid fa-bell"></i>
                                        }
                                </div>
                                <div>
                                        <div className="titulo">
                                                <b>
                                                        {value.notificacion.titulo}
                                                </b>
                                        </div>
                                        <div className="contenido">
                                                {value.notificacion.mensaje}
                                        </div>
                                </div>
                        </div>
                        <div>
                                {
                                        value.notificacion.cursor?.time ?? ""
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
                        <Paper elevation={3} style={{ padding: 5, marginBottom: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                                        <Paper elevation={3} className="panel-notificaciones">
                                                <div className="contenedor" />
                                        </Paper>
                                </div>
                        </Paper>
                </AppRender>
        );
}