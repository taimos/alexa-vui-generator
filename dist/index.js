"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const voicemodel_1 = require("./voicemodel");
var intents_1 = require("./intents");
exports.createAudioPlayerIntents = intents_1.createAudioPlayerIntents;
exports.createDisplayIntents = intents_1.createDisplayIntents;
exports.readIntentsFromYAML = intents_1.readIntentsFromYAML;
var types_1 = require("./types");
exports.readTypesFromYAML = types_1.readTypesFromYAML;
__export(require("./voicemodel"));
function addDummyDialog(vui) {
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
exports.createLanguageModel = (options, locale, outputDir = './models') => {
    const vui = new voicemodel_1.VoiceInterface(options.invocation);
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
        fs_extra_1.mkdirpSync(outputDir);
        fs_1.writeFileSync(modelFileName, generatedVUI.toJSON(options.pretty));
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