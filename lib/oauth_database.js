/*
* Serves user- and client-data to oauth-hooks
*/

module.exports = function () {

    return {
        default: {
            clients: {
                powerfulClient: {secret: "SOMETHINGVERYSECRET"}
            },
            users: {
                admin: {password: "password"}
            },
            tokensToClientIds: {}
        },
        get clients () {
            // Todo: Implement database lookup for clients
            // Now just returns default object
            return this.default.clients;
        },
        set clients (value) {
            // Todo: Implement database save for clients
            // Now just sets default client temporarily
            this.default.clients = value;
        },
        get users () {
            // Todo: Implement database lookup for users
            // Now just returns default object
            return this.default.users;
        },
        set users (value) {
            // Todo: Implement database save for clients
            // Now just sets default client temporarily
            this.default.users = value;
        },
        get tokensToClientIds () {
            // Todo: Implement database lookup for users
            // Now just returns default object
            return this.default.tokensToClientIds;
        },
        set tokensToClientIds (value) {
            // Todo: Implement database save for tokensToClientIds
            // Now just sets default t2un temporarily
            this.default.tokensToClientIds = value;
        }
    };
};
