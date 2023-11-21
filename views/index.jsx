if (user) {
        location.href = '/login/';
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

const App = () => {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
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
                </ThemeProvider>
        );
};

function Formulario() {
        return (
                <ThemeProvider theme={theme}>
                        <form action="/login-verify" method="POST">
                                <LogoConNombre className="silueta-blanca pad-10" w={300} h={100} />
                                <br />
                                <br />
                                <div className="label-error" style={{ display: "none" }}>
                                </div>
                                <br />
                                <TextField id="usuario" name="usuario" label="Usuario"
                                        onChange={() => {
                                                let usuario = document.querySelector("#usuario").value;
                                                socket.emit("usuario-existe", usuario);
                                        }}
                                        required
                                        fullWidth
                                />
                                <br />
                                <br />
                                <TextField id="contrasena" name="contrasena" label="Contraseña" type="password" fullWidth required onKeyUp={(evt) => {
                                        if (evt.keyCode === 13) {
                                                document.querySelector("form").submit();
                                        }
                                }} />

                                <br />
                                <br />
                                <div className="ta-right">
                                        <Button variant="contained" color="primary" onClick={async (e) => {
                                                console.log((await (await fetch(`/BD?json-query=usuarios/${JSON.stringify({ TODO: {} })}`)).json()))
                                                //document.querySelector("form").submit();
                                        }}>
                                                Ingresar
                                        </Button>
                                </div>
                        </form>
                </ThemeProvider >
        );
}

socket.on("usuario-existe: respuesta", (existe) => {
        console.log(existe);
        let error = document.querySelector(".label-error");
        if (!existe) {
                error.style.display = "block";
                error.innerHTML = "Usuario no existe";
        } else {
                error.style.display = "none";
        }
});