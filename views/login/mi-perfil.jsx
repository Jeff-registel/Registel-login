async function App() {
        let perfiles_usuario = (await (await fetch("/BD?queryURL2JSON=diccionarios/perfiles-usuario.json")).json())["perfiles"];
        let tipo_documento = (await (await fetch("/BD?queryURL2JSON=diccionarios/tipo-documento.json")).json())["tipo-documento"];

        let titulo = <h1>
                {user["NOMBRE"]} {user["APELLIDO"]} ({user["LOGIN"]})
        </h1>

        let perfil = perfiles_usuario.find(info_perfil => info_perfil["PK"] == user["FK_PERFIL"])["NOMBRE"];

        let empresasAcceso = user["EMPRESAS_ACCESO"].sort((empresaA, empresaB)=>{
                if(empresaA["NOMBRE_SERVICIO"] < empresaB["NOMBRE_SERVICIO"]){
                        return -1;
                }
                if(empresaA["NOMBRE_SERVICIO"] > empresaB["NOMBRE_SERVICIO"]){
                        return 1;
                }
                return 0;
        }).map((empresa, index, array) => {
                return (
                        <span>
                                {empresa["NOMBRE_SERVICIO"]}
                                {index < array.length - 1 ? ", " : ""}
                        </span>
                )
        });

        let nombre_tipo_documento = tipo_documento.find((tipo) => tipo["PK"] == user["FK_TIPO_DOCUMENTO"])["NOMBRE"];

        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        {titulo}
                        <b>
                                Tipo de perfil:
                        </b>
                        &nbsp;
                        {perfil}
                        <br />
                        <b>
                                Empresas:
                        </b>
                        &nbsp;
                        {empresasAcceso}
                        <br />
                        <br />
                        <b>
                                {nombre_tipo_documento}:
                        </b>
                        &nbsp;
                        {user["CEDULA"]}
                        <br />
                        <b>E-mail:</b> {user["EMAIL"]}
                        <br />
                        <b>Móvil:</b> {user["MOVIL"] ?? "-"}
                        <br />
                </ThemeProvider>
        )
}

async function init() {
        let renderApp = await App();
        ReactDOM.render(
                renderApp,
                document.querySelector(".App")
        );
}

init();