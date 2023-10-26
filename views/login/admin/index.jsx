function App() {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <div>
                                <h1>
                                        Herramientas
                                </h1>
                                <Button variant="contained" color="primary" href="/login/admin/herramientas/SQL2JSONBD">
                                        SQL2JSONBD
                                </Button>
                                <Button variant="contained" color="secondary" href="/stop-server">
                                        Detener Servidor
                                </Button>
                        </div>
                </ThemeProvider>
        )
}

ReactDOM.render(<App />, document.querySelector(".App"));