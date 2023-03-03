export const Delay = timeout => () => new Promise(accept => setTimeout(accept, timeout));
