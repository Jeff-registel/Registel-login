module.exports = async ({ json }) => {
        require("./@MACROS")["ESTAMPAS_DE_TIEMPO"]({
                json,
        });
        return json;
};