/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {writeFileSync} from 'fs';
import {mkdirpSync} from 'fs-extra';
import {addSlotToIntent, createAudioPlayerIntents, createDisplayIntents, createNewIntent, IntentDefinition, readIntentsFromYAML} from './intents';
import {addValueToType, createNewSlotType, readTypesFromYAML, TypeDefinition} from './types';

export {addSlotToIntent, createAudioPlayerIntents, createDisplayIntents, createNewIntent, readIntentsFromYAML} from './intents';
export {addValueToType, createNewSlotType, readTypesFromYAML} from './types';

export interface GenerationOptions {
    invocation : string;
    intentCreators? : Array<Promise<IntentDefinition[]> | ((locale : string) => IntentDefinition[] | Promise<IntentDefinition[]>)> | Promise<IntentDefinition[]> | ((locale : string) => IntentDefinition[] | Promise<IntentDefinition[]>);
    typeCreators? : Array<Promise<TypeDefinition[]> | ((locale : string) => TypeDefinition[] | Promise<TypeDefinition[]>)> | Promise<TypeDefinition[]> | ((locale : string) => TypeDefinition[] | Promise<TypeDefinition[]>);
    postProcessors? : Array<((vui : VoiceInterface) => VoiceInterface)>;
    pretty? : boolean;
}

export interface VoiceInterface {
    interactionModel : any; // TODO
}

// VUI generation
/**
 * Create the voice interface
 * @param options - the generation options
 * @param locale - the model locale
 * @param outputDir - the output dir (defaults to ./models)
 * @return {Promise.<VoiceInterface>}
 */
export const createLanguageModel = (options : GenerationOptions, locale : string, outputDir = './models') : Promise<VoiceInterface> => {
    const vui : VoiceInterface = {
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
        mkdirpSync(outputDir);
        if (options.pretty) {
            writeFileSync(modelFileName, JSON.stringify(generatedVUI, null, 2));
        } else {
            writeFileSync(modelFileName, JSON.stringify(generatedVUI));
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
    } else if (Array.isArray(arg)) {
        const promiseArray = arg.map((fn) => createPromise(fn, locale));
        promise = Promise.all(promiseArray).then((results) => [].concat.apply([], results));
    } else {
        promise = Promise.resolve(arg);
    }
    return promise;
};
