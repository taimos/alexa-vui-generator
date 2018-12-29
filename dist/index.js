"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
var intents_1 = require("./intents");
exports.addSlotToIntent = intents_1.addSlotToIntent;
exports.createAudioPlayerIntents = intents_1.createAudioPlayerIntents;
exports.createDisplayIntents = intents_1.createDisplayIntents;
exports.createNewIntent = intents_1.createNewIntent;
exports.readIntentsFromYAML = intents_1.readIntentsFromYAML;
var types_1 = require("./types");
exports.addValueToType = types_1.addValueToType;
exports.createNewSlotType = types_1.createNewSlotType;
exports.readTypesFromYAML = types_1.readTypesFromYAML;
// VUI generation
/**
 * Create the voice interface
 * @param options - the generation options
 * @param locale - the model locale
 * @param outputDir - the output dir (defaults to ./models)
 * @return {Promise.<VoiceInterface>}
 */
exports.createLanguageModel = (options, locale, outputDir = './models') => {
    const vui = {
        interactionModel: {
            languageModel: {
                invocationName: options.invocation,
                intents: undefined,
                types: undefined,
            },
        },
    };
    addDummyDialog(vui);
    let generationPromise = Promise.all([
        createPromise(options.intentCreators || [], locale).then((intents) => {
            vui.interactionModel.languageModel.intents = intents;
        }),
        createPromise(options.typeCreators || [], locale).then((types) => {
            vui.interactionModel.languageModel.types = types;
        }),
    ]).then(() => {
        return Promise.resolve(vui);
    });
    if (options.postProcessors) {
        for (const postProcessor of options.postProcessors) {
            generationPromise = generationPromise.then(postProcessor);
        }
    }
    return generationPromise.then((generatedVUI) => {
        const modelFileName = `${outputDir}/${locale}.json`;
        fs_extra_1.mkdirpSync(outputDir);
        if (options.pretty) {
            fs_1.writeFileSync(modelFileName, JSON.stringify(generatedVUI, null, 2));
        }
        else {
            fs_1.writeFileSync(modelFileName, JSON.stringify(generatedVUI));
        }
        return vui;
    });
};
const addDummyDialog = (vui) => {
    'use strict';
    const interactionModel = vui.interactionModel;
    if (!interactionModel.prompts) {
        interactionModel.prompts = [];
    }
    if (interactionModel.prompts.length !== 0) {
        return;
    }
    if (!interactionModel.dialog) {
        interactionModel.dialog = {};
    }
    if (!interactionModel.dialog.intents) {
        interactionModel.dialog.intents = [];
    }
    interactionModel.dialog.intents.push({
        name: 'DialogActivationDummyIntent',
        confirmationRequired: false,
        slots: [
            {
                name: 'dummy',
                type: 'AMAZON.NUMBER',
                elicitationRequired: true,
                confirmationRequired: false,
                prompts: {
                    elicitation: 'Elicit.Intent-DialogActivationDummyIntent.IntentSlot-dummy',
                },
            },
        ],
    });
    interactionModel.prompts.push({
        id: 'Elicit.Intent-DialogActivationDummyIntent.IntentSlot-dummy',
        variations: [
            {
                type: 'PlainText',
                value: 'Dummy question',
            },
        ],
    });
};
const createPromise = (arg, locale) => {
    'use strict';
    let promise = undefined;
    if (arg instanceof Function) {
        const invoked = arg(locale);
        promise = invoked.then && invoked.then instanceof Function ? invoked : Promise.resolve(invoked);
    }
    else if (Array.isArray(arg)) {
        const promiseArray = arg.map((fn) => createPromise(fn, locale));
        promise = Promise.all(promiseArray).then((results) => [].concat.apply([], results));
    }
    else {
        promise = Promise.resolve(arg);
    }
    return promise;
};
//# sourceMappingURL=index.js.map