module.exports = (tipo) => {
        switch (tipo) {
                case "recuperación de contraseña":
                        return {
                                expira: 1000 * 30 // 30 segundos
                        }
                default:
                        return {
                                expira: 1000 * 60 * 60 * 24 * 2 // 2 dias
                        }
        }
}