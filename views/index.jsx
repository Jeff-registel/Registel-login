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
        return (
                <ThemeProvider theme={theme}>
                        <form action="/login-verify" method="POST">
                                <LogoConNombre className={`
                                        ${theme == darkTheme ? "silueta-blanca" : "silueta-negra"}
                                        pad-10
                                `} w={300} h={100} />
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
                                                        let { value } = await swal.fire({
                                                                title: "Recuperar contraseña",
                                                                input: "text",
                                                                placeholder: "Usuario",
                                                                confirmButtonText: "Enviar correo",
                                                        });
                                                        if (value) {
                                                                let usuarios = await JSONBD("usuarios/", { TODO: { usuarios: true } })
                                                                usuarios = usuarios.filter(usuario => usuario["EMAIL"] == value);
                                                                if (!usuarios.length) {
                                                                        swal.fire("Error", "No hay ningún usuario con ese correo", "error");
                                                                        return;
                                                                }
                                                                if (usuarios.length > 1) {
                                                                        swal.fire("Error", "Hay más de un usuario con ese correo", "error");
                                                                        return;
                                                                }
                                                                let usuario = usuarios[0];
                                                                socket.emit("Recuperar contraseña", usuario, window.location.href);
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

socket.on("Recuperar contraseña: ERROR", () => {
        swal.fire("Error", "No se pudo enviar el correo", "error");
});

socket.on("Recuperar contraseña: OK", () => {
        swal.fire("Correo enviado", "Se ha enviado un correo con la contraseña", "success");
});

socket.on("usuario-existe: respuesta", (existe) => {
        let error = document.querySelector(".label-error");
        if (!existe) {
                error.style.display = "block";
                error.innerHTML = "Usuario no existe";
        } else {
                error.style.display = "none";
        }
});