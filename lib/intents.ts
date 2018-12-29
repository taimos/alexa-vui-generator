import {load} from 'yamljs';
import {expandStrings} from './utils';

export interface SlotDefinition {
    name : string;
    type : string;
    samples : string[];
}

export interface IntentDefinition {
    name : string;
    samples : string[];
    slots? : SlotDefinition[];
}

/**
 * Create a new intent and add it to the list
 * @param intentList - the list to add the created intent to
 * @param intentName - the name of the new intent
 * @return {{name: *, samples: Array}} intent object
 */
export const createNewIntent = (intentList : IntentDefinition[], intentName : string) : IntentDefinition => {
    'use strict';
    const newIntent : IntentDefinition = {
        name: intentName,
        samples: [],
    };
    intentList.push(newIntent);
    return newIntent;
};

/**
 * Add a new slot to the given intent
 * @param intent - the intent to add the slot to
 * @param name - the slot name
 * @param type - the slot type
 * @return {{name: *, type: *, samples: Array}} the created slot
 */
export const addSlotToIntent = (intent : IntentDefinition, name : string, type : string) : SlotDefinition => {
    'use strict';
    if (!intent.slots) {
        intent.slots = [];
    }
    const newSlot : SlotDefinition = {name, type, samples: []};
    intent.slots.push(newSlot);
    return newSlot;
};

/**
 * Reads the intents.yaml file and returns a promise that resolves to the list of intents
 * @param locale - the locale of the language model
 * @return {Promise.<Array>} the intent list
 */
export const readIntentsFromYAML = (locale) : Promise<IntentDefinition[]> => {
    'use strict';

    const intentList = [];

    // Add basic intents
    createNewIntent(intentList, 'AMAZON.CancelIntent');
    createNewIntent(intentList, 'AMAZON.HelpIntent');
    createNewIntent(intentList, 'AMAZON.StopIntent');

    const dialogActivation = createNewIntent(intentList, 'DialogActivationDummyIntent');
    addSlotToIntent(dialogActivation, 'dummy', 'AMAZON.NUMBER');

    // Intent expansion
    const intentConfig = load('intents.yaml');
    for (const key in intentConfig) {
        if (intentConfig.hasOwnProperty(key)) {
            const intent = createNewIntent(intentList, key);
            const config = intentConfig[key];

            if (config) {
                // Generate Samples
                if (config.texts) {
                    let texts;
                    if (Array.isArray(config.texts)) {
                        texts = config.texts;
                    } else if (config.texts[locale]) {
                        texts = config.texts[locale];
                    } else {
                        texts = [];
                    }
                    expandStrings(texts).forEach((e) => intent.samples.push(e));
                }

                // Add Slots
                if (config.slots) {
                    for (const slotName in config.slots) {
                        if (config.slots.hasOwnProperty(slotName)) {
                            addSlotToIntent(intent, slotName, config.slots[slotName]);
                        }
                    }
                }
            }
        }
    }
    return Promise.resolve(intentList);
};

/**
 * Creates a list of intents your skill should provide when using the AudioPlayer feature
 * @return {Promise.<Array>} the intent list
 */
export const createAudioPlayerIntents = () : Promise<IntentDefinition[]> => {
    'use strict';

    const intentList = [];

    createNewIntent(intentList, 'AMAZON.PauseIntent');
    createNewIntent(intentList, 'AMAZON.ResumeIntent');
    createNewIntent(intentList, 'AMAZON.LoopOffIntent');
    createNewIntent(intentList, 'AMAZON.LoopOnIntent');
    createNewIntent(intentList, 'AMAZON.NextIntent');
    createNewIntent(intentList, 'AMAZON.PreviousIntent');
    createNewIntent(intentList, 'AMAZON.RepeatIntent');
    createNewIntent(intentList, 'AMAZON.ShuffleOffIntent');
    createNewIntent(intentList, 'AMAZON.ShuffleOnIntent');
    createNewIntent(intentList, 'AMAZON.StartOverIntent');

    return Promise.resolve(intentList);
};

/**
 * Creates a list of intents your skill should provide when using the Display feature
 * @return {Promise.<Array>} the intent list
 */
export const createDisplayIntents = () : Promise<IntentDefinition[]> => {
    'use strict';

    const intentList = [];

    createNewIntent(intentList, 'AMAZON.ScrollUpIntent');
    createNewIntent(intentList, 'AMAZON.ScrollLeftIntent');
    createNewIntent(intentList, 'AMAZON.ScrollDownIntent');
    createNewIntent(intentList, 'AMAZON.ScrollRightIntent');
    createNewIntent(intentList, 'AMAZON.PageUpIntent');
    createNewIntent(intentList, 'AMAZON.PageDownIntent');
    createNewIntent(intentList, 'AMAZON.MoreIntent');
    createNewIntent(intentList, 'AMAZON.NavigateHomeIntent');
    createNewIntent(intentList, 'AMAZON.NavigateSettingsIntent');

    return Promise.resolve(intentList);
};
