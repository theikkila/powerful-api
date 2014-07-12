module.exports = {
    resources: Object.freeze({
        INIT: '/',
        TOKEN: '/token',
        DOMAINS: '/domains',
        RECORDS: '/records'
    }),
    regexps: {
        fqdn: '^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$'
    }
};