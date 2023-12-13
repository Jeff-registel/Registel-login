if (user) {
        location.href = '/logged';
}

crearEstilo({
        ".background-container": {
                position: "fixed",
                overflow: "hidden",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",

                ".background, .background2": {
                        "min-height": "100vh",
                        "min-width": "100vw",
                        position: "absolute",
                        top: 0,
                        left: 0,
                },

                ".background": {
                        "background-image": "linear-gradient(to right, darkblue, black, rgb(0, 56, 139))",
                        "background-size": "400% 100%",
                        animation: "gradient 15s ease infinite alternate",
                        "z-index": 1,
                },

                ".background2": {
                        "object-fit": "cover",
                        "z-index": 2,
                },
        },

        "@keyframes gradient": {
                "0%": {
                        "background-position": "0% 0%",
                },
                "100%": {
                        "background-position": "100% 0%",
                }
        },

        ".contenedor-formulario": {
                position: "relative",
                display: "flex",
                justifyContent: "center",
                transform: "translateX(-10%)",
                alignItems: "center",
                height: "100vh",
                zIndex: 11,
        }
});

function resize() {
        document.querySelector(".background-container").style.transform = `scale(${Math.max(window.innerWidth / 1280, window.innerHeight / 720)}) translate(-50%, -50%)`;
}

window.addEventListener("resize", resize);

function onLoad() {
        resize();
}

function App() {
        return (
                <AppSimple>
                        <div className="background-container"
                                style={{
                                        background: "white",
                                        width: 1280,
                                        height: 720,
                                        transformOrigin: "0 0",
                                        top: "50%",
                                        left: "50%",
                                }}
                        >
                                <svg viewBox="0 0 640 720" style={{
                                        position: "absolute",
                                        top: 720 * 0.5,
                                }}>
                                        <rect x="0" y="0" width="100%" height="100%" fill="#D0DEB8" />
                                </svg>
                                <img src="img/svg/login/Recurso 5.svg"
                                        style={{
                                                position: "absolute",
                                                width: 1280 * 1.2,
                                                top: 720 * 0.25,
                                                left: -1280 * 0.05,
                                        }}
                                />
                                <img src="img/svg/login/Recurso 6.svg"
                                        style={{
                                                position: "absolute",
                                                width: 1280 * 0.45,
                                                top: 720 * 0.45,
                                                left: -1280 * 0.05,
                                        }}
                                />
                                <img src="img/svg/login/Recurso 6.svg"
                                        style={{
                                                position: "absolute",
                                                width: 1280 * 0.5,
                                                top: 720 * 0.45,
                                                right: -1280 * 0.05,
                                        }}
                                />
                                <img src="img/svg/login/Recurso 7.svg"
                                        style={{
                                                position: "absolute",
                                                width: 1280 * 0.5,
                                                top: 720 * 0.45,
                                                left: -1280 * 0.05,
                                        }}
                                />
                                <img src="img/svg/login/Recurso 7.svg"
                                        style={{
                                                position: "absolute",
                                                width: 1280 * 0.5,
                                                top: 720 * 0.45,
                                                right: -1280 * 0.05,
                                        }}
                                />
                                {
                                        Array.from({ length: 4 }).map(() =>
                                                <img src="img/svg/login/Recurso 11.svg"
                                                        style={{
                                                                position: "absolute",
                                                                width: 1280 * 0.10,
                                                                top: 720 * 0.49,
                                                                left: Math.random() * 1280,
                                                        }}
                                                />
                                        )
                                }
                                {
                                        Array.from({ length: 4 }).map(() =>
                                                <img src="img/svg/login/Recurso 12.svg"
                                                        style={{
                                                                position: "absolute",
                                                                width: 1280 * 0.07,
                                                                top: 720 * 0.49,
                                                                left: Math.random() * 1280,
                                                        }}
                                                />
                                        )
                                }
                                {
                                        Array.from({ length: 7 }).map(() =>
                                                <img src="img/svg/login/Recurso 13.svg"
                                                        style={{
                                                                position: "absolute",
                                                                width: 1280 * 0.05,
                                                                top: 720 * 0.49,
                                                                left: Math.random() * 1280,
                                                        }}
                                                />
                                        )
                                }
                                {
                                        Array.from({ length: 4 }).map(() =>
                                                <img src="img/svg/login/Recurso 8.svg"
                                                        style={{
                                                                position: "absolute",
                                                                height: 720 * 0.10,
                                                                top: 720 * 0.45,
                                                                left: Math.random() * 1280,
                                                        }}
                                                />
                                        )
                                }
                                {
                                        Array.from({ length: 4 }).map(() =>
                                                <img src="img/svg/login/Recurso 9.svg"
                                                        style={{
                                                                position: "absolute",
                                                                height: 720 * 0.10,
                                                                top: 720 * 0.45,
                                                                left: Math.random() * 1280,
                                                        }}
                                                />
                                        )
                                }
                                {
                                        Array.from({ length: 4 }).map(() =>
                                                <img src="img/svg/login/Recurso 10.svg"
                                                        style={{
                                                                position: "absolute",
                                                                height: 720 * 0.08,
                                                                top: 720 * 0.47,
                                                                left: Math.random() * 1280,
                                                        }}
                                                />
                                        )
                                }
                                <svg viewBox="0 0 1280 360" style={{
                                        position: "absolute",
                                        top: 720 * 0.52,
                                }}>
                                                <polygon points={`
                                                ${1280 * 0.645},0
                                                ${1280 * 0.655},0
                                                ${1280+40},360
                                                ${-40},360
                                        `} fill="#555" />
                                        <polygon points={`
                                                ${1280 * 0.645},0
                                                ${1280 * 0.655},0
                                                ${1280},360
                                                ${0},360
                                        `} fill="gray" />
                                </svg>
                        </div>
                        <div className="contenedor-formulario">
                                <Paper elevation={3} className="d-inline-block pad-20">
                                        <Formulario />
                                </Paper>
                        </div>
                </AppSimple>
        );
};

