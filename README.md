<a href="https://www.producthunt.com/posts/clipboard-history-3?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-clipboard&#0045;history&#0045;3" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=490162&theme=light" alt="Clipboard&#0032;History - Securely&#0032;access&#0044;&#0032;track&#0044;&#0032;and&#0032;manage&#0032;your&#0032;clipboard&#0032;history | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

# Clipboard History

The first open source clipboard manager Chrome extension. Get all of the productivity benefits of a clipboard history with none of the security risks.

Clipboard History offers a simple, efficient, and secure way to manage your clipboard. When the clipboard monitor is enabled, everything you copy to your clipboard will be backed up and saved locally for easy access later. Never worry about losing important content in your clipboard again!

## Security & Privacy

Unrestricted access to your clipboard can raise serious privacy concerns. In an effort to be the most trustworthy clipboard history manager, Clipboard History is fully open-source. You can download or review the source code here: https://github.com/ayoung19/clipboard-history

# Contributing

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
