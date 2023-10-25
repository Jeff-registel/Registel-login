addLink("/JS/ventana-flotante/index.css");

let VENTANA_FLOTANTE_AGRUPAMIENTO;

const ventana_flotante = (()=> {
    let removerTodosLosPrimerosHijosDeMinimizacionFramesFloat = () => {
        let hermanos = [...VENTANA_FLOTANTE_AGRUPAMIENTO.querySelectorAll(".frame-float")];
        hermanos.forEach(hermano => hermano.classList.remove("is-firt-child"));
    };

    if (VENTANA_FLOTANTE_AGRUPAMIENTO) {
        return;
    }

    function nueva_ventana_flotante({
        titulo_texto = "",
        html = "",
        ancho_porcentaje_mediano = 0.6,
        alto_porcentaje_mediano = 0.9,
        ancho_minimo = 300,
        alto_minimo = 200,
        respetarLimitesVentana = true,
        mostrar_boton_cerrar = true,
        mostrar_boton_maximizar = true,
        mostrar_boton_minimizar = true,
        esMovible = true,
        esRedimensionable = true,
        evento_cerrar = () => { },
    }) {
        if (!user) {
            swal.fire({
                title: "Error",
                text: "No hay usuario",
                icon: "error",
            });
            return;
        }

        if (!VENTANA_FLOTANTE_AGRUPAMIENTO) {
            VENTANA_FLOTANTE_AGRUPAMIENTO = document.createElement("div");
            VENTANA_FLOTANTE_AGRUPAMIENTO.classList.add("minimizacion-frames-float");
            document.body.appendChild(VENTANA_FLOTANTE_AGRUPAMIENTO);
        }
        const top_percent = (1 - alto_porcentaje_mediano) / 2;
        const left_percent = (1 - ancho_porcentaje_mediano) / 2;

        let ultima_forma_almacenada = {};

        //---------------------------------------------------------
        // Funciones no exportadas
        //---------------------------------------------------------

        let hacer_ventana_principal = () => {
            ventana.poner_de_primero();
            actualizar_z_index();
        };

        let capturar_propiedades_ventana = () => {
            if (estaMaximizado() || estaMinimizado()) {
                return;
            }
            let { left, top, width, height } = ventana.style;
            ultima_forma_almacenada.left = parseFloat(left.replace("px", ""));
            ultima_forma_almacenada.top = parseFloat(top.replace("px", ""));
            ultima_forma_almacenada.width = parseFloat(width.replace("px", ""));
            ultima_forma_almacenada.height = parseFloat(height.replace("px", ""));
        };

        let activar_propiedades_CSS_transitivas = () => {
            ventana.classList.add("transitivo");
            setTimeout(() => {
                ventana.classList.remove("transitivo");
            }, 1000);
        };

        let ocultar_elementos_por_maximizacion = () => {
            document.querySelectorAll(".frame-float").forEach(elemento => {
                if (!elemento.classList.contains("maximizado")) {
                    elemento.classList.add("ocultar-por-maximizacion");
                }
            });
        };

        let mostrar_elementos_por_desmaximizacion = () => {
            document.body.querySelectorAll(".ocultar-por-maximizacion").forEach(elemento => {
                elemento.classList.remove("ocultar-por-maximizacion");
            });
        };

        function actualizar_z_index() {
            let hermanos = [...VENTANA_FLOTANTE_AGRUPAMIENTO.querySelectorAll(".frame-float")];
            let max = hermanos.length;
            hermanos.forEach((hermano, index) => {
                hermano.style.zIndex = max - index;
            });
        };

        //Iniciadores

        let iniciador_ventana = () => {
            VENTANA_FLOTANTE_AGRUPAMIENTO.appendChild(ventana);
            ventana.onmousedown = function () { //Por ahora solo sirve para hacer a la ventana como principal
                if (estaMinimizado()) {
                    return;//No tiene sentido hacerlo principal si está minimizado
                }
                hacer_ventana_principal();
                activar_ventana_como_principal();
            };
            actualizar_z_index();
        };

        let iniciar_marco_arriba = () => {
            ventana.appendChild(marco_mover);
            marco_mover.onmousedown = function (e) {
                if (estaMaximizado() || estaMinimizado()) {
                    return;
                }
                contenido.classList.add("sin-interaccion");
                document.body.style.userSelect = "none";

                let Xnav_inicial = e.clientX;
                let Ynav_inicial = e.clientY;
                let Yventana = ventana.offsetTop;
                let Xventana = ventana.offsetLeft;

                document.onmousemove = function (e) {
                    let Xnav_actual = e.clientX;
                    let Ynav_actual = e.clientY;
                    let Y = Yventana + (Ynav_actual - Ynav_inicial);
                    let X = Xventana + (Xnav_actual - Xnav_inicial);
                    cambiar_posicion(X, Y);
                }

                document.onmouseup = eliminarEventosMarco;
            }
        };

        let calcular_valores_movimiento_marco = (argumentos) => {
            let { eX, eY, e2, xi, yi, wi, hi, abajo, derecha } = argumentos;
            let e2X = e2.clientX;
            if (e2X < 0) {
                e2X = 0;
            }
            let e2Y = e2.clientY;
            if (e2Y < 0) {
                e2Y = 0;
            }
            let Y = yi + (e2Y - eY);
            let X = xi + (e2X - eX);
            let W = wi + (e2X - eX) * (derecha ? 1 : -1);
            let H = hi + (e2Y - eY) * (abajo ? 1 : -1);
            return { X, Y, W, H };
        };

        let generar_evento_documento = (argumentos) => {
            let { ventana, eventoCapturadoDeMarco, arriba, derecha, abajo, izquierda } = argumentos;
            let { offsetLeft: xi, offsetTop: yi, offsetWidth: wi, offsetHeight: hi } = ventana;
            let eX = eventoCapturadoDeMarco.clientX;
            if (eX < 0) {
                eX = 0;
            }
            let eY = eventoCapturadoDeMarco.clientY;
            if (eY < 0) {
                eY = 0;
            }
            return eventoCapturadoDeDocumento => {
                let { X: x, Y: y, W: w, H: h } = calcular_valores_movimiento_marco({ eX, eY, e2: eventoCapturadoDeDocumento, xi, yi, wi, hi, derecha, abajo });
                if (derecha) {
                    if (arriba) {
                        cambiar_forma({ y, w, h, yi, hi });
                    }
                    if (abajo) {
                        cambiar_forma({ w, h, wi, hi });
                    }
                    cambiar_forma({ w, wi });
                }
                if (izquierda) {
                    if (arriba) {
                        cambiar_forma({ x, y, w, h, xi, yi, wi, hi });
                    }
                    if (abajo) {
                        cambiar_forma({ x, w, h, xi, wi, hi });
                    }
                    cambiar_forma({ x, w, xi, wi });
                }
                if (arriba) {
                    cambiar_forma({ y, h, yi, hi });
                }
                if (abajo) {
                    cambiar_forma({ h, hi });
                }
            };
        }

        let generar_evento_marco = (argumentos) => {
            let { arriba, derecha, abajo, izquierda } = argumentos;
            return eventoCapturadoDeMarco => {
                document.body.style.userSelect = "none";
                contenido.classList.add("sin-interaccion");
                document.onmousemove = generar_evento_documento({ ventana, eventoCapturadoDeMarco, arriba, derecha, abajo, izquierda });
                document.onmouseup = eliminarEventosMarco;
            };
        };

        let eliminarEventosMarco = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            document.body.style.userSelect = "auto";
            contenido.classList.remove("sin-interaccion");
        };

        let iniciar_marco_derecha = () => {
            ventana.appendChild(marco_derecha);
            marco_derecha.onmousedown = generar_evento_marco({ derecha: true });
        };

        let iniciar_marco_abajo = () => {
            ventana.appendChild(marco_abajo);
            marco_abajo.onmousedown = generar_evento_marco({ abajo: true });
        };

        let iniciar_marco_izquierda = () => {
            ventana.appendChild(marco_izquierdo);
            marco_izquierdo.onmousedown = generar_evento_marco({ izquierda: true });
        };

        let iniciar_marco_izquierda_arriba = () => {
            ventana.appendChild(marco_izquierda_arriba);
            marco_izquierda_arriba.onmousedown = generar_evento_marco({ izquierda: true, arriba: true });
        };

        let iniciar_marco_izquierda_abajo = () => {
            ventana.appendChild(marco_izquierda_abajo);
            marco_izquierda_abajo.onmousedown = generar_evento_marco({ izquierda: true, abajo: true });
        };

        let iniciar_marco_derecha_arriba = () => {
            ventana.appendChild(marco_derecha_arriba);
            marco_derecha_arriba.onmousedown = generar_evento_marco({ derecha: true, arriba: true });
        };

        let iniciar_marco_derecha_abajo = () => {
            ventana.appendChild(marco_derecha_abajo);
            marco_derecha_abajo.onmousedown = generar_evento_marco({ derecha: true, abajo: true });
        };

        let iniciar_boton_cerrar = () => {
            boton_cerrar.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
            agrupador_botones_de_control.appendChild(boton_cerrar);
            boton_cerrar.onclick = cerrar;
        };

        let iniciar_boton_minimizar = () => {
            boton_minimizar.querySelector("span.false").innerHTML = "&minus;";
            boton_minimizar.querySelector("span.true").innerHTML = "&#9634;";
            agrupador_botones_de_control.appendChild(boton_minimizar);
            boton_minimizar.onclick = minimizar;
        };

        let iniciar_boton_maximizar = () => {
            boton_maximizar.innerHTML = "&#9974;";
            agrupador_botones_de_control.appendChild(boton_maximizar);
            boton_maximizar.onclick = maximizar;
        };

        let iniciar_boton_desmaximizar = () => {
            boton_desmaximizar.innerHTML = "&#9950;";
            agrupador_botones_de_control.appendChild(boton_desmaximizar);
            boton_desmaximizar.onclick = desmaximizar;
        };

        let iniciar_agrupador_botones_de_control = () => {
            marco_mover.appendChild(agrupador_botones_de_control);
        };

        //---------------------------------------------------------
        // Funciones exportadas
        //---------------------------------------------------------

        //funciones de botones de control

        let cerrar = () => {
            if (estaEnAnimacion()) {
                return;
            }
            ventana.classList.remove("maximizado");
            mostrar_elementos_por_desmaximizacion();
            ventana.classList.add("animacion-de-cierre");
            marco_mover.classList.add("animacion-de-cierre");
            setTimeout(() => {
                ventana.remove();
                mostrar_elementos_por_desmaximizacion();
            }, 1000);
            evento_cerrar();
        };

        let minimizar = () => {
            if (estaEnAnimacion()) {
                return;
            }
            ventana.classList.remove("maximizado");
            ventana.poner_de_primero();
            setTimeout(() => {
                let chk = boton_minimizar.querySelector("input[type=checkbox]");
                chk.checked = !chk.checked;
                if (!chk.checked) {
                    animar_contenido_como_primera_vez();
                    ventana.classList.add("is-firt-child");
                    activar_propiedades_CSS_transitivas();
                } else {
                    ventana.classList.remove("is-firt-child");
                }
                hacer_ventana_principal();
            }, 0);
            mostrar_elementos_por_desmaximizacion();
        };

        let maximizar = () => {
            if (estaEnAnimacion()) {
                return;
            }
            capturar_propiedades_ventana();
            activar_propiedades_CSS_transitivas();
            cambiar_forma({
                x: 0,
                y: 0,
                w: window.innerWidth,
                h: window.innerHeight
            })
            ventana.classList.add("maximizado");
            ventana.parentNode.classList.add("maximizado");
            [...ventana.querySelectorAll("*")].forEach(elemento => {
                elemento.classList.add("maximizado");
            });
            hacer_ventana_principal();

            ocultar_elementos_por_maximizacion();
        };

        let desmaximizar = () => {
            if (estaEnAnimacion()) {
                return;
            }
            activar_propiedades_CSS_transitivas();
            ventana.classList.remove("maximizado");
            if (!ultima_forma_almacenada.width || !ultima_forma_almacenada.height || !ultima_forma_almacenada.top || !ultima_forma_almacenada.left) {
                maximizar_medianamente();
                return;
            }
            cambiar_forma({
                x: ultima_forma_almacenada.left,
                y: ultima_forma_almacenada.top,
                w: ultima_forma_almacenada.width,
                h: ultima_forma_almacenada.height,
            });
            hacer_ventana_principal();
            activar_ventana_como_principal();

            mostrar_elementos_por_desmaximizacion();
        };

        let estaMaximizado = () => {
            return ventana.classList.contains("maximizado");
        };

        let estaMinimizado = () => {
            return ventana.querySelector(`.control.btns .btn.minimizar input[type="checkbox"]`).checked;
        };

        let estaEnAnimacion = () => {
            return ventana.classList.contains("animacion-de-cierre") || ventana.classList.contains("animacion-de-apertura") || ventana.classList.contains("transitivo");
        };

        //acciones de ventana

        let maximizar_medianamente = () => {
            ventana.style.width = ancho_porcentaje_mediano * window.innerWidth + "px";
            ventana.style.height = alto_porcentaje_mediano * window.innerHeight + "px";
            ventana.style.top = top_percent * window.innerHeight + "px";
            ventana.style.left = left_percent * window.innerWidth + "px";
            ventana.classList.remove("maximizado");
        };

        let activar_ventana_como_principal = () => {
            removerTodosLosPrimerosHijosDeMinimizacionFramesFloat();
            setTimeout(() => {
                if (VENTANA_FLOTANTE_AGRUPAMIENTO.firstChild == ventana) {
                    ventana.classList.add("is-firt-child");
                }
            }, 0);
        };

        let animar_contenido_como_primera_vez = () => {
            contenido.classList.add("animacion-de-opacidad");
            setTimeout(() => {
                contenido.classList.remove("animacion-de-opacidad");
            }, 1000);
        };

        let cambiar_titulo = (titulo_texto) => {
            titulo.innerHTML = titulo_texto;
        };

        let cambiar_contenido = (html) => {
            contenido.innerHTML = html;
        };

        let centrar_ventana = () => {
            activar_propiedades_CSS_transitivas();
            ventana.style.top = (window.innerHeight - ventana.offsetHeight) / 2 + "px";
            ventana.style.left = (window.innerWidth - ventana.offsetWidth) / 2 + "px";
        };

        let cambiar_esRedimensionable = (b) => {
            esRedimensionable = b;
        };

        let cambiar_esMovible = (b) => {
            esMovible = b;
        };

        let cambiar_forma_transitiva = (argumentos) => {
            let {
                x, y, w, h, xi, yi, wi, hi
            } = argumentos;
            activar_propiedades_CSS_transitivas();
            cambiar_forma({ x, y, w, h, xi, yi, wi, hi });
        };

        let cambiar_forma = (argumentos) => {
            let {
                x, y, w, h, xi, yi, wi, hi
            } = argumentos;
            let ancho_calculado;
            let alto_calculado;
            let XY = () => {
                if (!esMovible) {
                    return;
                }
                if (x != undefined) {
                    if (respetarLimitesVentana) {
                        let izq = 0;
                        let der = window.innerWidth - (w ?? ventana.offsetWidth);
                        if (x < izq) {
                            x = izq;
                        }
                        if (x > der) {
                            x = der;
                        }
                    }

                    if (xi && wi && ancho_calculado < ancho_minimo) {
                        let limit_x = xi + wi - ancho_minimo;
                        if (x > limit_x) {
                            x = limit_x;
                        }
                    }
                    ventana.style.left = x + "px";
                }
                if (y != undefined) {
                    if (respetarLimitesVentana) {
                        let sup = 0;
                        let inf = window.innerHeight - (h ?? ventana.offsetHeight);
                        if (y < sup) {
                            y = sup;
                        }
                        if (y > inf) {
                            y = inf;
                        }
                    }
                    if (yi && hi && alto_calculado < alto_minimo) {
                        let limit_y = yi + hi - alto_minimo;
                        if (y > limit_y) {
                            y = limit_y;
                        }
                    }
                    ventana.style.top = y + "px";
                }
            };
            //---------------------------------------------------------
            let WH = () => {
                if (!esRedimensionable) {
                    return;
                }
                if (w != undefined) {
                    if (respetarLimitesVentana) {
                        ancho_calculado = Math.min(w, window.innerWidth - (x ?? ventana.offsetLeft));
                        w = ancho_calculado;
                        if (w < ancho_minimo) {
                            w = ancho_minimo;
                        }
                    }
                    ventana.style.width = w + "px";
                }
                if (h != undefined) {
                    if (respetarLimitesVentana) {
                        alto_calculado = Math.min(h, window.innerHeight - (y ?? ventana.offsetTop));
                        h = alto_calculado;
                        if (h < alto_minimo) {
                            h = alto_minimo;
                        }
                    }
                    if (h >= alto_minimo) {
                        ventana.style.height = h + "px";
                    }
                }
            };
            WH();
            XY();
        };

        let cambiar_posicion = (x, y) => {
            cambiar_forma({ x, y });
        };

        let cambiar_posicion_transitiva = (x, y) => {
            activar_propiedades_CSS_transitivas();
            cambiar_posicion(x, y);
        };

        let cambiar_de_dimension = (w, h) => {
            cambiar_forma({ w, h });
        };

        let cambiar_de_dimension_transitiva = (w, h) => {
            activar_propiedades_CSS_transitivas();
            cambiar_de_dimension(w, h);
        };

        //---------------------------------------------------------
        // Protocolo de creacion de elementos
        //---------------------------------------------------------

        let ventana = document.createElement("div");

        ventana.poner_de_primero = () => {
            if (ventana.classList.contains("is-firt-child")) {
                return;
            }
            removerTodosLosPrimerosHijosDeMinimizacionFramesFloat();
            ventana.classList.add("is-firt-child");
            VENTANA_FLOTANTE_AGRUPAMIENTO.prepend(ventana);
            actualizar_z_index();
        }

        ventana.classList.add("frame-float");
        ventana.classList.add("animacion-de-inicio");
        setTimeout(() => {
            ventana.classList.remove("animacion-de-inicio");
        }, 1000);
        iniciador_ventana();
        maximizar_medianamente();
        activar_ventana_como_principal();

        let contenido = document.createElement("div");
        contenido.classList.add("contenido");
        animar_contenido_como_primera_vez();
        cambiar_contenido(html);
        ventana.appendChild(contenido);

        let marco_izquierdo = document.createElement("div");
        marco_izquierdo.classList.add("control", "marco", "izquierda", "todo");
        iniciar_marco_izquierda();

        let marco_derecha = document.createElement("div");
        marco_derecha.classList.add("control", "marco", "derecha", "todo");
        iniciar_marco_derecha();

        let marco_mover = document.createElement("div");
        marco_mover.classList.add("control", "marco", "arriba");
        iniciar_marco_arriba();

        let marco_abajo = document.createElement("div");
        marco_abajo.classList.add("control", "marco", "abajo");
        iniciar_marco_abajo();

        let marco_izquierda_arriba = document.createElement("div");
         marco_izquierda_arriba.classList.add("control", "marco", "izquierda", "diagonal", "arriba");
        iniciar_marco_izquierda_arriba();

        let marco_izquierda_abajo = document.createElement("div");
        marco_izquierda_abajo.classList.add("control", "marco", "izquierda", "diagonal", "abajo");
        iniciar_marco_izquierda_abajo();

        let marco_derecha_arriba = document.createElement("div");
        marco_derecha_arriba.classList.add("control", "marco", "derecha", "diagonal", "arriba");
        iniciar_marco_derecha_arriba();

        let marco_derecha_abajo = document.createElement("div");
        marco_derecha_abajo.classList.add("control", "marco", "derecha", "diagonal", "abajo");
        iniciar_marco_derecha_abajo();

        let titulo = document.createElement("div");
        titulo.classList.add("titulo");
        cambiar_titulo(titulo_texto);
        marco_mover.appendChild(titulo);

        let agrupador_botones_de_control = document.createElement("div");
        agrupador_botones_de_control.classList.add("control", "btns");

        let boton_cerrar = document.createElement("div");
        let boton_maximizar = document.createElement("div");
        let boton_desmaximizar = document.createElement("div");
        let boton_minimizar = document.createElement("label");
        if (mostrar_boton_minimizar) {
            boton_minimizar.classList.add("btn");
            boton_minimizar.classList.add("minimizar");
            boton_minimizar.setAttribute("title", "Minimizar");

            let estado_minimizar = document.createElement("input");
            estado_minimizar.type = "checkbox";
            estado_minimizar.style.display = "none";
            estado_minimizar.checked = false;

            let marco_minimizar_label = document.createElement("span");
            let marco_minimizar_label2 = document.createElement("span");
            marco_minimizar_label.classList.add("false");
            marco_minimizar_label2.classList.add("true");

            boton_minimizar.appendChild(marco_minimizar_label);
            boton_minimizar.appendChild(marco_minimizar_label2);
            boton_minimizar.appendChild(estado_minimizar);

            iniciar_boton_minimizar();
        }
        if (mostrar_boton_maximizar) {
            boton_maximizar.classList.add("btn");
            boton_maximizar.classList.add("maximizar");
            boton_maximizar.setAttribute("title", "Maximizar");
            iniciar_boton_maximizar();

            boton_desmaximizar.classList.add("btn");
            boton_desmaximizar.classList.add("maximizar2");
            boton_desmaximizar.setAttribute("title", "Restaurar");
            iniciar_boton_desmaximizar();
        }
        if (mostrar_boton_cerrar) {
            boton_cerrar.classList.add("btn");
            boton_cerrar.classList.add("cerrar");
            boton_cerrar.setAttribute("title", "Cerrar");
            iniciar_boton_cerrar();
        }
        iniciar_agrupador_botones_de_control();

        let retorno = {
            forma: ultima_forma_almacenada,
            //--------------------------
            HTML: {
                ventana,
                contenido,
                titulo,
                //--------------------------HTML
                forma: {
                    //--------------------------HTML/FORMA
                    marco: {
                        mover: marco_mover,
                        //--------------------------HTML/FORMA/MARCO
                        lateral: {
                            izquierdo: marco_izquierdo,
                            derecha: marco_derecha,
                            abajo: marco_abajo,
                        },
                        //--------------------------HTML/FORMA/MARCO
                        diagonal: {
                            izquierda_arriba: marco_izquierda_arriba,
                            izquierda_abajo: marco_izquierda_abajo,
                            derecha_arriba: marco_derecha_arriba,
                            derecha_abajo: marco_derecha_abajo,
                        }
                    },
                },
                //--------------------------HTML
                accion: {
                    contenedor: agrupador_botones_de_control,
                    //--------------------------HTML/ACCION
                    boton: {
                        cerrar: boton_cerrar,
                        maximizar: boton_maximizar,
                        desmaximizar: boton_desmaximizar,
                        minimizar: boton_minimizar,
                    },
                },
            },
            //--------------------------
            JS: {
                cambiar_titulo,
                cambiar_contenido,
                centrar_ventana,
                //--------------------------JS
                forma: {
                    cambiar: cambiar_forma,
                    cambiar_transitiva: cambiar_forma_transitiva,
                    //--------------------------JS/FORMA
                    posicion: {
                        cambiar: cambiar_posicion,
                        cambiar_transitiva: cambiar_posicion_transitiva,
                        centrar: centrar_ventana,
                        //--------------------------JS/FORMA/POSICION
                        activador: {
                            esMovible: cambiar_esMovible,
                        }
                    },
                    //--------------------------JS/FORMA
                    dimension: {
                        redimensionar: cambiar_de_dimension,
                        redimensionar_transitiva: cambiar_de_dimension_transitiva,
                        //--------------------------JS/FORMA/DIMENSION
                        activador: {
                            esRedimensionable: cambiar_esRedimensionable,
                        }
                    }
                },
                //--------------------------JS
                accion: {
                    cerrar,
                    maximizar,
                    desmaximizar,
                    minimizar,
                    //--------------------------JS/ACCION
                    especial: {
                        maximizar_medianamente,
                        activar_ventana_como_principal,
                    }
                },
                //--------------------------JS
                estado: {
                    maximizado: estaMaximizado,
                    minimizado: estaMinimizado,
                    animado: estaEnAnimacion,
                },
                //--------------------------JS
                animaciones: {
                    animar_contenido_como_primera_vez,
                    activar_propiedades_CSS_transitivas,
                },
            },
        };
        ventana.poner_de_primero();
        return retorno;
    }

    function distribuir_ventanas_en_sistema_de_cuadricula(columnas, filas) {
        let ventanas = [...document.querySelectorAll(".frame-float")];
        let ancho = 100 / columnas;
        let alto = 100 / filas;
        for (let fila = 0; fila < filas; fila++) {
            for (let columna = 0; columna < columnas; columna++) {
                let ventana = ventanas.shift();
                if (ventana) {
                    ventana.style.width = `${ancho}%`;
                    ventana.style.height = `${alto}%`;
                    ventana.style.left = `${ancho * columna}%`;
                    ventana.style.top = `${alto * fila}%`;
                }
            }
        }
    }

    return {
        "sistema": VENTANA_FLOTANTE_AGRUPAMIENTO,
        "nueva-ventana": nueva_ventana_flotante,
        funcion: {
            "distribucion-matricial": distribuir_ventanas_en_sistema_de_cuadricula,
        },
        auxiliar: {
            "remover-primeros-hijos": removerTodosLosPrimerosHijosDeMinimizacionFramesFloat,
        }
    };
})();