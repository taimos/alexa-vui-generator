/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {createLanguageModel, readIntentsFromYAML, readTypesFromYAML} from '../../lib';

createLanguageModel({
    invocation: 'p. s. e.',
    processors: [readIntentsFromYAML, readTypesFromYAML],
    pretty: true,
}, 'de-DE');
