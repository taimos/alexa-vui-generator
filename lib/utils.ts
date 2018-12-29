/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

const expandFirstGroup = (text : string) : string[] => {
    'use strict';

    const open = text.indexOf('(');
    if (open < 0) {
        return null;
    }
    const beginning = text.substring(0, open);
    const match = text.substring(open + 1);

    const close = match.indexOf(')');
    const expansion = match.substring(0, close);
    const rest = match.substring(close + 1);

    return expansion.split('|').map((part) => `${beginning}${part}${rest}`.trim().replace('  ', ' '));
};

export const expandStrings = (texts : string[]) : string[] => {
    'use strict';

    for (; ;) {
        const newTexts = [];
        let found = false;

        for (const text of texts) {
            const items = expandFirstGroup(text);
            if (items) {
                items.forEach((i) => newTexts.push(i));
                found = true;
            } else {
                newTexts.push(text);
            }
        }

        texts = newTexts;
        if (!found) {
            break;
        }
    }
    return texts;
};
