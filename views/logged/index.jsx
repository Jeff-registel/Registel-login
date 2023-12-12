let info_perfiles;
let tipo_agrupamiento;
let ver_todos_usuarios = false;
let usuarios;

let actualizarListaDeUsuarios = true;

if (!user) {
        window.location.href = "/";
}

addLink("/logged/index.css");

crearEstilo({
        ".usuario": {
                border: "1px solid rgba(255, 255, 255, 0.1)",
        },

        ".filtro-buscar": {
                display: "none !important",
        },
        "usuario-punto-estado": {
                position: "absolute",
                width: 5,
                height: 5,
                borderRadius: 10,
                top: 5,
                left: 5,
        }
});

function App() {
        return (
                <AppLogged>
                        <center>
                                <h1>
                                        ¡Bienvenido! {user["NOMBRE"]} {user["APELLIDO"]}
                                </h1>
                                <Paper className="ultimas-empresas-consultadas d-inline-block w-90P ta-left pad-20" elevation={3}>
                                </Paper>
                                <br />
                                <br />
                                <Paper className="contenedor-usuarios d-inline-block w-90P" elevation={3}>
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
                                                                console.log("click");
                                                                render_todosLosUsuarios();
                                                        }}>
                                                                <i className="fa-solid fa-magnifying-glass" />
                                                        </Button>
                                                </Box>
                                        </div>

                                        <hr />

                                        <br />
                                        <div className="ultimos-usuarios-modificados pad-20">
                                        </div>
                                </Paper>
                        </center>
                </AppLogged>
        );
}

async function render_empresasAcceso() {
        let empresas = (await (await fetch("/BD?json-query=diccionarios/empresas.json")).json())["empresas"];

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

        console.log(Object.values(empresas).flat().reduce((acc, cur) => {
                acc = {
                        ...acc,
                        ...cur["Servicios"]
                }
                return acc;
        }, {}));

        let empresasLista = Object.entries(Object.values(empresas).flat().reduce((acc, cur) => {
                acc = {
                        ...acc,
                        ...cur["Servicios"]
                }
                return acc;
        }, {})).sort(([servicioA, contenidoServicioA], [servicioB, contenidoServicioB]) => {
                if (servicioA.toLowerCase() > servicioB.toLowerCase()) {
                        return 1;
                }
                if (servicioA.toLowerCase() < servicioB.toLowerCase()) {
                        return -1;
                }
                return 0;
        }).map(([servicio, contenidoServicio], index, array) => {
                return (
                        <React.Fragment>
                                <Button href={`http://${contenidoServicio["DOMINIO"]}?usuario=${user["LOGIN"]}&contraseña=${cifradoCesar(localStorage.getItem("contraseña"))}`}
                                        target="_blank" className="c-white pad-10 b-s-1px-white-20_OP" color="primary" variant="contained" >
                                        {servicio}
                                </Button>
                                &nbsp;&nbsp;
                        </React.Fragment>
                )
        });

        ReactDOM.render(
                <React.Fragment>
                        <h1 className="ta-center">
                                Empresas
                        </h1>
                        {
                                empresasLista
                        }
                </React.Fragment>,
                document.querySelector(".ultimas-empresas-consultadas")
        );

}

