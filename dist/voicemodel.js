"use strict";
/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */
Object.defineProperty(exports, "__esModule", { value: true });
class VoiceInterface {
    constructor(invocation) {
        this.interactionModel = {
            languageModel: {
                invocationName: invocation,
                intents: [],
                types: [],
            },
            prompts: [],
            dialog: {
                intents: [],
            },
        };
    }
    toJSON(pretty) {
        if (pretty) {
            return JSON.stringify({ interactionModel: this.interactionModel }, null, 2);
        }
        return JSON.stringify({ interactionModel: this.interactionModel });
    }
    /**
     * Create or get a new intent
     */
    getOrCreateIntent(intentName) {
        for (const intentDefinition of this.interactionModel.languageModel.intents) {
            if (intentDefinition.name === intentName) {
                return intentDefinition;
            }
        }
        const newIntent = {
            name: intentName,
            samples: [],
            slots: [],
        };
        this.interactionModel.languageModel.intents.push(newIntent);
        return newIntent;
    }
    getOrCreateDialogIntent(intentName) {
        for (const intentDefinition of this.interactionModel.dialog.intents) {
            if (intentDefinition.name === intentName) {
                return intentDefinition;
            }
        }
        const newIntent = {
            name: intentName,
            confirmationRequired: false,
            slots: [],
        };
        this.interactionModel.dialog.intents.push(newIntent);
        this.getOrCreateIntent(intentName);
        return newIntent;
    }
    /**
     * Add a new slot to the given intent
     */
    addSlot(intent, slotName, type) {
        const intentDefinition = typeof intent === 'string' ? this.getOrCreateIntent(intent) : intent;
        if (!intentDefinition.slots) {
            intentDefinition.slots = [];
        }
        const newSlot = { name: slotName, type, samples: [] };
        intentDefinition.slots.push(newSlot);
        return newSlot;
    }
    addDialogSlot(intent, slotName, opts) {
        const intentDefinition = this.getOrCreateDialogIntent(intent);
        if (!intentDefinition.slots) {
            intentDefinition.slots = [];
        }
        const modelSlot = this.addSlot(intent, slotName, opts.type);
        modelSlot.samples = opts.texts;
        const elicitationId = `Elicit.Intent-${intentDefinition.name}.IntentSlot-${slotName}`;
        const newSlot = {
            name: slotName,
            type: opts.type,
            confirmationRequired: opts.confirmationRequired,
            elicitationRequired: opts.elicitationRequired,
            prompts: {
                elicitation: elicitationId,
            },
        };
        intentDefinition.slots.push(newSlot);
        this.interactionModel.prompts.push({
            id: elicitationId,
            variations: [
                {
                    type: 'PlainText',
                    value: opts.prompt,
                },
            ],
        });
        return newSlot;
    }
    /**
     * Create a new slot type and add it to the list
     */
    getOrCreateSlotType(typeName) {
        for (const typeDefinition of this.interactionModel.languageModel.types) {
            if (typeDefinition.name === typeName) {
                return typeDefinition;
            }
        }
        const newType = {
            name: typeName,
            values: [],
        };
        this.interactionModel.languageModel.types.push(newType);
        return newType;
    }
    /**
     * Add the given value to the type
     */
    addValueToSlotType(type, id, value, synonyms) {
        const typeDefinition = typeof type === 'string' ? this.getOrCreateSlotType(type) : type;
        const item = {
            id,
            name: {
                value,
                synonyms: undefined,
            },
        };
        if (synonyms && synonyms.length > 0) {
            item.name.synonyms = synonyms;
        }
        typeDefinition.values.push(item);
        return item;
    }
}
exports.VoiceInterface = VoiceInterface;
//# sourceMappingURL=voicemodel.js.map