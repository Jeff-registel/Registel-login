let info_perfiles;
let tipo_agrupamiento;
let ver_todos_usuarios = false;
let usuarios;

addLink("/login/index.css");

function App() {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <center>
                                <Paper className="ultimas-empresas-consultadas d-inline-block w-90P ta-left pad-20">
                                </Paper>
                                <br />
                                <br />
                                <Paper className="contenedor-usuarios d-inline-block w-90P">
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className="pad-20">
                                                <h1>
                                                        Usuarios
                                                </h1>

                                                <FormControl size="small" style={{ width: 230 }}>
                                                        <InputLabel style={{ backgroundColor: theme == darkTheme ? "#252525" : "white" }} >
                                                                Agrupamiento
                                                        </InputLabel>
                                                        <Select className="tipo-agrupamiento" onChange={() => {
                                                                setTimeout(() => {
                                                                        tipo_agrupamiento = document.querySelector(".tipo-agrupamiento input").value;
                                                                        console.log(tipo_agrupamiento);
                                                                        if (!tipo_agrupamiento) {
                                                                                ver_todos_usuarios = false;
                                                                        }
                                                                        render_todosLosUsuarios();
                                                                }, 0);
                                                        }} >
                                                                <MenuItem value="">(Ninguno)</MenuItem>
                                                                <MenuItem value="Alfabetico">Alfabético</MenuItem>
                                                                <MenuItem value="Perfil">Perfil</MenuItem>
                                                        </Select>
                                                </FormControl>

                                                <Box sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
                                                        <TextField label="Buscar" variant="outlined" className="buscar-empleados" onBlur={() => {
                                                                render_todosLosUsuarios();
                                                        }}
                                                                onKeyUp={(e) => {
                                                                        if (e.key == "Enter") {
                                                                                document.querySelector(".buscar-empleados input").blur();
                                                                        }
                                                                }}
                                                        />
                                                        &nbsp;
                                                        <Button variant="contained" color="secondary" onClick={() => {
                                                                render_todosLosUsuarios();
                                                        }}>
                                                                <i className="fa-solid fa-magnifying-glass"></i>
                                                        </Button>
                                                </Box>
                                        </div>

                                        <hr />

                                        <br />
                                        <div className="ultimos-usuarios-modificados pad-20">
                                        </div>
                                </Paper>
                        </center>
                </ThemeProvider>
        );
}

ReactDOM.render(<App />, document.querySelector('.App'));

async function render_empresasAcceso() {
        let empresas = (await (await fetch("/BD?queryURL2JSON=diccionarios/empresas.json")).json())["empresas"];

        Object.entries(empresas).forEach(([lugar, contenido]) => {
                Object.entries(contenido["Servicios"]).forEach(([servicio, contenidoServicio]) => {
                        if (!user["EMPRESAS_ACCESO"].find(e => e["ID"] == contenidoServicio["ID"])) {
                                delete empresas[lugar]["Servicios"][servicio];
                        }
                });
                if (Object.keys(empresas[lugar]["Servicios"]).length == 0) {
                        delete empresas[lugar];
                }
        });

        let lugares = []

        Object.entries(empresas).forEach(([lugar, contenido], index, array) => {
                lugares.push(
                        <React.Fragment>
                                <h1>
                                        {lugar}
                                </h1>
                                {
                                        Object.entries(contenido["Servicios"]).map(([servicio, contenidoServicio]) => {
                                                return (
                                                        <React.Fragment>
                                                                <Button href={`http://${contenidoServicio["DOMINIO"]}?usuario=${user["LOGIN"]}&contraseña=${cifradoCesar(localStorage.getItem("contraseña"))}`}
                                                                        target="_blank" className="c-white pad-10 b-s-1px-white-20_OP" color="primary" variant="contained" >
                                                                        {servicio}
                                                                </Button>
                                                                &nbsp;&nbsp;
                                                        </React.Fragment>
                                                )
                                        })
                                }
                                {
                                        index != array.length - 1 ?
                                                <React.Fragment>
                                                        <br /><br /><hr />
                                                </React.Fragment>
                                                : ""
                                }
                        </React.Fragment>
                );
        });

        ReactDOM.render(
                <React.Fragment>
                        <h1 className="ta-center">
                                Empresas
                        </h1>
                        {
                                lugares
                        }
                </React.Fragment>,
                document.querySelector(".ultimas-empresas-consultadas")
        );

}

