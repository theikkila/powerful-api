/*
* Serves user- and client-data to oauth-hooks
*/

module.exports = function () {
    var defaults = {
            clients: {
                powerfulClient: {secret: "SOMETHINGVERYSECRET"}
            },
            users: {
                admin: {password: "password"}
            },
            tokensToClientIds: {}
        };
    return {
        clients: defaults.clients,
        users: defaults.users,
        tokensToClientIds: defaults.tokensToClientIds
    };
};
