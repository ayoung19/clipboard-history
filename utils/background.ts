export const watchClipboard = (
  w: Window,
  d: Document,
  getClipboardMonitorIsEnabled: () => Promise<boolean>,
  cb: (content: string) => Promise<void>,
) => {
  const textarea = d.createElement("textarea");
  d.body.appendChild(textarea);

  const handle = async () => {
    const a = Date.now();

    try {
      const clipboardMonitorIsEnabled = await getClipboardMonitorIsEnabled();

      if (clipboardMonitorIsEnabled) {
        textarea.value = "";
        textarea.focus();
        d.execCommand("paste");

        await cb(textarea.value);
      }
    } catch (e) {
      console.log(e);
    } finally {
      w.setTimeout(handle, Math.max(1000, (Date.now() - a) * 6));
    }
  };

  handle();
};
