crearEstilo({
    ".enlaces-empresa-usuario-app": {
        overflow: "auto",
        height: "calc(100vh - 200px)",
        "& table": {
            width: "100%",
            "& tr": {
                "& th, & td": {
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    padding: "10px",
                    textAlign: "center",
                }
            }
        }
    }
})

function App() {
    return (
        <AppLogged>
            <h1>
                Enlaces de la empresa y el usuario
            </h1>
            <Paper className="pad-20">
                <div className="usuario-enlaces-empresa-app" />
            </Paper>
        </AppLogged>
    )

}

let empresas;
let usuarios;
let enlaces;

async function actualizarEnlaces() {
    enlaces = await MACRO({
        macro: "authreq/enlaces/consulta/empresa-usuario",
    });
}

async function onLoad() {
    empresas = await MACRO({
        macro: "public/diccionarios",
        parametros: {
            diccionario: "empresa"
        }
    });
    usuarios = await MACRO({
        macro: "authreq/nodos/usuarios/todos",
    });
    await actualizarEnlaces();

    ReactDOM.render(
        <AppRender>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={
                    usuarios.map(usuario => {
                        return {
                            label: usuario["LOGIN"],
                            value: usuario["PK"],
                        } || []
                    })
                }
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Usuario login" />}
                onChange={(event, value) => {
                    cargarEnlacesDeEmpresa(value);
                }}
            />
            <div className="empresas-enlace" />
        </AppRender>
        ,
        document.querySelector(".usuario-enlaces-empresa-app")
    );

    function cargarEnlacesDeEmpresa(usuarioPK) {
        if (!usuarioPK) {
            ReactDOM.render(
                <React.Fragment />,
                document.querySelector(".empresas-enlace")
            );
            return
        }
        usuarioPK = usuarioPK["value"];

        console.log("usuarioPK", usuarioPK);

        ReactDOM.render(
            <AppRender>
                {empresas.map(empresa => {
                    return (
                        <div>
                            <label className="contenedor-checkbox-dinamico c-pointer" >
                                <Checkbox
                                    className={`enlace-empresa-${empresa["PK"]}`}
                                    data-empresa={empresa["PK"]}
                                    onChange={async () => {
                                        let checkedDOM = document.querySelector(
                                            `.enlace-empresa-${empresa["PK"]}`
                                        );
                                        let checked = checkedDOM.checked;
                                        let respuesta = await MACRO({
                                            macro: "authreq/enlaces/enlazar/empresa-usuario",
                                            parametros: {
                                                empresa: empresa["PK"],
                                                usuario: usuarioPK,
                                                estado: !checked ? 1 : 0,
                                            }
                                        });
                                        if (respuesta["error"]) {
                                            return swal.fire({
                                                title: "Error",
                                                text: respuesta["error"],
                                                icon: "error",
                                            });
                                        }
                                        actualizarEnlaces();
                                    }}
                                />
                                <i className="fas fa-check-circle true c-dodgerblue" />
                                <i className="fa-regular fa-circle-xmark false" />
                                &nbsp;
                                {empresa["NOMBRE"]}
                            </label>
                        </div>
                    );
                })}
            </AppRender>,
            document.querySelector(".empresas-enlace")
        );

        setTimeout(() => {
            enlaces.filter(enlace => {
                return enlace["FK_USUARIO"] == usuarioPK;
            }).forEach(enlace => {
                console.log("enlace", enlace);
                let checkedDOM = document.querySelector(
                    `.enlace-empresa-${enlace["FK_EMPRESA"]}`
                );
                if (!checkedDOM) {
                    return;
                }
                checkedDOM.checked = enlace["ESTADO"] == 1;
            });
        }, 1000);

    }
}

function CargarTablaRelaciones() {
    return <table cellPadding={0} cellSpacing={0} style={{
        userSelect: "none",
    }}>
        <thead style={{
            position: "sticky",
            top: "0px",
        }}>
            <tr>
                <th className="bg-gray">
                </th>
                {empresas.map(empresa => {
                    return (
                        <th className="bg-gray">
                            {empresa["NOMBRE"]}
                        </th>
                    );
                })}
            </tr>
        </thead>
        <tbody>
            {usuarios.map(usuario => {
                return (
                    <tr>
                        <td className="bg-gray" style={{
                            position: "sticky",
                            left: "0px",
                        }}>
                            <small>
                                {usuario["NOMBRE"]} {usuario["APELLIDO"]}
                            </small>
                            <br />
                            <small>
                                {usuario["LOGIN"]}
                            </small> (<small>
                                {usuario["DOCUMENTO"]}
                            </small>)
                        </td>
                        {empresas.map(empresa => {
                            return (
                                <td className="b-s-1px-neutro2 c-pointer contenedor-checkbox-dinamico" onClick={() => {
                                    let checkedDOM = document.querySelector(
                                        `.enlace-empresa-usuario-${empresa["PK"]}-${usuario["PK"]}`
                                    );
                                    let checked = checkedDOM.checked;
                                    checkedDOM.checked = !checked;
                                    setTimeout(async () => {
                                        let respuesta = await MACRO({
                                            macro: "authreq/enlaces/enlazar/empresa-usuario",
                                            parametros: {
                                                empresa: empresa["PK"],
                                                usuario: usuario["PK"],
                                                estado: !checked ? 1 : 0,
                                            }
                                        });
                                        if (respuesta["error"]) {
                                            checkedDOM.checked = checked;
                                            return swal.fire({
                                                title: "Error",
                                                text: respuesta["error"],
                                                icon: "error",
                                            });
                                        }
                                        checkedDOM.checked = !checked;
                                    }, 0);
                                }}>
                                    <input type="checkbox"
                                        className={`
                                            enlace-empresa-usuario-${empresa["PK"]}-${usuario["PK"]}
                                            d-none
                                        `}
                                        data-empresa={empresa["PK"]}
                                        data-usuario={usuario["PK"]}
                                        defaultChecked={
                                            enlaces.find(enlace => {
                                                return enlace["FK_EMPRESA"] == empresa["PK"] &&
                                                    enlace["FK_USUARIO"] == usuario["PK"];
                                            })?.["ESTADO"] == 1
                                        }
                                    />
                                    <i className="fas fa-check-circle true c-dodgerblue" />
                                    <i className="fa-regular fa-circle-xmark false" />
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    </table>;
}
