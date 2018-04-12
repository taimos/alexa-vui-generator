const YAML = require('yamljs');

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
    values: []
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
  let item = {
    id: id,
    name: {
      value: value
    }
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
  let typeList = [];
  
  //load types.yaml and generate types
  let typeConfig = YAML.load('types.yaml');
  
  for (let key in typeConfig) {
    if (typeConfig.hasOwnProperty(key)) {
      let type = exports.createNewSlotType(typeList, key);
      let config = typeConfig[key];
      
      for (let id in config) {
        if (config.hasOwnProperty(id)) {
          
          let texts;
          if (Array.isArray(config[id])) {
            texts = config[id];
          } else if (config[id][locale]) {
            texts = config[id][locale];
          } else {
            texts = [id];
          }
          texts = texts.map(val => val.toLowerCase());
          exports.addValueToType(type, id, texts[0], texts.slice(1));
        }
      }
    }
  }
  return Promise.resolve(typeList);
};