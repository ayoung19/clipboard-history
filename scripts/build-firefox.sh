mv package.json .package.json
jq 'del(.manifest.permissions[] | select(. == "offscreen"))' .package.json > package.json
pnpm build --target=firefox-mv2
mv .package.json package.json
