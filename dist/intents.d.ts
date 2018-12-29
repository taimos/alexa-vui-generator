export interface SlotDefinition {
    name: string;
    type: string;
    samples: string[];
}
export interface IntentDefinition {
    name: string;
    samples: string[];
    slots?: SlotDefinition[];
}
/**
 * Create a new intent and add it to the list
 * @param intentList - the list to add the created intent to
 * @param intentName - the name of the new intent
 * @return {{name: *, samples: Array}} intent object
 */
export declare const createNewIntent: (intentList: IntentDefinition[], intentName: string) => IntentDefinition;
/**
 * Add a new slot to the given intent
 * @param intent - the intent to add the slot to
 * @param name - the slot name
 * @param type - the slot type
 * @return {{name: *, type: *, samples: Array}} the created slot
 */
export declare const addSlotToIntent: (intent: IntentDefinition, name: string, type: string) => SlotDefinition;
/**
 * Reads the intents.yaml file and returns a promise that resolves to the list of intents
 * @param locale - the locale of the language model
 * @return {Promise.<Array>} the intent list
 */
export declare const readIntentsFromYAML: (locale: any) => Promise<IntentDefinition[]>;
/**
 * Creates a list of intents your skill should provide when using the AudioPlayer feature
 * @return {Promise.<Array>} the intent list
 */
export declare const createAudioPlayerIntents: () => Promise<IntentDefinition[]>;
/**
 * Creates a list of intents your skill should provide when using the Display feature
 * @return {Promise.<Array>} the intent list
 */
export declare const createDisplayIntents: () => Promise<IntentDefinition[]>;
