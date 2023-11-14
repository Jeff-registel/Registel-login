let AutocompleteEmpresas = null;

let usuarioPK = new URLSearchParams(window.location.search).get("usuario");

let empresasLista;
let tipoDocumentoLista;

let usuarioBD;

render_usuario();

ReactDOM.createRoot(document.querySelector(".App")).render(
        <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="usuario d-inline-block pad-20 ta-center">
                </div>
        </ThemeProvider>
);

async function render_usuario() {
        usuarioBD = (await (await fetch(`/BD?queryURL2JSON=usuarios/${usuarioPK}.json`)).json());
        if (!empresasLista) {
                empresasLista = (await (await fetch(`/BD?queryURL2JSON=diccionarios/empresas.json`)).json())["empresas"];
                let empresasResumen = [];
                let lugares = Object.keys(empresasLista);
                lugares.forEach(lugar => {
                        let servicios = empresasLista[lugar]["Servicios"];
                        let nombresServicios = Object.keys(servicios);
                        nombresServicios.forEach(nombreServicio => {
                                let servicio = servicios[nombreServicio];
                                empresasResumen.push({
                                        "NOMBRE_SERVICIO": nombreServicio,
                                        ...servicio
                                });
                        });
                });
                empresasLista = empresasResumen;
        }
        tipoDocumentoLista ??= (await (await fetch(`/BD?queryURL2JSON=diccionarios/tipo-documento.json`)).json())["tipo-documento"];
        ReactDOM.createRoot(document.querySelector(".usuario")).render(
                <ThemeProvider theme={theme}>
                        <h1 style={{ margin: 0 }}>
                                Edición de usuario
                        </h1>
                        <br />
                        <TextField className="NOMBRE" size="small" variant="outlined" defaultValue={usuarioBD["NOMBRE"]} label="Nombre" />
                        &nbsp;&nbsp;
                        <TextField className="APELLIDO" size="small" variant="outlined" defaultValue={usuarioBD["APELLIDO"]} label="Apellido" />
                        <br />
                        <br />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <TipoDocumento />
                                &nbsp;&nbsp;
                                <TextField className="CEDULA" size="small" variant="outlined" defaultValue={usuarioBD["CEDULA"]} label="Número" />
                        </div>
                        <br />
                        <TextField className="TELEFONO" size="small" variant="outlined" defaultValue={usuarioBD["TELEFONO"]} label="Teléfono" />
                        <br />
                        <br />
                        <TextField className="LOGIN" size="small" variant="outlined" defaultValue={usuarioBD["LOGIN"]} label="Login" />
                        &nbsp;&nbsp;
                        <TextField className="EMAIL" size="small" variant="outlined" defaultValue={usuarioBD["EMAIL"]} label="Email" />
                        <br />
                        <br />
                        <div className="FK_PERFIL"></div>
                        <br />
                        <span className="ESTADO">
                                <FormControlLabel control={
                                        <Switch defaultChecked={usuarioBD["ESTADO"] == 1} />
                                } label="Estado" />
                        </span>
                        <br />
                        <br />
                        <span className="EMPRESAS_CONTENEDOR d-inline-block">
                                <Empresas seleccion={
                                        (usuarioBD["EMPRESAS_ACCESO"] ?? [])
                                } />
                        </span>
                        <br />
                        <br />
                        Habeas data: &nbsp; {
                                usuarioBD["HABEAS_DATA"] == 1 ?
                                        <span className="c-lime">
                                                Si
                                        </span> :
                                        <span className="c-red">
                                                No
                                        </span>
                        }
                        <br />
                        <br />
                        <Button variant="contained" color="primary" onClick={() => {
                                document.querySelector(".actualizar-usuario").style.display = "none";
                                actualizaUsuario();
                        }} className="actualizar-usuario" startIcon={<i class="fa-solid fa-floppy-disk"></i>}
                        style={{ display: "none" }}>
                                Actualizar
                        </Button>
                </ThemeProvider>
        );


        await render_perfiles();

        document.querySelector(".actualizar-usuario").style.display = "";

        async function render_perfiles() {
                let perfiles = (await (await fetch(`/BD?queryURL2JSON=diccionarios/perfiles-usuario.json`)).json())["perfiles"];
                ReactDOM.createRoot(document.querySelector(".FK_PERFIL")).render(
                        <ThemeProvider theme={theme}>
                                <FormControl size="small" style={{ width: 230 }}>
                                        <InputLabel style={{ backgroundColor: theme == darkTheme ? "#121212" : "white" }} >
                                                Perfil
                                        </InputLabel>
                                        <Select className="FK_PERFIL_SELECT" defaultValue={usuarioBD["FK_PERFIL"]}  >
                                                {
                                                        perfiles.map((perfil) => <MenuItem value={perfil["PK"]}>{perfil["NOMBRE"]}</MenuItem>)
                                                }
                                        </Select>
                                </FormControl>
                        </ThemeProvider>
                );
        }
}


