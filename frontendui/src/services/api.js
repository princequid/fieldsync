// api helper
export const api = (path) => fetch(path).then((r) => r.json());
