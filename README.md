# SillyTavern Edge TTS Plugin

Server plugin to generate TTS voices using [MsEdgeTTS](https://www.npmjs.com/package/msedge-tts).

Must have SillyTavern >=1.12.0 or the latest staging branch.

## How to install

1. Before you begin, make sure you set a config `enableServerPlugins` to `true` in the config.yaml file of SillyTavern.

2. Open a terminal in your SillyTavern directory, then run the following:

```bash
cd plugins
git clone https://github.com/SillyTavern/SillyTavern-EdgeTTS-Plugin
```

3. Restart the SillyTavern server.

## How to use

1. Install the plugin.
2. Open the TTS panel from the extensions menu.
3. Pick "Edge" as a TTS source.
4. Pick "Plugin" in the dropdown list below.

## How to build

Clone the repository, then run `npm install`.

```bash
# Debug build
npm run build:dev
# Prod build
npm run build
```
