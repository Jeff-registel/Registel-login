crearEstilo({
        body: {
                "background-color": "#121212",
                color: "white",
                display: "flex",
                "justify-content": "center",
                "align-items": "center",
                height: "100vh",
                margin: 0,
                padding: 0,
        }
})

function App() {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <div className="ta-center">
                                <LogoConNombre
                                        className={`
                                                ${theme == darkTheme ? "silueta-blanca" : "silueta-negra"} 
                                                pad-10
                                        `}
                                        w={300}
                                        h={100}
                                />
                                <h1>404</h1>
                                <h2>Página no encontrada</h2>
                                <Button variant="contained" color="primary" href="/">
                                        Volver al inicio
                                </Button>
                        </div>
                </ThemeProvider>
        );
}

ReactDOM.render(<App />, document.querySelector(".App"));

setTimeout(() => {
        window.location.href = "/";
}, 6000);