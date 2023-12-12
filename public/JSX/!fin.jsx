let elementosOcultosIniciales

async function init({ FadeIn = true } = {}) {
        try {
                await setup();
        } catch (error) {
        }

        ReactDOM.render(
                await App(),
                document.body
        );

        setTimeout(async () => {
                try {
                        await onLoad();
                } catch (error) {
                }
        }, 0);



        let _entrada = FadeIn ? ["animate__animated", "animate__fadeIn", "animate__faster"] : [];

        elementosOcultosIniciales = [".app", ".menu-izquierda", ".menu.superior"].map(element => {
                return document.querySelector(element);
        });

        if (document.querySelector(".menu.superior")) {
                estadoNotificacion();
        }

        elementosOcultosIniciales.forEach(element => {
                if (element) {
                        element.classList.remove("d-none");
                        element.classList.add(..._entrada);
                }
        });

        setTimeout(() => {
                elementosOcultosIniciales.forEach(element => {
                        if (element) {
                                element.classList.remove(..._entrada);
                        }
                });
        }, 500);
}

init();

window.addEventListener("beforeunload", function (e) {
        document.querySelector(".panel-notificaciones").classList.add("d-none");
        let _salida = ["animate__animated", "animate__fadeOut", "animate__faster"]
        elementosOcultosIniciales.forEach(element => {
                if (element) {
                        element.classList.add(..._salida);
                }
        });
});