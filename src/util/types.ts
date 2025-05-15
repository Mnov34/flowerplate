export interface Template {
    name: string;
    imports: string[];
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