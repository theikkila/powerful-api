module.exports = {
    resources: Object.freeze({
        INIT: '/',
        TOKEN: '/token',
        DOMAINS: '/domains',
        RECORDS: '/records',
        STATS: '/stats'
    }),
    regexps: {
        fqdn: '^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$',
        recordtype: '^(A|AAAA|NSEC|NS|MX|CERT|CNAME|DNSKEY|DS|KEY|LOC|NAPTR|PTR|RRSIG|SOA|SPF|SRV|TXT)$'
    }
};