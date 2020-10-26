module.exports = function () {
    return function(req, res, next) {
        const {width, height, airportsCount, cloudsCount} = req.query;
        const errors = [];

        if (+width < 10) errors.push("Largura precisa ser maior ou igual a 10.");
        if (+height < 10) errors.push("Altura precisa ser maior ou igual a 10.");
        if (+airportsCount < 3) errors.push("Quantidade de Aeroportos precisa ser maior ou igual a 3.");
        if (+cloudsCount < 4) errors.push("Quantidade de Nuvens precisa ser maior ou igual a 4.");

        if ((+airportsCount) + (+cloudsCount) > width * height) errors.push("A quantidade de aeroportos e nuvens é incompativel com o tamanho do mapa.")

        if (errors.length > 0)
            return res.status(422).json({errors});

        return next();
    };
};
