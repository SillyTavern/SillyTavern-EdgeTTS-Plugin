import bodyParser from 'body-parser';
import { Router } from 'express';
import { Chalk } from 'chalk';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { Readable } from 'stream';
import xmlEscape from 'xml-escape';

interface PluginInfo {
    id: string;
    name: string;
    description: string;
}

interface Plugin {
    init: (router: Router) => Promise<void>;
    exit: () => Promise<void>;
    info: PluginInfo;
}

const chalk = new Chalk();
const MODULE_NAME = '[SillyTavern-EdgeTTS-Plugin]';

async function getVoices() {
    const tts = new MsEdgeTTS();
    const voices = await tts.getVoices();
    return voices;
}

async function getVoiceStream(text: string, voice: string): Promise<Readable> {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS);
    const { audioStream } = tts.toStream(xmlEscape(text));
    return audioStream;
}

/**
 * Initialize the plugin.
 * @param router Express Router
 */
export async function init(router: Router): Promise<void> {
    const jsonParser = bodyParser.json();
    // Used to check if the server plugin is running
    router.post('/probe', (_req, res) => {
        return res.sendStatus(204);
    });
    router.get('/list', async (_req, res) => {
        try {
            const voices = await getVoices();
            return res.json(voices);
        } catch (error) {
            console.error(chalk.red(MODULE_NAME), 'Request failed', error);
            return res.status(500).send('Internal Server Error');
        }
    });
    router.post('/generate', jsonParser, async (req, res) => {
        try {
            const { text, voice } = req.body;
            if (!text || !voice) {
                return res.status(400).send('Bad Request');
            }
            const stream = await getVoiceStream(text, voice);
            res.setHeader('Content-Type', 'audio/webm');
            return stream.pipe(res);
        } catch (error) {
            console.error(chalk.red(MODULE_NAME), 'Request failed', error);
            return res.status(500).send('Internal Server Error');
        }
    });

    console.log(chalk.green(MODULE_NAME), 'Plugin loaded!');
}

export async function exit(): Promise<void> {
    console.log(chalk.yellow(MODULE_NAME), 'Plugin exited');
}

export const info: PluginInfo = {
    id: 'edge-tts',
    name: 'EdgeTTS Provider',
    description: 'EdgeTTS voice provider for SillyTavern TTS extension.',
};

const plugin: Plugin = {
    init,
    exit,
    info,
};

export default plugin;
