function App() {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <h1>
                                {user["NOMBRE"]} {user["APELLIDO"]} ({user["LOGIN"]})
                        </h1>
                        <b>Tipo de perfil:</b> <span id="FK_PERFIL"></span>
                        <br />
                        <b>Empresa:</b> <span id="FK_EMPRESA"></span>
                        <br />
                        <br />
                        <b><span id="FK_TIPO_DOCUMENTO"></span>:</b> {user["CEDULA"]}
                        <br />
                        <b>E-mail:</b> {user["EMAIL"]}
                        <br />
                        <b>Móvil:</b> {user["MOVIL"] ?? "-"}
                        <br />
                        
                </ThemeProvider>
        )
}

ReactDOM.render(<App />, document.querySelector(".App"));

socket.emit("consultar tabla completa", "tbl_perfil");
socket.emit("consultar tabla completa", "tbl_empresa");
socket.emit("consultar tabla completa", "tbl_tipo_documento");
socket.on("tabla completa", ({tabla, nombre}) => {
        switch (nombre) {
                case "tbl_perfil":
                        document.querySelector("#FK_PERFIL").innerHTML = tabla.find((fila) => fila["PK_PERFIL"] == user["FK_PERFIL"])["NOMBRE_PERFIL"];
                        break;
                case "tbl_empresa":
                        document.querySelector("#FK_EMPRESA").innerHTML = tabla.find((fila) => fila["PK_EMPRESA"] == user["FK_EMPRESA"])["NOMBRE"];
                        break;
                case "tbl_tipo_documento":
                        document.querySelector("#FK_TIPO_DOCUMENTO").innerHTML = tabla.find((fila) => fila["id"] == user["FK_TIPO_DOCUMENTO"])["tipo"];
                        break;
        }
});