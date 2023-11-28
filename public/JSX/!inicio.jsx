crearEstilo({
  /* width */
  "::-webkit-scrollbar": {
    width: "15px"
  },

  /* Track */
  "::-webkit-scrollbar-track": {
    background: "#f1f1f1"
  },

  /* Handle */
  "::-webkit-scrollbar-thumb": {
    background: "#888"
  },

  /* Handle on hover */
  "::-webkit-scrollbar-thumb:hover": {
    background: "#555"
  }
});

addLink('/CSS/abrevs.css');

Object.assign(window, window['MaterialUI']);

let palette = {
  primary: {
    main: '#1E90FF',
  },
  secondary: {
    main: localStorage.getItem("theme") == "dark" ? '#363640' : '#ccccff',
    color: '#FFFFFF',
  },
};

const darkTheme = createTheme({
  typography: {
    button: {
      textTransform: 'none'
    },
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#121215',
      paper: '#121218',
    },
    ...palette
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...palette
  },
});

if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "dark");
}

let theme = localStorage.getItem("theme") == "dark" ? darkTheme : lightTheme;

crearEstilo({
  body: {
    background: `${theme == darkTheme ? "#121212" : "#FFFFFF"}`,
  }
})

let colorTheme = {
  fuente: {
    clase: theme == darkTheme ? "c-white" : "c-black",
    codigo: theme == darkTheme ? "white" : "black",
  }
}
if (user) {
  if (!user["HABEAS_DATA"] && !window.location.href.endsWith("/self/habeas-data")) {
    window.location.href = "/logged/self/habeas-data";
  }
}

function AppLogged({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="menu superior d-none">
        <MenuSuperior />
      </div>
      <br />
      <div className="app d-none">
        {children}
      </div>
      <br />
      <br />
      <br />
      <div className="menu-izquierda d-none">
        <MenuIzquierda />
      </div>
    </ThemeProvider>
  );
}

function AppSimple({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app d-none">
        {children}
      </div>
    </ThemeProvider>
  );
}

function AppSimpleCentrada({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app d-none">
        {children}
      </div>
    </ThemeProvider>
  );
}

function AppRender({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

function generarVentanaFlotanteRapido({ url, titulo }) {
  ventana_flotante["nueva-ventana"]({
    titulo_texto: titulo,
    html: `
                    <iframe src="${url}" class="w-100P h-100P border-0"
                            onLoad="
                                    let urlNew = this.contentWindow.location;
                                    if (!urlNew.href.endsWith('${url}') && !urlNew.href.endsWith('/unlogged')) {
                                            this.contentWindow.location.href = '/unlogged';
                                    }
                            "
                    ></iframe>
            `
  })
}