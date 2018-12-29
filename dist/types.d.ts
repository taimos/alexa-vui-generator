export interface TypeValueNameDefinition {
    value: string;
    synonyms: string[];
}
export interface TypeValueDefinition {
    id: string;
    name: TypeValueNameDefinition;
}
export interface TypeDefinition {
    name: string;
    values: TypeValueDefinition[];
}
/**
 * Create a new slot type and add it to the list
 * @param typeList - the list to add the created type to
 * @param typeName - the name of the new type
 * @return {{name: *, values: Array}} type object
 */
export declare const createNewSlotType: (typeList: TypeDefinition[], typeName: string) => TypeDefinition;
/**
 * Add the given value to the type
 * @param type - the slot type to add the value to
 * @param id - the id of the entity
 * @param value - the value of the entity
 * @param synonyms - the synonyms to use for the entity
 */
export declare const addValueToType: (type: TypeDefinition, id: string, value: string, synonyms: string[]) => void;
/**
 * Reads the types.yaml file and returns a promise that resolves to the list of types
 * @param locale - the locale of the language model
 * @return {Promise.<Array>} the type list
 */
export declare const readTypesFromYAML: (locale: any) => Promise<TypeDefinition[]>;
