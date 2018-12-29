"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yamljs_1 = require("yamljs");
const utils_1 = require("./utils");
/**
 * Create a new intent and add it to the list
 * @param intentList - the list to add the created intent to
 * @param intentName - the name of the new intent
 * @return {{name: *, samples: Array}} intent object
 */
exports.createNewIntent = (intentList, intentName) => {
    'use strict';
    const newIntent = {
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
exports.addSlotToIntent = (intent, name, type) => {
    'use strict';
    if (!intent.slots) {
        intent.slots = [];
    }
    const newSlot = { name, type, samples: [] };
    intent.slots.push(newSlot);
    return newSlot;
};
/**
 * Reads the intents.yaml file and returns a promise that resolves to the list of intents
 * @param locale - the locale of the language model
 * @return {Promise.<Array>} the intent list
 */
exports.readIntentsFromYAML = (locale) => {
    'use strict';
    const intentList = [];
    // Add basic intents
    exports.createNewIntent(intentList, 'AMAZON.CancelIntent');
    exports.createNewIntent(intentList, 'AMAZON.HelpIntent');
    exports.createNewIntent(intentList, 'AMAZON.StopIntent');
    const dialogActivation = exports.createNewIntent(intentList, 'DialogActivationDummyIntent');
    exports.addSlotToIntent(dialogActivation, 'dummy', 'AMAZON.NUMBER');
    // Intent expansion
    const intentConfig = yamljs_1.load('intents.yaml');
    for (const key in intentConfig) {
        if (intentConfig.hasOwnProperty(key)) {
            const intent = exports.createNewIntent(intentList, key);
            const config = intentConfig[key];
            if (config) {
                // Generate Samples
                if (config.texts) {
                    let texts;
                    if (Array.isArray(config.texts)) {
                        texts = config.texts;
                    }
                    else if (config.texts[locale]) {
                        texts = config.texts[locale];
                    }
                    else {
                        texts = [];
                    }
                    utils_1.expandStrings(texts).forEach((e) => intent.samples.push(e));
                }
                // Add Slots
                if (config.slots) {
                    for (const slotName in config.slots) {
                        if (config.slots.hasOwnProperty(slotName)) {
                            exports.addSlotToIntent(intent, slotName, config.slots[slotName]);
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
exports.createAudioPlayerIntents = () => {
    'use strict';
    const intentList = [];
    exports.createNewIntent(intentList, 'AMAZON.PauseIntent');
    exports.createNewIntent(intentList, 'AMAZON.ResumeIntent');
    exports.createNewIntent(intentList, 'AMAZON.LoopOffIntent');
    exports.createNewIntent(intentList, 'AMAZON.LoopOnIntent');
    exports.createNewIntent(intentList, 'AMAZON.NextIntent');
    exports.createNewIntent(intentList, 'AMAZON.PreviousIntent');
    exports.createNewIntent(intentList, 'AMAZON.RepeatIntent');
    exports.createNewIntent(intentList, 'AMAZON.ShuffleOffIntent');
    exports.createNewIntent(intentList, 'AMAZON.ShuffleOnIntent');
    exports.createNewIntent(intentList, 'AMAZON.StartOverIntent');
    return Promise.resolve(intentList);
};
/**
 * Creates a list of intents your skill should provide when using the Display feature
 * @return {Promise.<Array>} the intent list
 */
exports.createDisplayIntents = () => {
    'use strict';
    const intentList = [];
    exports.createNewIntent(intentList, 'AMAZON.ScrollUpIntent');
    exports.createNewIntent(intentList, 'AMAZON.ScrollLeftIntent');
    exports.createNewIntent(intentList, 'AMAZON.ScrollDownIntent');
    exports.createNewIntent(intentList, 'AMAZON.ScrollRightIntent');
    exports.createNewIntent(intentList, 'AMAZON.PageUpIntent');
    exports.createNewIntent(intentList, 'AMAZON.PageDownIntent');
    exports.createNewIntent(intentList, 'AMAZON.MoreIntent');
    exports.createNewIntent(intentList, 'AMAZON.NavigateHomeIntent');
    exports.createNewIntent(intentList, 'AMAZON.NavigateSettingsIntent');
    return Promise.resolve(intentList);
};
//# sourceMappingURL=intents.js.map