/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {writeFileSync} from 'fs';
import {mkdirpSync} from 'fs-extra';
import {createAudioPlayerIntents, createDisplayIntents, readIntentsFromYAML} from './intents';
import {readTypesFromYAML} from './types';
import {VoiceInterface} from './voicemodel';

export {createAudioPlayerIntents, createDisplayIntents, readIntentsFromYAML} from './intents';
export {readTypesFromYAML} from './types';
export * from './voicemodel';

export interface GenerationOptions {
    invocation : string;
    processors? : Array<((vui : VoiceInterface, locale : string) => Promise<VoiceInterface> | VoiceInterface)>;
    pretty? : boolean;
    skipOuput? : boolean;
}

function addDummyDialog(vui : VoiceInterface) : void {
    vui.addDialogSlot('DialogActivationDummyIntent', 'dummy', {
        type: 'AMAZON.NUMBER',
        texts: [],
        confirmationRequired: false,
        elicitationRequired: true,
        prompt: 'Dummy question',
    });
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
    const vui : VoiceInterface = new VoiceInterface(options.invocation);
    addDummyDialog(vui);

    let generationPromise = Promise.resolve(vui);

    if (options.processors) {
        for (const processor of options.processors) {
            generationPromise = generationPromise.then((currentVui) => processor(currentVui, locale));
        }
    }

    if (options.skipOuput) {
        return generationPromise;
    }
    return generationPromise.then((generatedVUI) => {
        const modelFileName = `${outputDir}/${locale}.json`;
        mkdirpSync(outputDir);
        writeFileSync(modelFileName, generatedVUI.toJSON(options.pretty));
        return vui;
    }).catch((reason) => {
        console.log(reason);
        throw reason;
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
