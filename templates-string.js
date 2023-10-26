function redirección({ textoPrincipal }) {
        return `
        <style>
                body {
                        font-family: calibri;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        min-height: 100vh;
                        background-color: #121212;
                        color: white;
                }

                h1{
                        color: dodgerblue;
                }
        </style>
                <h1>
                        ${textoPrincipal}
                </h1>
                <h3>
                        Redirigiendo a la página de inicio de sesión en... <span id="segundos"></span> segundos
                </h3>
                <script>
                        let div_segundos = document.getElementById("segundos");
                        let segundos = 10;
                        div_segundos.innerHTML = segundos;
                
                        let intervalo = setInterval(() => {
                                segundos--;
                                div_segundos.innerHTML = segundos;
                                if (segundos == 0) {
                                        clearInterval(intervalo);
                                        window.location.href = "/";
                                }
                        }, 1000);
                </script>
        `
}

module.exports = {
        redirección
}