async function render_todosLosUsuarios() {

        let contador_usuarios = 0;
        usuarios ??= (await (await fetch("/BD?queryURL2JSON=usuarios/:i=todo")).json());

        usuarios = usuarios.sort((a, b) => {
                if (a["NOMBRE"].toLowerCase() > b["NOMBRE"].toLowerCase()) {
                        return 1;
                } else if (a["NOMBRE"].toLowerCase() < b["NOMBRE"].toLowerCase()) {
                        return -1;
                }
                return 0;
        });

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
        usuarios = usuarios.filter(e => {
                if (user["FK_PERFIL"] == 1) {
                        return true;
                }
                if (e["PK"] == user["PK"]) {
                        return e["FK_PERFIL"] == user["FK_PERFIL"]
                }
                return e["FK_PERFIL"] > user["FK_PERFIL"];
        });

        let agrupador = {};

        if (agrupador) {
                for (let usuario of usuarios) {
                        let llave = "";
                        switch (tipo_agrupamiento) {
                                case "Perfil":
                                        info_perfiles ??= (await (await fetch("/BD?queryURL2JSON=diccionarios/perfiles-usuario.json")).json())["perfiles"];
                                        llave = info_perfiles.find(info_perfil => info_perfil["PK"] == usuario["FK_PERFIL"])["NOMBRE"];
                                        break;
                                case "Alfabetico":
                                        llave = usuario["NOMBRE"][0].toUpperCase();
                                        break;
                        }
                        agrupador[llave] ??= [];
                        agrupador[llave].push(usuario);
                }
        }

        ReactDOM.render(
                <ThemeProvider theme={theme}>
                        <ThemeProvider theme={lightTheme}>
                                {
                                        Object.entries(agrupador).map(([llave, _usuarios], index, array) => {
                                                return (
                                                        <React.Fragment>
                                                                {
                                                                        llave
                                                                                ?
                                                                                <h1 className="ta-left padw-40">
                                                                                        {llave}
                                                                                </h1>
                                                                                :
                                                                                ""
                                                                }
                                                                {
                                                                        _usuarios.map((usuario) => {
                                                                                return <Usuario usuario={usuario} />
                                                                        })
                                                                }
                                                                {
                                                                        index != array.length - 1 ?
                                                                                <React.Fragment>
                                                                                        <br />
                                                                                        <br />
                                                                                        <hr />
                                                                                </React.Fragment>
                                                                                : ""
                                                                }
                                                        </React.Fragment>
                                                )
                                        }) ?? ""

                                }
                        </ThemeProvider>
                        {
                                !tipo_agrupamiento ?
                                        <React.Fragment>
                                                <br />
                                                <br />
                                                <Button className="ver-todos-usuarios" onClick={() => {
                                                        ver_todos_usuarios = true;
                                                        document.querySelector(".ver-todos-usuarios").classList.add("d-none");
                                                        document.querySelector(".ver-menos-usuarios").classList.remove("d-none");
                                                        document.querySelectorAll(".usuario").forEach(e => e.classList.remove("d-none"));
                                                }}>
                                                        Ver todos
                                                </Button>
                                                <Button className="ver-menos-usuarios d-none" onClick={() => {
                                                        ver_todos_usuarios = false;
                                                        document.querySelector(".ver-todos-usuarios").classList.remove("d-none");
                                                        document.querySelector(".ver-menos-usuarios").classList.add("d-none");
                                                        let contador_usuarios = 0;
                                                        document.querySelectorAll(".usuario").forEach((e) => {
                                                                if (contador_usuarios >= 12) {
                                                                        e.classList.add("d-none");
                                                                }
                                                                if (document.querySelector(".filtro-buscar")) {
                                                                        if (!e.classList.contains("filtro-buscar")) {
                                                                                contador_usuarios++;
                                                                        }
                                                                } else {
                                                                        contador_usuarios++;
                                                                }
                                                        });
                                                }}>
                                                        Ver menos
                                                </Button>
                                                <br />
                                                <br />
                                        </React.Fragment>
                                        : ""
                        }
                </ThemeProvider>
                , document.querySelector(".ultimos-usuarios-modificados")
        );

        function Usuario({ usuario }) {
                let ocultar = contador_usuarios >= 12 && !ver_todos_usuarios && !tipo_agrupamiento;
                let filtro_buscar = false;
                let val_buscar = document.querySelector(".buscar-empleados input")?.value;
                if (val_buscar) {
                        let compareText = Object.values(usuario).join(" ").toLowerCase();
                        filtro_buscar = !compareText.includes(val_buscar.toLowerCase());
                }
                if (!ocultar && !filtro_buscar) {
                        contador_usuarios++;
                }
                return (
                        <Button
                                //href={`/login/admin/usuarios/editar?usuario=${usuario["PK"]}&menu-izquierda=false`}
                                onClick={() => {
                                        ventana_flotante["nueva-ventana"]({
                                                titulo_texto: "Editar usuario",
                                                html: `
                                                        <iframe src="/login/admin/usuarios/editar?usuario=${usuario["PK"]}&menu-izquierda=false" class="w-100P h-100P border-0"></iframe>
                                                `
                                        })
                                }}
                                className={`
                                        ${filtro_buscar ? 'filtro-buscar' : ''}
                                        ${ocultar ? 'd-none' : ''}
                                        ${theme == darkTheme ?
                                                usuario["ESTADO"] ? 'b-s-1px-darkgreen' : ' b-s-1px-darkred' :
                                                usuario["ESTADO"] ? 'b-s-2px-lime' : 'b-s-2px-red'
                                        }
                                        usuario ${colorTheme.fuente.clase} m-5
                                `}>
                                <div className="d-inline-block usuario-imagen pad-20">
                                        <Avatar style={{ backgroundColor: `hsl(${(12 * (usuario["NOMBRE"].charCodeAt(0) + usuario["APELLIDO"].charCodeAt(0))) % 360}, 100%, 30%)` }}>
                                                {usuario["NOMBRE"][0]}{usuario["APELLIDO"][0]}
                                        </Avatar>
                                </div>
                                <div className="usuario-nombre d-inline-block" style={{ width: 150, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "left" }}>
                                        {usuario["NOMBRE"]}&nbsp;{usuario["APELLIDO"]}
                                </div>
                        </Button>
                );
        }
}

socket.on("usuarios_modificados", async (usuariosMod) => {
        let selfUser = usuariosMod.find(e => e["PK"] == user["PK"]);
        if (selfUser) {
                let empresas_acceso_mod = (await (await fetch(`/BD?queryURL2JSON=usuarios/${user["PK"]}.json`)).json())["EMPRESAS_ACCESO"];
                user["EMPRESAS_ACCESO"] = empresas_acceso_mod;
                render_empresasAcceso();
        }
        usuarios ??= (await (await fetch("/BD?queryURL2JSON=usuarios/:i=todo")).json());
        render_todosLosUsuarios();
});

render_todosLosUsuarios();
render_empresasAcceso();