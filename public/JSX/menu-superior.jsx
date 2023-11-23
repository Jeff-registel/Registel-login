function MenuSuperior() {
        if (search.get("ventana-flotante") == "true") {
                return "";
        }
        return (
                <AppRender>
                        <Paper elevation={3} style={{ padding: 5, marginBottom: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <LogoConNombre
                                        className={`
                                                ${theme == darkTheme ? "silueta-blanca" : "silueta-negra"}
                                                pad-10
                                        `} w={110} />
                                <IconButton>
                                        <i class="fa-solid fa-bell"></i>
                                </IconButton>
                        </Paper>
                </AppRender>
        );
}