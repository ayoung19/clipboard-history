export const simplePathJoin = (...segments: string[]) => segments.join("/");

export const simplePathBasename = (path: string) => path.split("/").slice(-1)[0] || "";
