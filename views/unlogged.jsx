crearEstilo({
        ".logoanimado": {
                "animation": "loadLogo 2s infinite ease-in-out",
        },
        "@keyframes loadLogo": {
                "0%": {
                        transform: "rotateZ(0deg)",
                },
                "100%": {
                        transform: "rotateZ(360deg)",
                }
        },
})

function App() {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <div className="ta-center">
                                <LogoConNombre
                                        className={`
                                                logoanimado
                                                ${theme == darkTheme ? "silueta-blanca" : "silueta-negra"} 
                                                pad-10
                                        `}
                                        w={300}
                                        h={100}
                                />
                                <h1>Sin usuario</h1>
                                <h2>Por favor, inicie sesión</h2>
                        </div>
                </ThemeProvider>
        )
}