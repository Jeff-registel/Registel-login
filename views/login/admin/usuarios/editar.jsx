let AutocompleteEmpresas = null;

let usuarioPK = new URLSearchParams(window.location.search).get("usuario");

let empresasLista = [];

render_usuario();

ReactDOM.createRoot(document.querySelector(".App")).render(
        <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="usuario d-inline-block pad-20 ta-center">
                </div>
        </ThemeProvider>
);

async function render_usuario() {
        console.log("render_usuario");
        let usuarioBD = (await (await fetch(`/BD?queryURL2JSON=usuarios/${usuarioPK}.json`)).json());
        console.log("usuarioBD", usuarioBD);
        empresasLista = (await (await fetch(`/BD?queryURL2JSON=diccionarios/empresas.json`)).json());
        console.log("empresasLista", empresasLista);
        delete empresasLista["__atributos__"];
        {
                let empresasResumen = [];
                let lugares = Object.keys(empresasLista);
                lugares.forEach(lugar => {
                        console.log("lugar", lugar);
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
                console.log("empresasResumen", empresasResumen);
                empresasLista = empresasResumen;
        }
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
                        <TextField className="CEDULA" size="small" variant="outlined" defaultValue={usuarioBD["CEDULA"]} label="Cédula" />
                        &nbsp;&nbsp;
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
                                actualizaUsuario();
                        }} className="actualizar-usuario" startIcon={<i class="fa-solid fa-floppy-disk"></i>}>
                                Actualizar
                        </Button>
                </ThemeProvider>
        );


        render_perfiles();

        async function render_perfiles() {
                console.log("render_perfiles");
                let tabla = (await (await fetch(`/BD?queryURL2JSON=diccionarios/perfiles-usuario.json`)).json()).perfiles;
                console.log("tabla", tabla);
                ReactDOM.createRoot(document.querySelector(".FK_PERFIL")).render(
                        <ThemeProvider theme={theme}>
                                <FormControl size="small" style={{ width: 230 }}>
                                        <InputLabel style={{ backgroundColor: "#121212" }} >
                                                Perfil
                                        </InputLabel>
                                        <Select className="FK_PERFIL_SELECT" defaultValue={usuarioBD["FK_PERFIL"]}  >
                                                {
                                                        tabla.map((perfil) => <MenuItem value={perfil["PK_PERFIL"]}>{perfil["NOMBRE_PERFIL"]}</MenuItem>)
                                                }
                                        </Select>
                                </FormControl>
                        </ThemeProvider>
                );
        }
}


function Empresas({ seleccion }) {
        console.log("selected", seleccion);
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

socket.on("Usuario: editar: ok!", () => {
        console.log("ok");
        document.body.style.backgroundColor = "#122512";
});

socket.on("Usuario: editar: error!", () => {
        console.log("error");
        document.body.style.backgroundColor = "#251212";
});

socket.on("Hay un cambio en usuarios", async () => {
        socket.emit("Usuario", usuarioPK);
});

async function actualizaUsuario() {
        console.log(
                (await (await fetch(`/BD?queryJSON-EXEC=${JSON.stringify({
                        DOC: {
                                usuarios: {
                                        [`${usuarioPK}.json`]: {
                                                NOMBRE: document.querySelector(".NOMBRE").querySelector("input").value,
                                                APELLIDO: document.querySelector(".APELLIDO").querySelector("input").value,
                                                CEDULA: document.querySelector(".CEDULA").querySelector("input").value,
                                                TELEFONO: document.querySelector(".TELEFONO").querySelector("input").value,
                                                LOGIN: document.querySelector(".LOGIN").querySelector("input").value,
                                                EMAIL: document.querySelector(".EMAIL").querySelector("input").value,
                                                FK_PERFIL: document.querySelector(".FK_PERFIL_SELECT").querySelector("input").value,
                                                ESTADO: document.querySelector(".ESTADO").querySelector("input").checked,
                                                EMPRESAS_ACCESO: AutocompleteEmpresas ?? [],
                                        }
                                }
                        }
                })}`)).json())
        );
}