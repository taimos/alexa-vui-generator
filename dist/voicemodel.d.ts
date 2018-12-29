export interface SlotDefinition {
    name: string;
    type: string;
    samples: string[];
}
export interface IntentDefinition {
    name: string;
    samples: string[];
    slots?: SlotDefinition[];
}
export interface TypeValueNameDefinition {
    value: string;
    synonyms: string[];
}
export interface TypeValueDefinition {
    id: string;
    name: TypeValueNameDefinition;
}
export interface TypeDefinition {
    name: string;
    values: TypeValueDefinition[];
}
export interface LanguageModel {
    invocationName: string;
    intents: IntentDefinition[];
    types: TypeDefinition[];
}
export interface DialogPrompt {
    elicitation: string;
}
export interface DialogIntentSlotDefinition {
    name: string;
    type: string;
    confirmationRequired: boolean;
    elicitationRequired: boolean;
    prompts: DialogPrompt;
}
export interface DialogIntentDefinition {
    name: string;
    confirmationRequired: boolean;
    prompts?: DialogPrompt;
    slots: DialogIntentSlotDefinition[];
}
export interface DialogDefinition {
    intents: DialogIntentDefinition[];
}
export interface PromptVariationDefinition {
    type: 'PlainText';
    value: string;
}
export interface PromptDefinition {
    id: string;
    variations: PromptVariationDefinition[];
}
export interface InteractionModel {
    languageModel: LanguageModel;
    dialog: DialogDefinition;
    prompts: PromptDefinition[];
}
export interface DialogSlotConfig {
    type: string;
    elicitationRequired: boolean;
    confirmationRequired: boolean;
    prompt: string;
    texts: string[];
}
export declare class VoiceInterface {
    interactionModel: InteractionModel;
    constructor(invocation: string);
    toJSON(pretty: boolean): string;
    /**
     * Create or get a new intent
     */
    getOrCreateIntent(intentName: string): IntentDefinition;
    getOrCreateDialogIntent(intentName: string): DialogIntentDefinition;
    /**
     * Add a new slot to the given intent
     */
    addSlot(intent: string | IntentDefinition, slotName: string, type: string): SlotDefinition;
    addDialogSlot(intent: string, slotName: string, opts: DialogSlotConfig): DialogIntentSlotDefinition;
    /**
     * Create a new slot type and add it to the list
     */
    getOrCreateSlotType(typeName: string): TypeDefinition;
    /**
     * Add the given value to the type
     */
    addValueToSlotType(type: TypeDefinition | string, id: string, value: string, synonyms?: string[]): TypeValueDefinition;
}
