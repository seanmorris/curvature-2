export const ExternalAssert = () => globalThis.console.assert = (...a) => globalThis.externalAssert(JSON.stringify(a));

