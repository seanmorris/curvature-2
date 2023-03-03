export const ExternalAssert = () => (globalThis||window).console.assert = (...a) => (globalThis||window).externalAssert(JSON.stringify(a));

