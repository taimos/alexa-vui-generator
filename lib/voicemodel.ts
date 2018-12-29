/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

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

export interface TypeValueNameDefinition {
    value : string;
    synonyms : string[];
}

export interface TypeValueDefinition {
    id : string;
    name : TypeValueNameDefinition;
}

export interface TypeDefinition {
    name : string;
    values : TypeValueDefinition[];
}

export interface LanguageModel {
    invocationName : string;
    intents : IntentDefinition[];
    types : TypeDefinition[];
}

export interface DialogPrompt {
    elicitation : string;
}

export interface DialogIntentSlotDefinition {
    name : string;
    type : string;
    confirmationRequired : boolean;
    elicitationRequired : boolean;
    prompts : DialogPrompt;
}

export interface DialogIntentDefinition {
    name : string;
    confirmationRequired : boolean;
    prompts? : DialogPrompt;
    slots : DialogIntentSlotDefinition[];
}

export interface DialogDefinition {
    intents : DialogIntentDefinition[];
}

export interface PromptVariationDefinition {
    type : 'PlainText';
    value : string;
}

export interface PromptDefinition {
    id : string;
    variations : PromptVariationDefinition[];
}

export interface InteractionModel {
    languageModel : LanguageModel;
    dialog : DialogDefinition;
    prompts : PromptDefinition[];
}

export interface DialogSlotConfig {
    type : string;
    elicitationRequired : boolean;
    confirmationRequired : boolean;
    prompt : string;
    texts : string[];
}

export class VoiceInterface {
    public interactionModel : InteractionModel;

    constructor(invocation : string) {
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

    public toJSON(pretty : boolean) : string {
        if (pretty) {
            return JSON.stringify({interactionModel: this.interactionModel}, null, 2);
        }
        return JSON.stringify({interactionModel: this.interactionModel});
    }

    /**
     * Create or get a new intent
     */
    public getOrCreateIntent(intentName : string) : IntentDefinition {
        for (const intentDefinition of this.interactionModel.languageModel.intents) {
            if (intentDefinition.name === intentName) {
                return intentDefinition;
            }
        }
        const newIntent : IntentDefinition = {
            name: intentName,
            samples: [],
            slots: [],
        };
        this.interactionModel.languageModel.intents.push(newIntent);
        return newIntent;
    }

    public getOrCreateDialogIntent(intentName : string) : DialogIntentDefinition {
        for (const intentDefinition of this.interactionModel.dialog.intents) {
            if (intentDefinition.name === intentName) {
                return intentDefinition;
            }
        }
        const newIntent : DialogIntentDefinition = {
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
    public addSlot(intent : string | IntentDefinition, slotName : string, type : string) : SlotDefinition {
        const intentDefinition : IntentDefinition = typeof intent === 'string' ? this.getOrCreateIntent(intent) : intent;
        if (!intentDefinition.slots) {
            intentDefinition.slots = [];
        }
        const newSlot : SlotDefinition = {name: slotName, type, samples: []};
        intentDefinition.slots.push(newSlot);
        return newSlot;
    }

    public addDialogSlot(intent : string, slotName : string, opts : DialogSlotConfig) : DialogIntentSlotDefinition {
        const intentDefinition : DialogIntentDefinition = this.getOrCreateDialogIntent(intent);
        if (!intentDefinition.slots) {
            intentDefinition.slots = [];
        }
        const modelSlot = this.addSlot(intent, slotName, opts.type);
        modelSlot.samples = opts.texts;

        const elicitationId = `Elicit.Intent-${intentDefinition.name}.IntentSlot-${slotName}`;
        const newSlot : DialogIntentSlotDefinition = {
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
    public getOrCreateSlotType(typeName : string) : TypeDefinition {
        for (const typeDefinition of this.interactionModel.languageModel.types) {
            if (typeDefinition.name === typeName) {
                return typeDefinition;
            }
        }
        const newType : TypeDefinition = {
            name: typeName,
            values: [],
        };
        this.interactionModel.languageModel.types.push(newType);
        return newType;
    }

    /**
     * Add the given value to the type
     */
    public addValueToSlotType(type : TypeDefinition | string, id : string, value : string, synonyms? : string[]) : TypeValueDefinition {
        const typeDefinition : TypeDefinition = typeof type === 'string' ? this.getOrCreateSlotType(type) : type;
        const item : TypeValueDefinition = {
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
