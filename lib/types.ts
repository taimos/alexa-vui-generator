import {load} from 'yamljs';
import {expandStrings} from './utils';
import {VoiceInterface} from './voicemodel';

/**
 * Reads the types.yaml file and modifies the given VUI
 */
export const readTypesFromYAML = (vui : VoiceInterface, locale : string) : Promise<VoiceInterface> => {

    // load types.yaml and generate types
    const typeConfig = load('types.yaml');
    for (const typeName in typeConfig) {
        if (typeConfig.hasOwnProperty(typeName)) {
            const type = vui.getOrCreateSlotType(typeName);
            const config = typeConfig[typeName];

            for (const id in config) {
                if (config.hasOwnProperty(id)) {
                    let texts;
                    if (Array.isArray(config[id])) {
                        texts = config[id];
                    } else if (config[id][locale]) {
                        texts = config[id][locale];
                    } else {
                        texts = [id];
                    }
                    texts = expandStrings(texts).map((val) => val.toLowerCase());
                    vui.addValueToSlotType(type, id, texts[0], texts.slice(1));
                }
            }
        }
    }
    return Promise.resolve(vui);
};
