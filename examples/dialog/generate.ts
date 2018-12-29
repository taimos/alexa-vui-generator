/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {createAudioPlayerIntents, createLanguageModel, readIntentsFromYAML, readTypesFromYAML} from '../../lib';

createLanguageModel({
    invocation: 'p. s. e.',
    processors: [readTypesFromYAML, readIntentsFromYAML, createAudioPlayerIntents],
    pretty: true,
}, 'de-DE');
