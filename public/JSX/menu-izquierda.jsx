addLink("/JSX/menu-izquierda.css");

let contenedor_menu_izquierda = document.createElement("div");

const MenuIzquierda = () => {
        return (
                <ThemeProvider theme={theme}>
                        <CssBaseline />

                        <label className="menu-izquierda-desactivador" for="estado-colpasamiento">
                        </label>

                        <div class="menu-izquierda">
                                <input type="checkbox" id="estado-colpasamiento" name="estado-colpasamiento" className="d-none" />

                                <div class="seccion-boton-menu colapsador">
                                        <Button variant="contained" color="primary" onClick={() => {
                                                document.getElementById("estado-colpasamiento").checked = !document.getElementById("estado-colpasamiento").checked
                                        }}
                                                className="no-min-width"
                                        >
                                                <span class="colapsado-vista">
                                                        <i class="fa-solid fa-bars"></i>
                                                </span>
                                                <span class="descolapsado-vista">
                                                        <i class="fa-solid fa-x"></i>
                                                </span>
                                        </Button>
                                </div>

                                <div>
                                        <BotonOpcionHerramienta font_awesome="fa-solid fa-house" label="Principal" href="/login" />
                                        <BotonOpcionHerramienta font_awesome="fa-regular fa-circle-user" label="Mi perfil" href="/login/mi-perfil" />
                                        {
                                                [1, 2].includes(user["FK_PERFIL"]) ?
                                                        <React.Fragment>
                                                                <BotonOpcionHerramienta font_awesome="fa-solid fa-screwdriver-wrench" label="Herramientas" href="/login/admin/" />
                                                        </React.Fragment> :
                                                        ""
                                        }
                                </div>

                                <BotonOpcionHerramienta font_awesome="fa-solid fa-power-off" label="Cerrar sesión" href="/logout" />

                        </div>

                </ThemeProvider>
        );
};

function BotonOpcionHerramienta({ font_awesome, label, href }) {
        return (
                <div class="seccion-boton-menu opcion-herramienta">
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
                                <span class="descolapsado-vista">
                                        {label}
                                </span>
                        </Button>
                </div>
        );
}

ReactDOM.render(<MenuIzquierda />, contenedor_menu_izquierda);
document.body.appendChild(contenedor_menu_izquierda);
