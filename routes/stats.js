



module.exports.read = function (req, res, next) {
    // Fake results
    // Todo: implement stats-api
    res.send({queries: 23411});
    return next();
};
