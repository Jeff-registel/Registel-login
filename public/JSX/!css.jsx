crearEstilo({ //Conjunto de capas que se van a usar en el sitio
    ".background-container": {
        zIndex: 0,
    },

    ".app": {
        position: "relative",
        zIndex: 10,
        width: "90%",
        margin: "auto",

        "& hr": {
            opacity: 0.3,
            width: "90%",
        }
    },
})