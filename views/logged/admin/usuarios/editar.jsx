let AutocompleteEmpresas = null;

let usuarioPK = new URLSearchParams(window.location.search).get("usuario");

let empresasLista;
let tipoDocumentoLista;

let usuarioBD;

render_usuario();

crearEstilo({
        ".menu-fijo-abajo": {
                position: "fixed !important",
                padding: 10,
                bottom: 0,
                right: 0,
                width: "100%",
                borderTop: "1px solid rgba(128,128,128,.5)",
                textAlign: "right",
                zIndex: 100,
        },
        "div.lh": {
                display: "inline-flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-evenly",
                columnGap: "15px",
                rowGap: "15px",
                margin: "15px",
        },
});

function App() {
        return (
                <AppLogged>
                        <div className="usuario ta-center">
                        </div>
                </AppLogged>
        );
}

async function render_usuario() {
        usuarioBD = (await (await fetch(`/BD?json-query=usuarios/${usuarioPK}/usuario.json`)).json());
        if (!empresasLista) {
                empresasLista = (await (await fetch(`/BD?json-query=diccionarios/empresas.json`)).json())["empresas"];
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
        tipoDocumentoLista ??= (await (await fetch(`/BD?json-query=diccionarios/tipo-documento.json`)).json())["tipo-documento"];
        ReactDOM.createRoot(document.querySelector(".usuario")).render(
                <ThemeProvider theme={theme}>
                        <h1 style={{ margin: 0 }}>
                                Edición de usuario
                        </h1>
                        <br />
                        <hr />
                        <h3>
                                Identidad
                        </h3>
                        <div className="lh">
                                <TextField className="NOMBRE" size="small" variant="outlined" defaultValue={usuarioBD["NOMBRE"]} label="Nombre" />
                                <TextField className="APELLIDO" size="small" variant="outlined" defaultValue={usuarioBD["APELLIDO"]} label="Apellido" />
                        </div>
                        <div className="lh">
                                <TipoDocumento />
                                <TextField className="CEDULA" size="small" variant="outlined" defaultValue={usuarioBD["CEDULA"]} label="Número" />
                        </div>
                        <hr />
                        <h3>
                                Contacto
                        </h3>
                        <div className="lh">
                                <TextField className="TELEFONO" size="small" variant="outlined" defaultValue={usuarioBD["TELEFONO"]} label="Teléfono" />
                                <TextField className="MOVIL" size="small" variant="outlined" defaultValue={usuarioBD["MOVIL"]} label="Móvil" />
                                <TextField className="DIRECCION" size="small" variant="outlined" defaultValue={usuarioBD["DIRECCION"]} label="Dirección" />
                        </div>
                        <hr />
                        <h3>
                                Usuario
                        </h3>
                        <div className="lh">
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                        <InputLabel>Login</InputLabel>
                                        <OutlinedInput
                                                className="LOGIN"
                                                size="small"
                                                endAdornment={
                                                        <InputAdornment position="end">
                                                                <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        edge="end"
                                                                >
                                                                        <i class="fa-solid fa-lock"></i>
                                                                </IconButton>
                                                        </InputAdornment>
                                                }
                                                defaultValue={usuarioBD["LOGIN"]}
                                                inputProps={{
                                                        readOnly: true,
                                                        disabled: true,
                                                }}
                                        />
                                </FormControl>
                                <TextField className="EMAIL" size="small" variant="outlined" defaultValue={usuarioBD["EMAIL"]} label="Email" />
                                <span className="FK_PERFIL d-inline-block" />
                        </div>
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
                        <br />
                        <br />
                        <br />
                        <br />
                        <Paper className="menu-fijo-abajo">
                                <Button variant="contained" color="primary" onClick={() => {
                                        //document.querySelector(".actualizar-usuario").style.display = "none";
                                        actualizaUsuario();
                                }} className="actualizar-usuario" startIcon={<i class="fa-solid fa-floppy-disk"></i>}
                                        style={{ display: "none" }}>
                                        Actualizar
                                </Button>
                        </Paper>

                </ThemeProvider>
        );


        await render_perfiles();

        document.querySelector(".actualizar-usuario").style.display = "";

        async function render_perfiles() {
                let perfiles = (await (await fetch(`/BD?json-query=diccionarios/perfiles-usuario.json`)).json())["perfiles"];
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

socket.on("global: usuarios modificados", (usuarios) => {
        usuarios.forEach(usuario => {
                if (usuario["PK"] == usuarioPK) {
                        render_usuario();
                }
        });
});


async function actualizaUsuario() {
        console.log(AutocompleteEmpresas ?? usuarioBD["EMPRESAS_ACCESO"] ?? []);
        let json = (await (await fetch(`/BD?json-query=${JSON.stringify({
                DOC: {
                        usuarios: {
                                [usuarioPK]: {
                                        "usuario.json": {
                                                NOMBRE: document.querySelector(".NOMBRE").querySelector("input").value,
                                                APELLIDO: document.querySelector(".APELLIDO").querySelector("input").value,
                                                FK_TIPO_DOCUMENTO: parseInt(document.querySelector(".TIPO_DOCUMENTO input").value),
                                                CEDULA: document.querySelector(".CEDULA").querySelector("input").value,
                                                TELEFONO: document.querySelector(".TELEFONO").querySelector("input").value,
                                                MOVIL: document.querySelector(".MOVIL").querySelector("input").value,
                                                DIRECCION: document.querySelector(".DIRECCION").querySelector("input").value,
                                                LOGIN: document.querySelector(".LOGIN").querySelector("input").value,
                                                EMAIL: document.querySelector(".EMAIL").querySelector("input").value,
                                                FK_PERFIL: parseInt(document.querySelector(".FK_PERFIL_SELECT").querySelector("input").value),
                                                ESTADO: document.querySelector(".ESTADO").querySelector("input").checked,
                                                EMPRESAS_ACCESO: AutocompleteEmpresas ?? usuarioBD["EMPRESAS_ACCESO"] ?? [],
                                        }
                                }
                        }
                }
        })}`)).json());

        console.log(json);

        if (json["ok"]) {
                swal.fire({
                        title: "Usuario actualizado",
                        icon: "success",
                        confirmButtonText: "Ok",
                        timer: 2000,
                });
        }
        if (json["error"]) {
                swal.fire({
                        title: "Error",
                        text: json["error"],
                        icon: "error",
                        confirmButtonText: "Ok",
                });
        }
}