function TipoDocumento() {
        return <Select className="TIPO_DOCUMENTO" defaultValue={tipoDocumentoLista.find((tipoDocumento) => tipoDocumento["PK"] == user["FK_TIPO_DOCUMENTO"])["PK"]}>
                {
                        tipoDocumentoLista.map((tipoDocumento) => <MenuItem value={tipoDocumento["PK"]}>{tipoDocumento["NOMBRE"]}</MenuItem>)
                }
        </Select>;
}

function Empresas({ seleccion }) {
        return <Autocomplete
                multiple
                options={empresasLista}
                disableCloseOnSelect
                onChange={(event, newValue) => {
                        AutocompleteEmpresas = newValue;
                }}
                getOptionLabel={(empresa) => empresa["NOMBRE_SERVICIO"]}
                defaultValue={empresasLista.filter((empresa) => seleccion.find(e => e["ID"] == empresa["ID"]))}
                renderOption={(props, empresa) => (
                        <li {...props}>
                                <Checkbox
                                        icon={<i class="fa-regular fa-square"></i>}
                                        checkedIcon={<i class="fa-solid fa-square-check"></i>}
                                        style={{ marginRight: 8 }}
                                        checked={(AutocompleteEmpresas ?? seleccion).find(e => e["ID"] == empresa["ID"]) ? true : false} />
                                {empresa["NOMBRE_SERVICIO"]}
                        </li>
                )}
                style={{ width: 400 }}
                renderInput={(params) => (
                        <TextField {...params} label="Empresas" />
                )} />;
}

socket.on("usuarios_modificados", (usuarios) => {
        usuarios.forEach(usuario => {
                if (usuario["PK"] == usuarioPK) {
                        render_usuario();
                }
        });
});


async function actualizaUsuario() {
        let json = (await (await fetch(`/BD?queryJSON-EXEC=${JSON.stringify({
                DOC: {
                        usuarios: {
                                [`${usuarioPK}.json`]: {
                                        NOMBRE: document.querySelector(".NOMBRE").querySelector("input").value,
                                        APELLIDO: document.querySelector(".APELLIDO").querySelector("input").value,
                                        FK_TIPO_DOCUMENTO: parseInt(document.querySelector(".TIPO_DOCUMENTO input").value),
                                        CEDULA: document.querySelector(".CEDULA").querySelector("input").value,
                                        TELEFONO: document.querySelector(".TELEFONO").querySelector("input").value,
                                        LOGIN: document.querySelector(".LOGIN").querySelector("input").value,
                                        EMAIL: document.querySelector(".EMAIL").querySelector("input").value,
                                        FK_PERFIL: parseInt(document.querySelector(".FK_PERFIL_SELECT").querySelector("input").value),
                                        ESTADO: document.querySelector(".ESTADO").querySelector("input").checked,
                                        EMPRESAS_ACCESO: AutocompleteEmpresas ?? usuarioBD["EMPRESAS_ACCESO"] ?? [],
                                }
                        }
                }
        })}
        &usuario=${JSON.stringify({
                LOGIN: user["LOGIN"],
                PK: user["PK"],
        })}
        `)).json());
        switch (json.status) {
                case "ok!":
                        swal.fire({
                                title: "Usuario actualizado",
                                icon: "success",
                                confirmButtonText: "Ok",
                                timer: 2000,
                        });
                        break;
                case "error!":
                        swal.fire({
                                title: "Error",
                                icon: "error",
                                confirmButtonText: "Ok",
                        });
                        break;
        }
}