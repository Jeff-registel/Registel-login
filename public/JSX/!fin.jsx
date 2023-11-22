let _app;
let _menu_izquierda;

async function init() {
        ReactDOM.render(
                await App(),
                document.body
        );

        _app = document.querySelector(".app");
        _menu_izquierda = document.querySelector(".menu-izquierda");

        let _entrada = ["animate__animated", "animate__fadeIn", "animate__faster"]

        if (_app) {
                _app.classList.remove("d-none");
                _app.classList.add(..._entrada);
        }

        if (_menu_izquierda) {
                _menu_izquierda.classList.remove("d-none");
                _menu_izquierda.classList.add(..._entrada);
        }


        setTimeout(() => {
                if (_app) {
                        _app.classList.remove(..._entrada);
                }
                if (_menu_izquierda) {
                        _menu_izquierda.classList.remove(..._entrada);
                }
        }, 500);
}

init();

window.addEventListener("beforeunload", function (e) {
        let _salida = ["animate__animated", "animate__fadeOut", "animate__faster"]

        if (_app) {
                _app.classList.add(..._salida);
        }
        if (_menu_izquierda) {
                _menu_izquierda.classList.add(..._salida);
        }
});