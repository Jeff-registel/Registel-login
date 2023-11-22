function App() {
        return (
                <AppLogged >
                        <div>
                                <h1>
                                        Herramientas
                                </h1>
                                <Button variant="contained" color="primary" href="/login/admin/herramientas/SQL2JSONBD">
                                        SQL2JSONBD
                                </Button>
                                <br />
                                <br />
                                <Button variant="contained" color="primary" href={`/API/JSON-BD/${user["LOGIN"]}/${localStorage.getItem("contraseña")}`}>
                                        PACK JSON BD
                                </Button>
                                <br /> 
                                <br />
                                <Button variant="contained" color="secondary" href="/stop-server">
                                        Detener Servidor
                                </Button>
                        </div>
                </AppLogged >
        )
}