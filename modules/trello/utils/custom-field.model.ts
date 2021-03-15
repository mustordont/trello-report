export type CustomFieldType = 'number'|'text'|'list';

export interface ICustomFieldListOption {
    id: string;
    value: {
        text: string;
    }
}

export interface ICustomFieldDefinition {
    id: string;
    name: string;
    type: CustomFieldType;
    options?: ICustomFieldListOption[];
}

export interface ICustomFieldValue {
    idCustomField: string;
    value?: any;
    idValue?: string;
    type: CustomFieldType;
}

export interface ICustomField {
    name: string;
    value: any;
    type: CustomFieldType;
    id: string;
}

export class CustomFieldModel implements ICustomFieldDefinition, Partial<ICustomFieldValue> {
    public static DEFINITION: ICustomFieldDefinition[] = [];

    public readonly id: string;
    public readonly name: string;
    public readonly type: CustomFieldType;
    public readonly value: any;
    constructor(value: ICustomFieldValue) {
        const {id, name, type, options} = CustomFieldModel.DEFINITION.find(i => i.id === value.idCustomField);
        this.id = id;
        this.name = name;
        this.type = type;

        switch(type) {
            case 'number':
                this.value = value.value.number;
                break;
            case 'text':
                this.value = value.value.text;
                break;
            case 'list':
                this.value = options.find(i => i.id === value.idValue)?.value.text;
        }
    }

    serialize(): ICustomField {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            value: this.value,
        };
    }

    toString(): string {
        return `${this.name}: ${this.value}`;
    }
}
