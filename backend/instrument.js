// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://b5109fafb57f60b2afa19d21b9bbe7c3@o4510560917716992.ingest.de.sentry.io/4510560920141904",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});