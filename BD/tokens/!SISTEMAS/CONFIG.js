module.exports = (tipo) => {
        switch (tipo) {
                case "recuperación de contraseña":
                        return {
                                expira: 1000 * 60 * 60 * 24 // 1 día
                        }
                default:
                        return {
                                expira: 1000 * 60 * 60 * 24 * 2 // 2 dias
                        }
        }
}