export const ExternalAssert = () => window.console.assert = (...a) => window.externalAssert(JSON.stringify(a));

