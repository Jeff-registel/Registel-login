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
            main: '#87CEFA',
          },
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

let theme = darkTheme;