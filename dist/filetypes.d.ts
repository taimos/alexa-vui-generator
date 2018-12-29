export interface LocalizedTexts {
    [locale: string]: string[];
}
export interface SlotConfig {
    type: string;
    elicitationRequired?: boolean;
    confirmationRequired?: boolean;
    prompt?: string;
    texts: string[] | LocalizedTexts;
}
export interface SlotsConfig {
    [slotName: string]: string | SlotConfig;
}
export interface IntentConfig {
    texts: string[] | LocalizedTexts;
    slots: SlotsConfig;
}
export interface IntentFile {
    [intentName: string]: IntentConfig;
}
