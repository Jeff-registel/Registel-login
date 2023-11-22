const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        '& .MuiSwitch-switchBase': {
                margin: 1,
                padding: 0,
                transform: 'translateX(6px)',
                '&.Mui-checked': {
                        color: '#fff',
                        transform: 'translateX(22px)',
                        '& .MuiSwitch-thumb:before': {
                                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                                        '#fff',
                                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
                        },
                        '& + .MuiSwitch-track': {
                                opacity: 1,
                                backgroundColor: 'dark',
                        },
                },
        },
        '& .MuiSwitch-thumb': {
                backgroundColor: theme.palette.mode === 'dark' ? 'black' : 'dodgerblue',
                width: 32,
                height: 32,
                '&:before': {
                        content: "''",
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                                '#fff',
                        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
                },
        },
        '& .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#8796A5',
                borderRadius: 20 / 2,
        },
}));

const MenuIzquierda = () => {
        addLink("/JSX/menu-izquierda.css");
        
        return (
                <ThemeProvider theme={theme}>
                        <label className="menu-izquierda-desactivador" for="estado-colpasamiento" onClick={() => {
                                setTimeout(() => {
                                        document.querySelector(".no-min-width").style.backgroundColor = document.getElementById("estado-colpasamiento").checked ? "tomato" : "";
                                }, 0);
                        }}>
                        </label>

                        <div className="menu-izquierda">
                                <input type="checkbox" id="estado-colpasamiento" className="d-none" />


                                <div className="seccion-boton-menu colapsador">
                                        <Button variant="contained" color="primary" onClick={() => {
                                                document.getElementById("estado-colpasamiento").checked = !document.getElementById("estado-colpasamiento").checked;
                                                document.querySelector(".no-min-width").style.backgroundColor = document.getElementById("estado-colpasamiento").checked ? "tomato" : "";
                                        }}
                                                className="no-min-width"
                                        >
                                                <span className="colapsado-vista">
                                                        <i class="fa-solid fa-bars"></i>
                                                </span>
                                                <span className="descolapsado-vista">
                                                        <i className="fa-solid fa-x"></i>
                                                </span>
                                        </Button>
                                </div>

                                <div>
                                        <BotonOpcionHerramienta font_awesome="fa-solid fa-house" label="Principal" href="/logged" />
                                        <BotonOpcionHerramienta font_awesome="fa-regular fa-circle-user" label="Mi perfil" href="/logged/mi-perfil" />
                                        {
                                                [1, 2].includes(user["FK_PERFIL"]) ?
                                                        <React.Fragment>
                                                                <BotonOpcionHerramienta font_awesome="fa-solid fa-screwdriver-wrench" label="Herramientas" href="/logged/admin/" />
                                                        </React.Fragment> :
                                                        ""
                                        }
                                </div>

                                <div className="descolapsado-vista">
                                        <FormControlLabel control={<MaterialUISwitch defaultChecked={theme == darkTheme} />} label={
                                                theme == darkTheme ?
                                                        "Modo oscuro" :
                                                        "Modo claro"
                                        } onChange={() => {
                                                localStorage.setItem("theme", theme == darkTheme ? "light" : "dark");
                                                setTimeout(() => {
                                                        window.location.reload();
                                                }, 200);
                                        }} className="c-white tt-uppercase" />
                                </div>

                                <BotonOpcionHerramienta font_awesome="fa-solid fa-power-off" label="Cerrar sesión" href="/logout" />

                        </div>

                </ThemeProvider>
        );
};

function BotonOpcionHerramienta({ font_awesome, label, href }) {
        return (
                <div className="seccion-boton-menu opcion-herramienta">
                        <Button
                                className="no-min-width w-100P c-white  white-space-nowrap"
                                size="large"
                                startIcon={<i class={
                                        font_awesome +
                                        " descolapsado-vista"
                                }></i>} title={label}
                                href={href}
                        >
                                <i class={
                                        font_awesome +
                                        " colapsado-vista"
                                }></i>
                                <span className="descolapsado-vista">
                                        {label}
                                </span>
                        </Button>
                </div>
        );
}