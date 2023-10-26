function App() {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <div>
                                <Button className="boton-empezar" variant="contained" color="primary" onMouseUp={(e) => {
                                        if (e.button != 0) {
                                                return;
                                        }
                                        socket.emit("SQL2JSONBD");
                                        document.querySelector(".boton-empezar").style.display = "none";
                                        document.querySelector(".boton-detener").style.display = "block";
                                }}>
                                        Empezar
                                </Button>
                                <Button className="boton-detener" variant="contained" color="secondary" style={{ display: "none" }} onMouseUp={(e) => {
                                        if (e.button != 0) {
                                                return;
                                        }
                                        socket.emit("SQL2JSONBD: parar");
                                        document.querySelector(".boton-empezar").style.display = "block";
                                        document.querySelector(".boton-detener").style.display = "none";
                                }}>
                                        Detener
                                </Button>
                        </div>

                        <div className="query">
                        </div>
                        <div className="bases-de-datos">
                        </div>
                        <div className="tablas">
                        </div>
                </ThemeProvider>
        )
}

socket.on("SQL2JSONBD: respuesta: bases-de-datos", (bases_de_datos) => {
        ReactDOM.createRoot(document.querySelector(".bases-de-datos")).render(
                <React.Fragment>
                        <h1>
                                Bases de datos
                        </h1>
                        <br />
                        <span className="bases-de-datos">
                                {bases_de_datos.map((base_de_datos) => {
                                        return <React.Fragment>
                                                <span className="base-de-datos">
                                                        {base_de_datos}
                                                </span>
                                                <br />
                                        </React.Fragment>
                                })}
                        </span>
                </React.Fragment>
        )
});

socket.on("SQL2JSONBD: respuesta: tablas", (tablas) => {
        ReactDOM.createRoot(document.querySelector(".tablas")).render(
                <React.Fragment>
                        <h1>
                                Tablas
                        </h1>
                        <br />
                        <span className="tablas">
                                {tablas.map((tabla) => {
                                        return <React.Fragment>
                                                <span className="tabla">
                                                        {tabla}
                                                </span>
                                                <br />
                                        </React.Fragment>
                                })}
                        </span>
                </React.Fragment>
        )
});

socket.on("SQL2JSONBD: respuesta: query", (query) => {
        ReactDOM.createRoot(document.querySelector(".query")).render(
                <React.Fragment>
                        <h1>
                                Query
                        </h1>
                        <br />
                        <pre>
                                {JSON.stringify(query, null, 4)}
                        </pre>
                </React.Fragment>
        )
})

ReactDOM.createRoot(document.querySelector(".App")).render(<App />);