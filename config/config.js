module.exports = {
    appExpirationTimeFromCache: process.env['APP_EXPIRY_CACHE_TIME'],
    cacheAppPrefix: process.env['CACHE_APP_PREFIX'],
    cacheSchemaPrefix: process.env['CACHE_SCHEMA_PREFIX'],
    schemaExpirationTimeFromCache: process.env['SCHEMA_EXPIRY_CACHE_TIME'],
    analyticsUrl: process.env['ANALYTICS_URL'],
    globalDb: process.env['GLOBAL_DB'],
    globalSettings: process.env['GLOBAL_SETTINGS'],
    analyticsKey: process.env['ANALYTICS_KEY'],
    logToken: process.env['LOGGLY_TOKEN'],
    logglySubDomain: process.env['LOGGLY_SUBDOMAIN'],
    logglyTags: process.env['LOGGLY_TAGS'],
    slackWebHook: process.env['SLACK_WEBHOOK'],
    slackIconUrl: process.env['SLACK_ICON_URL'],
    slackChannel: process.env['SLACK_CHANNEL'],
    mongoDisconnected: false,
    port: process.env['PORT'],
    smtp: {
        provider: process.env["MAIL_PROVIDER"],
        apiKey: process.env["MAIL_PROVIDER_API_KEY"],
        domain: process.env["DOMAIN"],
        fromEmail: process.env["FROM_EMAIL"],
        fromName: process.env["FROM_NAME"]
    }
};