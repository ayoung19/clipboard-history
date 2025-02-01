export const watchClipboard = (
  w: Window,
  d: Document,
  getClipboardMonitorIsEnabled: () => Promise<boolean>,
  cb: (content: string) => Promise<void>,
) => {
  let pushing = false;
  let fetching = false;

  w.addEventListener(
    "paste",
    async (e) => {
      e.preventDefault();

      if (pushing || !e.clipboardData) {
        return;
      }

      const curr = e.clipboardData.getData("text/plain");

      try {
        pushing = true;

        await cb(curr);
      } catch (e) {
        console.log(e);
      } finally {
        pushing = false;
      }
    },
    { capture: true },
  );

  w.setInterval(async () => {
    if (fetching) {
      return;
    }

    try {
      fetching = true;

      if (await getClipboardMonitorIsEnabled()) {
        d.execCommand("paste");
      }
    } catch (e) {
      console.log(e);
    } finally {
      fetching = false;
    }
  }, 800);
};
