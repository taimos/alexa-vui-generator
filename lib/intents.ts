import {load} from 'yamljs';
import {IntentConfig, IntentFile, LocalizedTexts} from './filetypes';
import {expandStrings} from './utils';
import {VoiceInterface} from './voicemodel';

const expandTexts = (texts : string[] | LocalizedTexts, locale : string) => {
    let res;
    if (Array.isArray(texts)) {
        res = texts;
    } else if (texts[locale]) {
        res = texts[locale];
    } else {
        res = [];
    }
    return expandStrings(res);
};

/**
 * Reads the intents.yaml file and modifies the given VUI
 */
export const readIntentsFromYAML = (vui : VoiceInterface, locale : string) : Promise<VoiceInterface> => {
    vui.getOrCreateIntent('AMAZON.CancelIntent');
    vui.getOrCreateIntent('AMAZON.HelpIntent');
    vui.getOrCreateIntent('AMAZON.StopIntent');
    vui.getOrCreateIntent('AMAZON.FallbackIntent');

    // Intent expansion
    const intentConfig : IntentFile = load('intents.yaml');
    for (const intentName in intentConfig) {
        if (intentConfig.hasOwnProperty(intentName)) {
            const intent = vui.getOrCreateIntent(intentName);
            const config : IntentConfig = intentConfig[intentName];

            if (config) {
                // Generate Samples
                if (config.texts) {
                    expandTexts(config.texts, locale).forEach((e) => intent.samples.push(e));
                }

                // Add Slots
                if (config.slots) {
                    for (const slotName in config.slots) {
                        if (config.slots.hasOwnProperty(slotName)) {
                            const slot = config.slots[slotName];
                            if (typeof slot === 'string') {
                                vui.addSlot(intent, slotName, slot);
                            } else {
                                vui.addDialogSlot(intentName, slotName, {
                                    type: slot.type,
                                    elicitationRequired: slot.elicitationRequired,
                                    confirmationRequired: slot.confirmationRequired,
                                    prompt: slot.prompt,
                                    texts: expandTexts(slot.texts, locale),
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    return Promise.resolve(vui);
};

/**
 * Adds the intents your skill should provide when using the AudioPlayer feature
 */
export const createAudioPlayerIntents = (vui : VoiceInterface, locale : string) : Promise<VoiceInterface> => {
    vui.getOrCreateIntent('AMAZON.PauseIntent');
    vui.getOrCreateIntent('AMAZON.ResumeIntent');
    vui.getOrCreateIntent('AMAZON.LoopOffIntent');
    vui.getOrCreateIntent('AMAZON.LoopOnIntent');
    vui.getOrCreateIntent('AMAZON.NextIntent');
    vui.getOrCreateIntent('AMAZON.PreviousIntent');
    vui.getOrCreateIntent('AMAZON.RepeatIntent');
    vui.getOrCreateIntent('AMAZON.ShuffleOffIntent');
    vui.getOrCreateIntent('AMAZON.ShuffleOnIntent');
    vui.getOrCreateIntent('AMAZON.StartOverIntent');
    return Promise.resolve(vui);
};

/**
 * Adds the intents your skill should provide when using the Display feature
 */
export const createDisplayIntents = (vui : VoiceInterface, locale : string) : Promise<VoiceInterface> => {
    vui.getOrCreateIntent('AMAZON.ScrollUpIntent');
    vui.getOrCreateIntent('AMAZON.ScrollLeftIntent');
    vui.getOrCreateIntent('AMAZON.ScrollDownIntent');
    vui.getOrCreateIntent('AMAZON.ScrollRightIntent');
    vui.getOrCreateIntent('AMAZON.PageUpIntent');
    vui.getOrCreateIntent('AMAZON.PageDownIntent');
    vui.getOrCreateIntent('AMAZON.MoreIntent');
    vui.getOrCreateIntent('AMAZON.NavigateHomeIntent');
    vui.getOrCreateIntent('AMAZON.NavigateSettingsIntent');
    return Promise.resolve(vui);
};
