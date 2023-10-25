addLink("/login/index.css");

function App() {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <h1>
                                Empresas
                        </h1>
                        <Paper className="ultimas-empresas-consultadas d-inline-block w-90P">
                        </Paper>
                        <center>
                                <Paper className="ultimos-usuarios-modificados d-inline-block w-90P">
                                </Paper>
                        </center>
                </ThemeProvider>
        );
}

ReactDOM.render(<App />, document.querySelector('.App'));

function Usuario({ usuario, ocultar }) {
        return (
                <Button 
                //href={`/login/admin/usuarios/editar?usuario=${usuario["LOGIN"]}&menu-izquierda=false`}
                onClick={() => {
                        ventana_flotante["nueva-ventana"]({
                                titulo_texto: "Editar usuario",
                                html: `
                                        <iframe src="/login/admin/usuarios/editar?usuario=${usuario["LOGIN"]}&menu-izquierda=false" class="w-100P h-100P border-0"></iframe>
                                `
                        })
                }}
                className={
                        (ocultar ? 'd-none' : '') +
                        (usuario["ESTADO"] == 1 ? ' b-s-1px-darkgreen' : ' b-s-1px-darkred') +
                        " usuario c-white m-5"
                }>
                        <div className="d-inline-block usuario-imagen pad-20">
                                <Avatar style={{ backgroundColor: `hsl(${(12 * (usuario["NOMBRE"].charCodeAt(0) + usuario["APELLIDO"].charCodeAt(0))) % 360}, 100%, 30%)` }}>
                                        {usuario["NOMBRE"][0]}{usuario["APELLIDO"][0]}
                                </Avatar>
                        </div>
                        <div className="usuario-nombre d-inline-block" style={{ width: 150, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "left" }}>
                                {usuario["NOMBRE"]} {usuario["APELLIDO"]}
                        </div>
                </Button>
        );
}

socket.on("Todos los usuarios: respuesta", (usuarios) => {
        if (![1, 2].includes(user["FK_PERFIL"])) {
                return ReactDOM.render(
                        <React.Fragment>
                                <h3>
                                        Estás sin usuarios
                                </h3>
                        </React.Fragment>
                        , document.querySelector(".ultimos-usuarios-modificados")
                );
        }
        usuarios = usuarios.filter(e => e["LOGIN"] != user["LOGIN"]);
        usuarios = usuarios.filter(e => e["FK_PERFIL"] > user["FK_PERFIL"]);
        ReactDOM.render(
                <React.Fragment>
                        <h1>
                                Usuarios
                        </h1>
                        {
                                usuarios.map((usuario, index) => {
                                        return <Usuario usuario={usuario} ocultar={index >= 12}/>
                                })
                        }
                        <br />
                        <br />
                        <Button className="ver-todos-usuarios" onClick={() => {
                                document.querySelector(".ver-todos-usuarios").classList.add("d-none");
                                document.querySelector(".ver-menos-usuarios").classList.remove("d-none");
                                document.querySelectorAll(".usuario").forEach(e => e.classList.remove("d-none"));
                        }}>
                                Ver todos
                        </Button>
                        <Button className="ver-menos-usuarios d-none" onClick={() => {
                                document.querySelector(".ver-todos-usuarios").classList.remove("d-none");
                                document.querySelector(".ver-menos-usuarios").classList.add("d-none");
                                document.querySelectorAll(".usuario").forEach((e, i) => {
                                        if (i >= 12) {
                                                e.classList.add("d-none");
                                        }
                                });
                        }}>
                                Ver menos
                        </Button>
                        <br />
                        <br />
                </React.Fragment>
                , document.querySelector(".ultimos-usuarios-modificados")
        );
});

socket.on("Hay un cambio en la tabla: tbl_usuario", () => {
        socket.emit("Todos los usuarios");
});

socket.emit("Todos los usuarios");
