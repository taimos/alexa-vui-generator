import { VoiceInterface } from './voicemodel';
/**
 * Reads the intents.yaml file and modifies the given VUI
 */
export declare const readIntentsFromYAML: (vui: VoiceInterface, locale: string) => Promise<VoiceInterface>;
/**
 * Adds the intents your skill should provide when using the AudioPlayer feature
 */
export declare const createAudioPlayerIntents: (vui: VoiceInterface, locale: string) => Promise<VoiceInterface>;
/**
 * Adds the intents your skill should provide when using the Display feature
 */
export declare const createDisplayIntents: (vui: VoiceInterface, locale: string) => Promise<VoiceInterface>;
