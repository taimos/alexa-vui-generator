/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

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

exports.expandStrings = texts => {
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