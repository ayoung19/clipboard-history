export const watchClipboard = (w: Window, d: Document, cb: (content: string) => void) => {
  const textarea = d.createElement("textarea");
  d.body.appendChild(textarea);

  w.setInterval(() => {
    textarea.value = "";
    textarea.focus();
    d.execCommand("paste");

    cb(textarea.value);
  }, 1000);
};
