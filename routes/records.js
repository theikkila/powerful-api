

// read
module.exports.read = function (req, res, next) {
    // return all records of domain
    res.send({p: "domains/" + req.params.domainid + "/records"});
    return next();
};

// create
module.exports.create = function (req, res, next) {
    res.send("create");
    return next();
};

// update
module.exports.update = function (req, res, next) {
    res.send("update");
    return next();
};

// delete
module.exports.delete = function (req, res, next) {
    res.send("delete");
    return next();
};