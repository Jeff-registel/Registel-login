crearEstilo({
        ".notificaciones-app": {
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
                gap: 10,
                flexWrap: "wrap",

                "& .notificacion-elemento": {
                        "& .tarjeta": {
                                width: 400,
                                minWidth: 400,
                                maxWidth: 400,
                                display: "flex",
                                alignItems: "stretch",
                                justifyContent: "space-between",

                                "& .titulo": {
                                        textAlign: "right",
                                        fontWeight: "bold",
                                },

                                "& .contenido": {
                                        textAlign: "right",
                                },

                                "& .imagen": {
                                        width: 40,
                                        height: 80,
                                        fontSize: 40,
                                        marginRight: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 5,

                                        "& img": {
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                        },
                                },
                        }
                },
        },
});

let _cursorNotificaciones_;
let Arr20Notificaciones;

async function setup() {
        _cursorNotificaciones_ = notificacionesCursor(20);
        Arr20Notificaciones = await _cursorNotificaciones_.next();
}

function App() {
        return (
                <AppLogged>
                        <Paper className="pad-20">
                                <h1>
                                        Notificaciones
                                </h1>
                                <div className="notificaciones-app" />
                                <br />
                                <hr />
                                <center className="pad-20">
                                        <Button variant="contained" color="primary" onClick={cargar20Notificaciones} className="boton-cargar-mas-notificaciones">
                                                Cargar más
                                        </Button>
                                </center>
                        </Paper>
                </AppLogged>
        )
}

function onLoad() {
        cargar20Notificaciones();
}

async function cargar20Notificaciones() {
        if (Arr20Notificaciones.done) {
                return;
        }
        for (let notificacion of Arr20Notificaciones.value) {
                let domnotif = document.createElement("div");
                domnotif.className = "notificacion-elemento";
                document.querySelector(".notificaciones-app").appendChild(domnotif);
                ReactDOM.render(
                        <Notificacion notificacion={notificacion} />,
                        domnotif
                );
        }

        Arr20Notificaciones = await _cursorNotificaciones_.next()

        if (Arr20Notificaciones.done) {
                document.querySelector(".boton-cargar-mas-notificaciones").classList.add("d-none");
        }

        function Notificacion({ notificacion }) {
                if (!notificacion) {
                        return;
                }
                return (
                        <AppRender>
                                <Tooltip title={notificacion.notificacion.mensaje} placement="bottom" style={{ cursor: "pointer" }} TransitionComponent={Zoom}>
                                        <Button className="tarjeta" variant="contained" color="secondary"
                                                onClick={() => {
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
                                                        <div className="contenido" style={{ minHeight: 40, fontWeight: "normal" }}>
                                                                <small>
                                                                        {notificacion.notificacion.mensaje.length > 100 ? (notificacion.notificacion.mensaje.substring(0, 100) + "...") : notificacion.notificacion.mensaje}
                                                                </small>
                                                        </div>
                                                        <div className="fecha ta-right op-50P">
                                                                <small>
                                                                        {AGO(notificacion.notificacion.creacion)}
                                                                </small>
                                                        </div>
                                                </div>
                                        </Button>
                                </Tooltip>
                        </AppRender>
                )
        }
}