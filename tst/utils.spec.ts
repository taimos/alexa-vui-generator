/*
 * Copyright (c) 2018. Taimos GmbH http://www.taimos.de
 */

import {expect} from 'chai';
import {expandStrings} from '../lib/utils';

describe('Tests the utilities', () => {

    it('should expand correctly', () => {
        expect(expandStrings(['(dem|der|) {attribute} (von|für) {element}'])).to.have.lengthOf(6);
    });

});
