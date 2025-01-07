export const capitalize = (s: string) =>
  s.slice(0, 1).toUpperCase().concat(s.slice(1).toLowerCase());

export const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const sizeFactor = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(sizeFactor));
    const value = bytes / Math.pow(sizeFactor, i);

    return `${parseFloat(value.toFixed(2))} ${sizes[i]}`;
};