async function render_todosLosUsuarios() {
        let contador_usuarios = 0;

        if (actualizarListaDeUsuarios) {
                usuarios = await MACRO({
                        macro: "authreq/nodos/usuarios/todos",
                });
                actualizarListaDeUsuarios = false;
        }
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
                                        info_perfiles ??= (await MACRO({
                                                macro: "public/diccionarios",
                                                parametros: {
                                                        "diccionario": "perfil"
                                                }
                                        }));
                                        if (info_perfiles["error"]) {
                                                return swal.fire({
                                                        title: "Error",
                                                        text: info_perfiles["error"],
                                                        icon: "error",
                                                });
                                        }
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
                <React.Fragment>
                        <BloqueDeUsuarios />
                        <BotonesControlVisualizacionUsuarios />
                </React.Fragment>
                , document.querySelector(".ultimos-usuarios-modificados")
        );

        contador_usuarios = 0;

        (async () => {
                let i = 0;
                for (let usuario of usuarios) {
                        ReactDOM.render(
                                <AppRender>
                                        <Usuario usuario={usuario} />
                                </AppRender>
                                , document.querySelector(`.PK-${usuario["PK"]}`)
                        )
                        if (i++ % 100 == 0) {
                                await new Promise((resolve) => {
                                        setTimeout(() => {
                                                resolve();
                                        }, 0);
                                });
                        }
                }
        })();

        function BotonesControlVisualizacionUsuarios() {
                return !tipo_agrupamiento ?
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
                                        render_todosLosUsuarios();
                                }}>
                                        Ver menos
                                </Button>
                                <br />
                                <br />
                        </React.Fragment>
                        : "";
        }

        function BloqueDeUsuarios() {
                return (
                        <div style={{ textAlign: "left" }}>
                                {Object.entries(agrupador).map(([llave, _usuarios], index, array) => {
                                        return (
                                                <React.Fragment>
                                                        {llave
                                                                ?
                                                                <h1 className="ta-left padw-40">
                                                                        {llave}
                                                                </h1>
                                                                :
                                                                ""}
                                                        {_usuarios.map((usuario) => {
                                                                return <UsuarioSkeleton usuario={usuario} />;
                                                        })}
                                                        {index != array.length - 1 ?
                                                                <React.Fragment>
                                                                        <br />
                                                                        <br />
                                                                        <hr />
                                                                </React.Fragment>
                                                                : ""}
                                                </React.Fragment>
                                        );
                                }) ?? ""}
                        </div>
                )
        }

        function UsuarioSkeleton({ usuario }) {
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
                        <div className={`
                                PK-${usuario["PK"]}
                                d-inline-block
                        `}>
                                <FormControl component="fieldset" className={`
                                        ${filtro_buscar ? 'filtro-buscar' : ''}
                                        ${ocultar ? 'd-none' : ''}
                                        usuario
                                `}>
                                        <FormGroup
                                                className={`
                                                        p-relative 
                                                        d-inline-flex 
                                                        flex-row 
                                                        m-5px 
                                                        b-s-1px-neutro2
                                                `}>
                                                <span
                                                        className="
                                                                usuario-punto-estado
                                                                bg-lime 
                                                                op-50P
                                                        "
                                                />
                                                <div className="d-inline-block usuario-imagen pad-10">
                                                        <Skeleton variant="circular" width={60} height={60} />
                                                </div>
                                                <div className="usuario-nombre d-inline-block tt-normal" style={{ width: 120, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "left" }}>
                                                        <Skeleton variant="text" width={200} height={20} />
                                                </div>
                                        </FormGroup>
                                </FormControl>
                        </div>
                )
        }

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
                        <FormControl component="fieldset" className={`
                                ${filtro_buscar ? 'filtro-buscar' : ''}
                                ${ocultar ? 'd-none' : ''}
                                usuario
                        `}>
                                <FormGroup
                                        className={`
                                                p-relative
                                                d-inline-flex 
                                                flex-row
                                                m-5px
                                                b-s-1px-neutro2
                                        `}>
                                        <span
                                                className={`
                                                        usuario-punto-estado
                                                        ${usuario["ESTADO"] ? 'bg-lime' : 'bg-red'}
                                                        op-50P
                                                `}
                                        />
                                        <Tooltip
                                                title={usuario["NOMBRE"] + " " + usuario["APELLIDO"]}
                                                arrow

                                        >
                                                <Button
                                                        /* href={`/logged/admin/usuarios/editar?usuario=${usuario["PK"]}`} */
                                                        onClick={abrirVentanaFlotanteUsuario}
                                                        className={`
                                                        usuario 
                                                        ${colorTheme.fuente.clase}
                                                `}>
                                                        <div className="d-inline-block usuario-imagen pad-10">
                                                                <ThemeProvider theme={lightTheme}>
                                                                        <Avatar style={{ backgroundColor: `hsl(${(12 * (usuario["NOMBRE"].charCodeAt(0) + usuario["APELLIDO"].charCodeAt(0))) % 360}, 100%, 30%)` }}>
                                                                                {usuario["NOMBRE"][0]}{usuario["APELLIDO"][0]}
                                                                        </Avatar>
                                                                </ThemeProvider>
                                                        </div>
                                                        <div
                                                                className="usuario-nombre d-inline-block tt-normal"
                                                                style={{ width: 120, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "left" }}
                                                        >
                                                                {usuario["NOMBRE"]}&nbsp;{usuario["APELLIDO"]}
                                                        </div>
                                                </Button>
                                        </Tooltip>
                                        <ButtonGroup
                                                orientation="vertical"
                                                variant="contained"
                                                color={
                                                        "secondary"
                                                }
                                        >
                                                <Tooltip
                                                        title="Editar aquí"
                                                        arrow
                                                        placement="right"
                                                >
                                                        <Button
                                                                target="_blank"
                                                                style={{ padding: 15, minWidth: 0 }}
                                                                onClick={abrirVentanaFlotanteUsuario}
                                                        >
                                                                <i class="fa-regular fa-window-restore" />
                                                        </Button>
                                                </Tooltip>
                                                <Tooltip
                                                        title="Editar en otra pestaña"
                                                        arrow
                                                        placement="right"
                                                >
                                                        <Button
                                                                href={`/logged/admin/usuarios/editar?usuario=${usuario["PK"]}`}
                                                                target="_blank"
                                                                style={{ padding: 15, minWidth: 0 }}
                                                        >
                                                                <i class="fa-solid fa-up-right-from-square" />
                                                        </Button>
                                                </Tooltip>
                                        </ButtonGroup>
                                </FormGroup>
                        </FormControl>
                );

                function abrirVentanaFlotanteUsuario() {
                        let url = `/logged/admin/usuarios/editar?usuario=${usuario["PK"]}&ventana-flotante=true`;
                        generarVentanaFlotanteRapido({
                                url,
                                titulo: "Editar usuario"
                        })
                }
        }
}

socket.on("global: usuarios modificados", async (usuariosMod) => {
        let selfUser = usuariosMod.find(e => e["PK"] == user["PK"]);
        if (selfUser) {
                let empresas_acceso_mod = (await (await fetch(`/BD?json-query=usuarios/${user["PK"]}/usuario.json`)).json())["EMPRESAS_ACCESO"];
                user["EMPRESAS_ACCESO"] = empresas_acceso_mod;
                render_empresasAcceso();
        }
        usuariosMod.forEach(usuarioMod => {
                ReactDOM.render(
                        <AppRender>
                                <Usuario usuario={usuarioMod} />
                        </AppRender>
                        , document.querySelector(`.PK-${usuarioMod["PK"]}`)
                )
        });
});

render_todosLosUsuarios();
render_empresasAcceso();