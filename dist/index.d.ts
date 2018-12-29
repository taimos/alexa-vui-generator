import { VoiceInterface } from './voicemodel';
export { createAudioPlayerIntents, createDisplayIntents, readIntentsFromYAML } from './intents';
export { readTypesFromYAML } from './types';
export interface GenerationOptions {
    invocation: string;
    processors?: Array<((vui: VoiceInterface, locale: string) => Promise<VoiceInterface> | VoiceInterface)>;
    pretty?: boolean;
    skipOuput?: boolean;
}
/**
 * Create the voice interface
 * @param options - the generation options
 * @param locale - the model locale
 * @param outputDir - the output dir (defaults to ./models)
 * @return {Promise.<VoiceInterface>}
 */
export declare const createLanguageModel: (options: GenerationOptions, locale: string, outputDir?: string) => Promise<VoiceInterface>;
