/*
 * Copyright (c) 2017. Taimos GmbH http://www.taimos.de
 */

const fs = require('fs');
const intentLib = require('./lib/intents');
const typeLib = require('./lib/types');

// Intents
/**
 * Create a new intent and add it to the list
 * @param intentList - the list to add the created intent to
 * @param intentName - the name of the new intent
 * @return {{name: *, values: Array}} intent object
 */
exports.createNewIntent = intentLib.createNewIntent;

/**
 * Add a new slot to the given intent
 * @param intent - the intent to add the slot to
 * @param name - the slot name
 * @param type - the slot type
 * @return {{name: *, type: *, samples: Array}} the created slot
 */
exports.addSlotToIntent = intentLib.addSlotToIntent;

/**
 * Reads the intents.yaml file and returns a promise that resolves to the list of intents
 * @param locale - the locale of the language model
 * @return {Promise.<Array>} the intent list
 */
exports.readIntentsFromYAML = intentLib.readIntentsFromYAML;

/**
 * Creates a list of intents your skill should provide when using the AudioPlayer feature
 * @return {Promise.<Array>} the intent list
 */
exports.createAudioPlayerIntents = intentLib.createAudioPlayerIntents;

// Slot Types
/**
 * Create a new slot type and add it to the list
 * @param typeList - the list to add the created type to
 * @param typeName - the name of the new type
 * @return {{name: *, values: Array}} type object
 */
exports.createNewSlotType = typeLib.createNewSlotType;

/**
 * Add the given value to the type
 * @param type - the slot type to add the value to
 * @param id - the id of the entity
 * @param value - the value of the entity
 * @param synonyms - the synonyms to use for the entity
 */
exports.addValueToType = typeLib.addValueToType;

/**
 * Reads the types.yaml file and returns a promise that resolves to the list of types
 * @param locale - the locale of the language model
 * @return {Promise.<Array>} the type list
 */
exports.readTypesFromYAML = typeLib.readTypesFromYAML;

// VUI generation
/**
 * Create the voice interface
 * @param options - the generation options
 * @param locale - the model locale
 * @return {Promise.<VoiceInterface>}
 */
exports.createLanguageModel = (options, locale) => {
  'use strict';
  let intentCreators = options.intentCreators || [];
  let typeCreators = options.typeCreators || [];
  
  let modelFileName = `./models/${locale}.json`;
  let vui;
  if (fs.existsSync(modelFileName)) {
    vui = JSON.parse(fs.readFileSync(modelFileName));
  } else {
    vui = {};
  }
  
  if (!vui.interactionModel) {
    vui.interactionModel = {};
  }
  if (!vui.interactionModel.languageModel) {
    vui.interactionModel.languageModel = {
      invocationName: options.invocation || ''
    };
  } else if (options.invocation) {
    vui.interactionModel.languageModel.invocationName = options.invocation;
  }
  addDummyDialog(vui);
  
  let generationPromise = Promise.all([
    createPromise(intentCreators, locale).then(intents => {
      vui.interactionModel.languageModel.intents = intents;
    }),
    createPromise(typeCreators, locale).then(types => {
      vui.interactionModel.languageModel.types = types;
    })
  ]).then(() => {
    return Promise.resolve(vui);
  });
  
  if (options.postProcessor) {
    generationPromise = generationPromise.then(options.postProcessor);
  }
  
  return generationPromise.then(vui => {
    if (options.pretty) {
      fs.writeFileSync(modelFileName, JSON.stringify(vui, null, 2));
    } else {
      fs.writeFileSync(modelFileName, JSON.stringify(vui));
    }
    return vui;
  });
};

const addDummyDialog = vui => {
  'use strict';
  
  let interactionModel = vui.interactionModel;
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
          elicitation: 'Elicit.Intent-DialogActivationDummyIntent.IntentSlot-dummy'
        }
      }
    ]
  });
  interactionModel.prompts.push({
    id: 'Elicit.Intent-DialogActivationDummyIntent.IntentSlot-dummy',
    variations: [
      {
        type: 'PlainText',
        value: 'Dummy question'
      }
    ]
  });
};

const createPromise = (arg, locale) => {
  'use strict';
  let promise = undefined;
  if (arg instanceof Function) {
    let invoked = arg(locale);
    if (invoked.then && invoked.then instanceof Function) {
      promise = invoked;
    } else {
      promise = Promise.resolve(invoked);
    }
  } else if (Array.isArray(arg)) {
    let promiseArray = arg.map(fn => createPromise(fn, locale));
    promise = Promise.all(promiseArray).then(results => [].concat.apply([], results));
  } else {
    promise = Promise.resolve(arg);
  }
  return promise;
};

