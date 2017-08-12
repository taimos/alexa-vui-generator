const YAML = require('yamljs');

/**
 * Create a new intent and add it to the list
 * @param intentList - the list to add the created intent to
 * @param intentName - the name of the new intent
 * @return {{name: *, values: Array}} intent object
 */
exports.createNewIntent = (intentList, intentName) => {
  'use strict';
  const newIntent = {
    name: intentName,
    samples: []
  };
  intentList.push(newIntent);
  return newIntent;
};

/**
 * Add a new slot to the given intent
 * @param intent - the intent to add the slot to
 * @param name - the slot name
 * @param type - the slot type
 * @return {{name: *, type: *, samples: Array}} the created slot
 */
exports.addSlotToIntent = (intent, name, type) => {
  'use strict';
  if (!intent.slots) {
    intent.slots = [];
  }
  let newSlot = {
    name: name,
    type: type,
    samples: []
  };
  intent.slots.push(newSlot);
  return newSlot;
};

const expandFirstGroup = text => {
  'use strict';
  
  let open = text.indexOf('(');
  if (open < 0) {
    return null;
  }
  let beginning = text.substring(0, open);
  let match = text.substring(open + 1);
  
  let close = match.indexOf(')');
  let expansion = match.substring(0, close);
  let rest = match.substring(close + 1);
  
  return expansion.split('|').map(part => `${beginning}${part}${rest}`.trim().replace('  ', ' '));
};

const expandStrings = texts => {
  'use strict';
  
  for (; ;) {
    let newTexts = [];
    let found = false;
    
    for (let i = 0; i < texts.length; i++) {
      let items = expandFirstGroup(texts[i]);
      if (items) {
        items.forEach(i => newTexts.push(i));
        found = true;
      } else {
        newTexts.push(texts[i]);
      }
    }
    
    texts = newTexts;
    if (!found) {
      break;
    }
  }
  return texts;
};

/**
 * Reads the intents.yaml file and returns a promise that resolves to the list of intents
 * @return {Promise.<Array>} the intent list
 */
exports.readIntentsFromYAML = () => {
  'use strict';
  
  let intentList = [];
  
  // Add basic intents
  exports.createNewIntent(intentList, 'AMAZON.CancelIntent');
  exports.createNewIntent(intentList, 'AMAZON.HelpIntent');
  exports.createNewIntent(intentList, 'AMAZON.StopIntent');
  
  let dialogActivation = exports.createNewIntent(intentList, 'DialogActivationDummyIntent');
  exports.addSlotToIntent(dialogActivation, 'dummy', 'AMAZON.NUMBER');
  
  // Intent expansion
  let intentConfig = YAML.load('intents.yaml');
  for (let key in intentConfig) {
    if (intentConfig.hasOwnProperty(key)) {
      let intent = exports.createNewIntent(intentList, key);
      let config = intentConfig[key];
      
      // Generate Samples
      if (config.texts) {
        let expansions = expandStrings(config.texts);
        expansions.forEach(e => intent.samples.push(e));
      }
      
      // Add Slots
      if (config.slots) {
        for (let slotName in config.slots) {
          if (config.slots.hasOwnProperty(slotName)) {
            exports.addSlotToIntent(intent, slotName, config.slots[slotName]);
          }
        }
      }
    }
  }
  return Promise.resolve(intentList);
};
