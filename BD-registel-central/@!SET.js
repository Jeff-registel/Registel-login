module.exports = async ({ json, contexto = {} }) => {
        require("./@MACROS")["ESTAMPAS_DE_TIEMPO"]({
                json,
                contexto,
        });
        return json;
};