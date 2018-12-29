import { VoiceInterface } from './voicemodel';
/**
 * Reads the types.yaml file and modifies the given VUI
 */
export declare const readTypesFromYAML: (vui: VoiceInterface, locale: string) => Promise<VoiceInterface>;
