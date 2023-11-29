crearEstilo({ //Conjunto de capas que se van a usar en el sitio
    ".background-container": {
        zIndex: 0,
    },

    ".app": {
        position: "relative",
        zIndex: 10,
        width: "95%",
        margin: "auto",
    },

    ".menu.superior": {
        zIndex: 20,
    },

    ".menu-izquierda": {
        zIndex: 100,
    },

    ".carga-espera": {
        zIndex: 1000,
    },

    ".swal2-html-container": {
        color: (theme == darkTheme ? "white" : "black") + " !important",
        textAlign: "left !important",
    },

    ".swal2-confirm": {
        backgroundColor: "dodgerblue !important",
    },
})