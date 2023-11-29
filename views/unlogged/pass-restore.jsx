crearEstilo({
        ".app": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
        }
})

function EsquemaError({ titulo, iconoTitulo, texto }) {
        return (
                <AppSimpleCentrada>
                        <Paper elevation={3} className="d-inline-block pad-20">
                                <center>
                                        <LogoConNombre className={`
                                ${theme == darkTheme ? "silueta-blanca" : "silueta-negra"}
                                        pad-10
                                `} w={300} h={100} />
                                        <h1>
                                                {titulo}
                                                <br />
                                                {iconoTitulo ?? ""}
                                        </h1>
                                        <br />
                                        {texto ?? ""}
                                        <br />
                                        <br />
                                        <Button variant="contained" color="primary" href="/">
                                                Voler al inicio
                                        </Button>
                                </center>
                        </Paper>
                </AppSimpleCentrada>
        )
}

async function App() {
        let parametro_token = new URLSearchParams(window.location.search).get("token");
        window.history.replaceState({}, document.title, window.location.href.replace(window.location.search, "").replace(window.location.hash, ""));
        let token = await JSONBD({
                ruta: `tokens/${parametro_token}.json`
        });
        if (!token) {
                return (
                        <EsquemaError titulo="El token no es válido" iconoTitulo={<i class="fa-solid fa-link-slash" />} texto="El token no existe o ha expirado" />
                )
        }
        if (token["tipo"] != "recuperación de contraseña") {
                return (
                        <EsquemaError titulo="El token no es para cambio de contraseña" iconoTitulo={<i class="fa-solid fa-bug" />} texto=":(" />
                )
        }

        let usuario = await JSONBD({
                ruta: `usuarios/${token["datos"]["PK"]}/usuario.json`
        });

        if (!usuario) {
                return (
                        <EsquemaError titulo="El usuario no existe" iconoTitulo={<i class="fa-solid fa-user-slash" />} texto="El usuario no existe o ha sido eliminado" />
                )
        }

        return (
                <AppSimpleCentrada>
                        <Paper elevation={3} className="d-inline-block pad-20">
                                <LogoConNombre className={`
                                        ${theme == darkTheme ? "silueta-blanca" : "silueta-negra"}
                                        pad-10
                                `} w={300} h={100} />
                                <h1>Reestablecer contraseña</h1>
                                <h3>
                                        usuario: {usuario["LOGIN"]}
                                </h3>
                                {usuario["EMAIL"]}
                                <br />
                                <br />
                                <TextField label="Contraseña" className="contraseña" type="password" fullWidth />
                                <br />
                                <br />
                                <TextField label="Repetir contraseña" className="contraseña2" type="password" fullWidth />
                                <br />
                                <br />
                                <div style={{ display: "flex", justifyContent: "space-between" }} >
                                        <Button variant="contained" color="error" onClick={async () => {
                                                await JSONBD({
                                                        query: {
                                                                DELETE: {
                                                                        ruta: `tokens/${parametro_token}.json`
                                                                }
                                                        }
                                                });
                                                window.location.href = "/";
                                        }}>
                                                Cancelar
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={async () => {
                                                let contraseña = document.querySelector(".contraseña input").value;
                                                let contraseña2 = document.querySelector(".contraseña2 input").value;
                                                if (contraseña != contraseña2) {
                                                        swal.fire("Error", "Las contraseñas no coinciden", "error");
                                                        return;
                                                }
                                                if (contraseña.length < 4) {
                                                        swal.fire("Error", "La contraseña debe tener al menos 4 caracteres", "error");
                                                        return;
                                                }
                                                let json = await JSONBD({
                                                        ruta: `usuarios`,
                                                        query: {
                                                                "CAMBIAR-CONTRASEÑA-CON-TOKEN": {
                                                                        "token-code": parametro_token,
                                                                        contraseña,
                                                                }
                                                        }
                                                });
                                                if (json["error"]) {
                                                        swal.fire("Error", json["ERROR"], "error");
                                                        return;
                                                }
                                                if (json["ok"]) {
                                                        await swal.fire("OK", "Contraseña cambiada", "success");
                                                        window.location.href = "/";
                                                        return;
                                                }
                                        }}>
                                                Cambiar contraseña
                                        </Button>
                                </div>
                        </Paper>
                </AppSimpleCentrada >
        )
}