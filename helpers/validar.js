const validator = require("validator");

const validarArticulo = (parametros) => {
    const validar_titulo = !validator.isEmpty(parametros.titulo) && validator.isLength(parametros.titulo, { min: 5, max: undefined });
    const validar_contenido = !validator.isEmpty(parametros.contenido);

    if (!validar_titulo || !validar_contenido) {
        throw new Error("No se ha validado la información!!");
    }
}

module.exports = {
    validarArticulo
};
