let usuario = new URLSearchParams(window.location.search).get("usuario");

ReactDOM.createRoot(document.querySelector(".App")).render(
        <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="usuario d-inline-block pad-20 ta-center">
                </div>
        </ThemeProvider>
);

let empresasLista = [
        {
                NOMBRE: "Autobuses",
                PK_EMPRESA: 2
        },
        {
                NOMBRE: "Cootransneiva",
                PK_EMPRESA: 3
        },
        {
                NOMBRE: "Cootranshuila",
                PK_EMPRESA: 4
        },
        {
                NOMBRE: "Flotahuila",
                PK_EMPRESA: 5
        },
        {
                NOMBRE: "Coomotor",
                PK_EMPRESA: 6
        },
        {
                NOMBRE: "Lusitania",
                PK_EMPRESA: 14
        },
        {
                NOMBRE: "Clientes",
                PK_EMPRESA: 7
        },
        {
                NOMBRE: "Montebello",
                PK_EMPRESA: 11
        },
        {
                NOMBRE: "Empresas",
                PK_EMPRESA: 15
        },
        {
                NOMBRE: "Rapidofenix",
                PK_EMPRESA: 13
        },
        {
                NOMBRE: "Contransmelgar",
                PK_EMPRESA: 21
        },
        {
                NOMBRE: "Coobusan",
                PK_EMPRESA: 16
        },
        {
                NOMBRE: "Interno",
                PK_EMPRESA: 17
        },
        {
                NOMBRE: "Cootransangil",
                PK_EMPRESA: 18
        },
        {
                NOMBRE: "Villavicencio",
                PK_EMPRESA: 19
        },
        {
                NOMBRE: "Cooperativa",
                PK_EMPRESA: 25
        },
        {
                NOMBRE: "Acusosa",
                PK_EMPRESA: 26
        },
        {
                NOMBRE: "Cañaveral",
                PK_EMPRESA: 27
        },
        {
                NOMBRE: "Servitranstur",
                PK_EMPRESA: 28
        },
        {
                NOMBRE: "Tunja",
                PK_EMPRESA: 29
        },
        {
                NOMBRE: "Cootranstur",
                PK_EMPRESA: 30
        },
        {
                NOMBRE: "Cootransar",
                PK_EMPRESA: 31
        },
        {
                NOMBRE: "Yumbeños",
                PK_EMPRESA: 32
        },
        {
                NOMBRE: "Lineas del valle",
                PK_EMPRESA: 33
        },
        {
                NOMBRE: "Cootranscota",
                PK_EMPRESA: 34
        }
]

socket.on("Usuario: respuesta", (usuario) => {

        ReactDOM.createRoot(document.querySelector(".usuario")).render(
                <ThemeProvider theme={theme}>
                        <h1 style={{ margin: 0 }}>
                                Edición de usuario
                        </h1>
                        <br />
                        <TextField className="NOMBRE" size="small" variant="outlined" defaultValue={usuario["NOMBRE"]} label="Nombre" />
                        &nbsp;&nbsp;
                        <TextField className="APELLIDO" size="small" variant="outlined" defaultValue={usuario["APELLIDO"]} label="Apellido" />
                        <br />
                        <br />
                        <TextField className="CEDULA" size="small" variant="outlined" defaultValue={usuario["CEDULA"]} label="Cédula" />
                        &nbsp;&nbsp;
                        <TextField className="TELEFONO" size="small" variant="outlined" defaultValue={usuario["TELEFONO"]} label="Teléfono" />
                        <br />
                        <br />
                        <TextField className="LOGIN" size="small" variant="outlined" defaultValue={usuario["LOGIN"]} label="Login" />
                        &nbsp;&nbsp;
                        <TextField className="EMAIL" size="small" variant="outlined" defaultValue={usuario["EMAIL"]} label="Email" />
                        <br />
                        <br />
                        <div className="FK_PERFIL"></div>
                        <br />
                        <span className="ESTADO">
                                <FormControlLabel control={
                                        <Switch defaultChecked={usuario["ESTADO"] == 1} />
                                } label="Estado" />
                        </span>
                        <br />
                        <br />
                        <span className="EMPRESAS_CONTENEDOR d-inline-block">
                                <Empresas seleccion={
                                        (usuario["EMPRESAS_ACCESO"] ? JSON.parse(usuario["EMPRESAS_ACCESO"]) : undefined) ??
                                        empresasLista.filter((empresa) => usuario["FK_EMPRESA"] == empresa["PK_EMPRESA"])
                                } />
                        </span>
                        <br />
                        <br />
                        Habeas data: &nbsp; {
                                usuario["APELLIDO"] == 1 ?
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

        socket.emit("consultar tabla completa", "tbl_perfil");

        socket.on("tabla completa", ({ tabla, nombre }) => {
                ReactDOM.createRoot(document.querySelector(".FK_PERFIL")).render(
                        <ThemeProvider theme={theme}>
                                <FormControl size="small" style={{ width: 230 }}>
                                        <InputLabel style={{ backgroundColor: "#121212" }} >
                                                Perfil
                                        </InputLabel>
                                        <Select className="FK_PERFIL_SELECT" defaultValue={usuario["FK_PERFIL"]}  >
                                                {
                                                        tabla.map((perfil) => <MenuItem value={perfil["PK_PERFIL"]}>{perfil["NOMBRE_PERFIL"]}</MenuItem>)
                                                }
                                        </Select>
                                </FormControl>
                        </ThemeProvider>
                );
        });
});

let AutocompleteEmpresas = null;

function Empresas({ seleccion }) {
        return <Autocomplete
                multiple
                options={empresasLista}
                disableCloseOnSelect
                onChange={(event, newValue) => {
                        AutocompleteEmpresas = newValue;
                }}
                getOptionLabel={(option) => option["NOMBRE"]}
                defaultValue={empresasLista.filter((empresa) => seleccion.find(e => e["PK_EMPRESA"] == empresa["PK_EMPRESA"]))}
                renderOption={(props, option) => (
                        <li {...props}>
                                <Checkbox
                                        icon={<i class="fa-regular fa-square"></i>}
                                        checkedIcon={<i class="fa-solid fa-square-check"></i>}
                                        style={{ marginRight: 8 }}
                                        checked={(AutocompleteEmpresas ?? seleccion).find(e => e["PK_EMPRESA"] == option["PK_EMPRESA"]) ? true : false} />
                                {option["NOMBRE"]}
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

socket.on("Hay un cambio en la tabla: tbl_usuario", () => {
        socket.emit("Usuario", usuario);
});

function actualizaUsuario() {
        socket.emit("Usuario: editar", {
                NOMBRE: document.querySelector(".NOMBRE").querySelector("input").value,
                APELLIDO: document.querySelector(".APELLIDO").querySelector("input").value,
                CEDULA: document.querySelector(".CEDULA").querySelector("input").value,
                TELEFONO: document.querySelector(".TELEFONO").querySelector("input").value,
                LOGIN: document.querySelector(".LOGIN").querySelector("input").value,
                EMAIL: document.querySelector(".EMAIL").querySelector("input").value,
                FK_PERFIL: document.querySelector(".FK_PERFIL_SELECT").querySelector("input").value,
                ESTADO: document.querySelector(".ESTADO").querySelector("input").checked ? 1 : 0,
                EMPRESAS_ACCESO: JSON.stringify(AutocompleteEmpresas),
                usuario,
        });
}

socket.emit("Usuario", usuario);