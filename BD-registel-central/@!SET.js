module.exports = async ({ json, context = {}, query }) => {
        require("./@MACROS")["ESTAMPAS_DE_TIEMPO"]({
                json,
                context,
                query,
        });
        return json;
};