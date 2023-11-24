addLink("/JSX/menu-superior.css");

let end;

async function estadoNotificacion() {
        let sin_leer = await JSONBD(`usuarios/${user["PK"]}/notificaciones/sin-leer.json`);
        if (!sin_leer) {
                return
        }
        document.querySelector(".notificaciones .sin-leer").style.display = sin_leer.estado ? "block" : "none";
}

async function cargar15Notificaciones() {
        for (let i = 0; i < 15; i++) {
                await cargarNotificacion();
        }
        await JSONBD("", {
                DOC: {
                        "usuarios": {
                                [user["PK"]]: {
                                        "notificaciones": {
                                                "sin-leer.json": {
                                                        estado: false,
                                                }
                                        }
                                }
                        }
                }
        });

        estadoNotificacion();
}

async function cargarNotificacion() {
        if (!end) {
                end = await JSONBD(`usuarios/${user["PK"]}/notificaciones/end.json`);
        } else {
                if (!end.cursor_antecesor) {
                        return;
                }
                end = await JSONBD(`
                                usuarios/
                                        ${user["PK"]}/
                                                notificaciones/
                                                        ${end.cursor_antecesor.año}/${end.cursor_antecesor.mes}/${end.cursor_antecesor.dia}/
                                                                ${end.cursor_antecesor.hora}-${end.cursor_antecesor.minuto}-${end.cursor_antecesor.segundo}-${end.cursor_antecesor.milisegundo}.json
                        `);
        }
        let div = document.createElement("div");
        document.querySelector(".panel-notificaciones .contenedor").appendChild(div);

        let value = await JSONBD(`
                usuarios/
                        ${user["PK"]}/
                                notificaciones/
                                        ${end.cursor.año}/${end.cursor.mes}/${end.cursor.dia}/
                                                ${end.cursor.hora}-${end.cursor.minuto}-${end.cursor.segundo}-${end.cursor.milisegundo}.json
        `);
        end = value;
        ReactDOM.render(
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