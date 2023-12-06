module.exports = ({ query, ejecutor }) => {
        let { PK  } = query;
        if (!ejecutor || !ejecutor.PK) {
                return {
                        error: "falta autenticacion",
                };
        }
        if (!PK) {
                return {
                        error: "falta el PK",
                };
        }
        SQL.SAVE({
                tabla: "usuario",
                datos: query,
        })
}