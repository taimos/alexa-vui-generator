"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yamljs_1 = require("yamljs");
const utils_1 = require("./utils");
/**
 * Reads the types.yaml file and modifies the given VUI
 */
exports.readTypesFromYAML = (vui, locale) => {
    // load types.yaml and generate types
    const typeConfig = yamljs_1.load('types.yaml');
    for (const typeName in typeConfig) {
        if (typeConfig.hasOwnProperty(typeName)) {
            const type = vui.getOrCreateSlotType(typeName);
            const config = typeConfig[typeName];
            for (const id in config) {
                if (config.hasOwnProperty(id)) {
                    let texts;
                    if (Array.isArray(config[id])) {
                        texts = config[id];
                    }
                    else if (config[id][locale]) {
                        texts = config[id][locale];
                    }
                    else {
                        texts = [id];
                    }
                    texts = utils_1.expandStrings(texts).map((val) => val.toLowerCase());
                    vui.addValueToSlotType(type, id, texts[0], texts.slice(1));
                }
            }
        }
    }
    return Promise.resolve(vui);
};
//# sourceMappingURL=types.js.map