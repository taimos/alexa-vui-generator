import { IntentDefinition } from './intents';
import { TypeDefinition } from './types';
export { addSlotToIntent, createAudioPlayerIntents, createDisplayIntents, createNewIntent, readIntentsFromYAML } from './intents';
export { addValueToType, createNewSlotType, readTypesFromYAML } from './types';
export interface GenerationOptions {
    invocation: string;
    intentCreators?: Array<Promise<IntentDefinition[]> | ((locale: string) => IntentDefinition[] | Promise<IntentDefinition[]>)> | Promise<IntentDefinition[]> | ((locale: string) => IntentDefinition[] | Promise<IntentDefinition[]>);
    typeCreators?: Array<Promise<TypeDefinition[]> | ((locale: string) => TypeDefinition[] | Promise<TypeDefinition[]>)> | Promise<TypeDefinition[]> | ((locale: string) => TypeDefinition[] | Promise<TypeDefinition[]>);
    postProcessors?: Array<((vui: VoiceInterface) => VoiceInterface)>;
    pretty?: boolean;
}
export interface VoiceInterface {
    interactionModel: any;
}
/**
 * Create the voice interface
 * @param options - the generation options
 * @param locale - the model locale
 * @param outputDir - the output dir (defaults to ./models)
 * @return {Promise.<VoiceInterface>}
 */
export declare const createLanguageModel: (options: GenerationOptions, locale: string, outputDir?: string) => Promise<VoiceInterface>;