function Formulario() {
        let Error = async () => {
                let auth = await MACRO({
                        macro: "public/usuario/autenticar",
                        parametros: {
                                login: document.querySelector("#usuario").value,
                                contraseña: document.querySelector("#contrasena").value,
                        }
                });
                if (auth["error"]) {
                        return auth["error"];
                }
        }
        return (
                <ThemeProvider theme={theme}>
                        <form action="/login-verify" method="POST"
                                onSubmit={async (evt) => {
                                        evt.preventDefault();
                                        let error = await Error();
                                        if (error) {
                                                return swal.fire("Error", error, "error");
                                        }
                                        evt.target.submit();
                                }}
                        >
                                <LogoConNombre className={`
                                        ${theme == darkTheme ? "silueta-blanca" : "silueta-negra"}
                                        pad-10
                                `} w={300} h={100} />
                                <br />
                                <br />
                                <br />
                                <TextField id="usuario" name="usuario" label="Usuario"
                                        required
                                        fullWidth
                                />
                                <br />
                                <br />
                                <TextField id="contrasena" name="contrasena" label="Contraseña" type="password" fullWidth required />

                                <br />
                                <br />
                                <hr />
                                <br />
                                <div
                                        style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                        }}
                                >
                                        <Link
                                                onClick={async () => {
                                                        const { value } = await swal.fire({
                                                                title: "Recuperar contraseña",
                                                                text: "Ingrese su correo electrónico para enviarle un link de recuperación",
                                                                input: "text",
                                                                placeholder: "Correo de recuperación",
                                                                confirmButtonText: "Enviar correo",
                                                        });
                                                        if (value) {
                                                                efectoEsperar(async () => {
                                                                        let json = await JSONBD({
                                                                                ruta: "usuarios",
                                                                                query: {
                                                                                        "CAMBIO-CONTRASEÑA-TOKENMAIL": {
                                                                                                EMAIL: value,
                                                                                                URL: window.location.origin
                                                                                        }
                                                                                }
                                                                        });
                                                                        console.log(json)
                                                                        if (json["error"]) {
                                                                                swal.fire("Error", json["error"], "error");
                                                                        }
                                                                        if (json["ok"]) {
                                                                                swal.fire("Correo enviado", "Se ha enviado un correo con un link para cambio de contraseña (Revisar spam)", "success");
                                                                        }
                                                                });
                                                        }
                                                }}
                                                style={{
                                                        cursor: "pointer",
                                                }}
                                        >
                                                <small>
                                                        ¿Olvidaste tu contraseña?
                                                </small>
                                        </Link>
                                        <Button variant="contained" color="primary" type="submit">
                                                Ingresar
                                        </Button>
                                </div>
                        </form>
                </ThemeProvider >
        );
}