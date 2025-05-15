export interface Template {
    name: string;
    filename: string;
    code: string[];
    language: string;
    tags?: string[];
    variables?: Record<string, TemplateVariable>;
}

export interface TemplateVariable {
    default: any;
    type: 'string' | 'number' | 'boolean';
    description?: string;   
}


interface IVariable {
    name: string;
    type?: string;
    value?: string;
    scope: 'local' | 'global' | 'class' | 'parameter';
    location?: { line: number; column: number };
}

interface IDef {
    name: string;
    parameters: string[];
    returnType?: string;
    isAsync?: boolean;
    body?: string;
    location?: { line: number; column: number };
}

interface IClass {
    name: string;
    superClass?: string; // Inherited class (if any)
    methods: IDef[];
    properties: IVariable[];
    location?: { line: number; column: number };
}