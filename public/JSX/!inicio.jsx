addLink('/JSX/abrevs.css');

Object.assign(window, window['MaterialUI']);

const darkTheme = createTheme({
  typography: {
    button: {
      textTransform: 'none'
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#1E90FF',
    },
    secondary: {
      main: '#363636',
      color: '#FFFFFF',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    secondary: {
      main: '#363636',
      color: '#FFFFFF',
    },
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