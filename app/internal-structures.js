let memoria = require("./memoria");

let empresas = {
        Neiva: {
                IP: "198.251.66.69",
                Servicios: {
                        Autobuses: {
                                dominio: "autobuses.regisdataweb.com",
                                ID: 2,
                        },
                        Cootransneiva: {
                                dominio: "cootransneiva.regisdataweb.com",
                                ID: 3,
                        },
                        Cootranshuila: {
                                dominio: "cootranshuila.regisdataweb.com",
                                ID: 4,
                        },
                        Flotahuila: {
                                dominio: "flotahuila.regisdataweb.com",
                                ID: 5,
                        },
                        Coomotor: {
                                dominio: "coomotor.regisdataweb.com",
                                ID: 6,
                        },
                },
        },
        Montebello: {
                IP: "74.208.81.252",
                Servicios: {
                        Acusosa: {
                                dominio: "acusosa.regisdataweb.com",
                                ID: 26,
                        },
                        Coobusan: {
                                dominio: "coobusan.regisdataweb.com",
                                ID: 16,
                        },
                        Cootransangil: {
                                dominio: "cootransangil.regisdataweb.com",
                                ID: 18,
                        },
                        Cootransmelgar: {
                                dominio: "cootransmelgar.regisdataweb.com",
                                ID: 21,
                        },
                        Montebello: {
                                dominio: "montebello.regisdataweb.com",
                                ID: 11,
                        },
                        Rapidofenix: {
                                dominio: "rapidofenix.regisdataweb.com",
                                ID: 13,
                        },
                        Transmedialuna: {
                                dominio: "transmedialuna.regisdataweb.com",
                                ID: 22,
                        },
                },
        },
        Lusitania: {
                IP: "74.208.18.158",
                Servicios: {
                        Clientes: {
                                dominio: "clientes.regisdataweb.com",
                                ID: 7,
                        },
                        Empresas: {
                                dominio: "empresas.regisdataweb.com",
                                ID: 15,
                        },
                        Lusitania: {
                                dominio: "lusitania.regisdataweb.com",
                                ID: 14,
                        },
                        Tunja: {
                                dominio: "tunja.regisdataweb.com",
                                ID: 29,
                        },
                        Cootransar: {
                                dominio: "cootransar.regisdataweb.com",
                                ID: 31,
                        },
                        "Lineas del Valle": {
                                dominio: "lineasdelvalle.regisdataweb.com",
                                ID: 33,
                        },
                        Cootranscota: {
                                dominio: "cootranscota.regisdataweb.com",
                                ID: 34,
                        },
                },
        },
        Villavicencio: {
                IP: "104.254.247.26",
                Servicios: {
                        Cañaveral: {
                                dominio: "canaveral.regisdataweb.com",
                                ID: 27,
                        },
                        Cooperativa: {
                                dominio: "cooperativa.regisdataweb.com",
                                ID: 25,
                        },
                        Cootranstur: {
                                dominio: "cootranstur.regisdataweb.com",
                                ID: 30,
                        },
                        Servitranstur: {
                                dominio: "servitranstur.regisdataweb.com",
                                ID: 28,
                        },
                        Villavicencio: {
                                dominio: "villavicencio.regisdataweb.com",
                                ID: 19,
                        },
                        Yumbeños: {
                                dominio: "yumbenos.regisdataweb.com",
                                ID: 32,
                        },
                },
        },
        Pruebas: {
                IP: "198.251.74.11",
                Servicios: {
                        Interno: {
                                dominio: "interno.regisdataweb.com",
                                ID: 17,
                        },
                },
        },
};

JSONBD_EXEC({
        DOC: {
                diccionarios: {
                        "empresas.json": empresas,
                },
        }
})