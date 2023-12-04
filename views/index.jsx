if (user) {
        location.href = '/logged';
}

crearEstilo({
        ".background-container": {
                position: "absolute",
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

        ".app": {
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: "100vh",
                width: "100vw",

                ".banner-izquierda": {
                        width: "500px",

                        "& h1": {
                                fontSize: "80px",
                                display: "flex",
                                justifyContent: "start",
                                alignItems: "center",
                        },
                },
        }
});

function App() {
        return (
                <AppSimple>
                        <div className="background-container">
                                <div className="background">
                                </div>
                                <img src="img/svg/back1.svg" className="background2" />
                        </div>
                        <div className="app">
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