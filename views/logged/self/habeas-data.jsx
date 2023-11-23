crearEstilo({
        ".app": {
                maxWidth: "1000px",
                margin: "auto",
        },
})

let tipoDocumentoLista;

async function App() {
        tipoDocumentoLista ??= (await JSONBD("diccionarios/tipo-documento.json"))["tipo-documento"];
        return (
                <AppLogged>
                        <Paper elevation={3} className="pad-20">
                                <h1 className="ta-center">
                                        Hábeas Data <i class="fa-solid fa-file-lines" />
                                </h1>
                                <h2>
                                        Usuario: {user["LOGIN"] ?? ""}
                                </h2>
                                Solicitamos aceptar la política de tratamiento de datos personales y/o actualizar su información de perfil.
                                <h2>
                                        Datos personales
                                </h2>
                                <TextField className="NOMBRE m-10" label="Nombre" value={user["NOMBRE"] ?? ""} required />
                                <TextField className="APELLIDO m-10" label="Apellido" value={user["APELLIDO"] ?? ""} required />
                                <TipoDocumento />
                                <TextField className="CEDULA m-10" label="Número de documento" value={user["CEDULA"] ?? ""} required />
                                <h2>
                                        Contacto
                                </h2>
                                <TextField className="EMAIL m-10" label="Email" value={user["EMAIL"] ?? ""} required />
                                <TextField className="MOVIL m-10" label="Celular" value={user["MOVIL"] ?? ""} required />
                                <TextField className="TELEFONO m-10" label="Teléfono" value={user["TELEFONO"] ?? ""} />
                                <TextField className="DIRECCION m-10" label="Dirección" value={user["DIRECCION"] ?? ""} />
                                <br /><br /><hr /><br />
                                Sus datos personales han sido y están siendo tratados conforme con nuestra Política de Tratamiento
                                de Datos Personales.
                                <br />
                                Para mayor información podrá consultar nuestra política en el documento:
                                <br />
                                <br />
                                <Link href="/PDF/POL-VTAS-0003_POLITICA_DE_PRIVACIDAD.pdf" target="_blank">
                                        Política de Privacidad
                                </Link>
                                &nbsp;
                                <i class="fa-regular fa-window-restore c-dodgerblue c-pointer" onClick={() => {
                                        generarVentanaFlotanteRapido({
                                                url: "/PDF/POL-VTAS-0003_POLITICA_DE_PRIVACIDAD.pdf",
                                                titulo: "",
                                        })
                                }} />
                                <br /><br />
                                <FormControlLabel control={<Switch id="aceptar" />} label="Política aceptada" />
                                <div className="ta-right">
                                        <Button variant="contained" color="primary" size="large" endIcon={<i class="fa-solid fa-save" />} onClick={Actualizar}>
                                                Actualizar
                                        </Button>
                                </div>
                        </Paper>
                </AppLogged>
        )

        function TipoDocumento() {
                return <Select className="TIPO_DOCUMENTO m-10" defaultValue={tipoDocumentoLista.find((tipoDocumento) => tipoDocumento["PK"] == user["FK_TIPO_DOCUMENTO"])["PK"]}>
                        {
                                tipoDocumentoLista.map((tipoDocumento) => <MenuItem value={tipoDocumento["PK"]}>{tipoDocumento["NOMBRE"]}</MenuItem>)
                        }
                </Select>;
        }

        async function Actualizar() {
                let datos = {
                        NOMBRE: document.querySelector(".NOMBRE input").value,
                        APELLIDO: document.querySelector(".APELLIDO input").value,
                        FK_TIPO_DOCUMENTO: parseInt(document.querySelector(".TIPO_DOCUMENTO input").value),
                        CEDULA: document.querySelector(".CEDULA input").value,
                        EMAIL: document.querySelector(".EMAIL input").value,
                        MOVIL: document.querySelector(".MOVIL input").value,
                        HABEAS_DATA: document.querySelector("#aceptar").checked,
                };

                if (Object.values(datos).some((valor) => !valor)) {
                        return swal.fire({
                                title: "Error",
                                text: "Por favor ingrese todos los datos",
                                icon: "error",
                                timer: 3000
                        });
                }

                Object.assign(datos, {
                        TELEFONO: document.querySelector(".TELEFONO input").value,
                        DIRECCION: document.querySelector(".DIRECCION input").value,
                });

                let json = await JSONBD("", {
                        DOC: {
                                usuarios: {
                                        [user["PK"]]: {
                                                "usuario.json": datos
                                        }
                                }
                        }
                });

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
}