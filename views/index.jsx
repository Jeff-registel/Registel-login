addLink("/index.css");

const App = () => {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <div className="backgroundContainer">
                                <div className="background">
                                </div>
                                <img src="img/svg/back1.svg" className="background2" />
                        </div>
                        <Paper elevation={3} className="d-inline-block pad-20">
                                <Formulario />
                        </Paper>
                </ThemeProvider>
        );
};

function Formulario() {
        return (
                <React.Fragment>
                        <form action="/login-verify" method="POST">
                                <LogoConNombre className="silueta-blanca pad-10" w={300} h={100} />
                                <br />
                                <br />
                                <div className="label-error" style={{ display: "none"}}>
                                </div>
                                <br />
                                <TextField id="usuario" name="usuario" label="Usuario" fullWidth required />
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
                                                let usuario = document.querySelector("#usuario").value;
                                                let contrasena = document.querySelector("#contrasena").value;
                                                let respuestaAcceso = await (await fetch(`/API/login-usuario/${usuario}/${contrasena}`)).json();
                                                if (!respuestaAcceso["auth"]) {
                                                        e.preventDefault();
                                                        let error = document.querySelector(".label-error");
                                                        error.style.display = "block";
                                                        error.innerHTML = "Contraseña incorrecta";
                                                        return;
                                                }
                                                localStorage.setItem("contraseña", contrasena);
                                                document.querySelector("form").submit();
                                        }}>
                                                Ingresar
                                        </Button>
                                </div>
                        </form>
                </React.Fragment>
        );
}

ReactDOM.render(<App />, document.querySelector(".App"));

socket.on("usuario-existe: respuesta", (existe) => {
        console.log(existe);
        let error = document.querySelector(".label-error");
        if (!existe) {
                error.style.display = "block";
                error.innerHTML = "Usuario no existe";
        }else{
                error.style.display = "none";
        }
} );
                

document.querySelector("#usuario").addEventListener("change", () => {
        let usuario = document.querySelector("#usuario").value;
        socket.emit("usuario-existe", usuario);
});