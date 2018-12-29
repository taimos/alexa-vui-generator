/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {createLanguageModel, readIntentsFromYAML, readTypesFromYAML} from '../../lib';

createLanguageModel({
    intentCreators: readIntentsFromYAML,
    typeCreators: [readTypesFromYAML],
    invocation: 'p. s. e.',
    pretty: true,
}, 'de-DE');
