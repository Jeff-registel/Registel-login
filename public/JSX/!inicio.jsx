addLink('/JSX/abrevs.css');

Object.assign(window, window['MaterialUI']);

let palette = {
  primary: {
    main: '#1E90FF',
  },
  secondary: {
    main: '#363636',
    color: '#FFFFFF',
  },
  tertiary: {
    main: '#ccc',
    color: '#363636',
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

function AppLogged({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="menu superior d-none">
        <MenuSuperior />
      </div>
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

function AppRender({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <div className="render">
        {children}
      </div>
    </ThemeProvider>
  );
}