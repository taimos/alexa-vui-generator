"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yamljs_1 = require("yamljs");
const utils_1 = require("./utils");
/**
 * Create a new slot type and add it to the list
 * @param typeList - the list to add the created type to
 * @param typeName - the name of the new type
 * @return {{name: *, values: Array}} type object
 */
exports.createNewSlotType = (typeList, typeName) => {
    'use strict';
    const newType = {
        name: typeName,
        values: [],
    };
    typeList.push(newType);
    return newType;
};
/**
 * Add the given value to the type
 * @param type - the slot type to add the value to
 * @param id - the id of the entity
 * @param value - the value of the entity
 * @param synonyms - the synonyms to use for the entity
 */
exports.addValueToType = (type, id, value, synonyms) => {
    'use strict';
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
    type.values.push(item);
};
/**
 * Reads the types.yaml file and returns a promise that resolves to the list of types
 * @param locale - the locale of the language model
 * @return {Promise.<Array>} the type list
 */
exports.readTypesFromYAML = (locale) => {
    'use strict';
    const typeList = [];
    // load types.yaml and generate types
    const typeConfig = yamljs_1.load('types.yaml');
    for (const key in typeConfig) {
        if (typeConfig.hasOwnProperty(key)) {
            const type = exports.createNewSlotType(typeList, key);
            const config = typeConfig[key];
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
                    exports.addValueToType(type, id, texts[0], texts.slice(1));
                }
            }
        }
    }
    return Promise.resolve(typeList);
};
//# sourceMappingURL=types.js.map