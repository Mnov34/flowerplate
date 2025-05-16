import { ExtensionContext, Uri, window, workspace } from 'vscode';
import { Template } from './types';
import path = require('path');

export class TemplateManager {
    private static _instance: TemplateManager;
    private cache = new Map<string, Template[]>();
    private templateRoot: string;

    private constructor(context: ExtensionContext) {
        this.templateRoot = path.join(context.extensionPath, 'src', 'templates');
    }

    public static getInstance(context?: ExtensionContext) {
        if (!TemplateManager._instance) {
            if (!context) {
                throw new Error('TemplateManager must be initialized with ExtensionContext first');
            }
            TemplateManager._instance = new TemplateManager(context);
        }
        return TemplateManager._instance;
    }

    async getTemplates(language: string) {
        if (this.cache.has(language)) { return this.cache.get(language); }

        try {
            const templates = await this.loadLocalTemplates(language);

            this.cache.set(language, templates);

            return templates;
        } catch (error) {
            window.showErrorMessage(`Failed to load templates: ${error}`);

            return [];
        }
    }

    private async loadLocalTemplates(language: string): Promise<Template[]> {
        const templateDir = path.join(this.templateRoot, language);
        const templateFiles = await workspace.fs.readDirectory(Uri.file(templateDir));
        const templates: Template[] = [];

        for (const [file] of templateFiles.filter(f => f[0].endsWith('.json'))) {
            try {
                const template = await this.loadTemplateFile(path.join(templateDir, file));
                templates.push(template);
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        }

        return templates;
    }

    private async loadTemplateFile(filePath: string): Promise<Template> {
        const data = await workspace.fs.readFile(Uri.file(filePath));
        const template = JSON.parse(Buffer.from(data).toString()) as Template;

        if (!template.name || !template.code || !template.language) {
            throw new Error('Invalid template format');
        }

        return {
            ...template,
            sourcePath: filePath,
            imports: this.normalizeCode(template.imports || []),
            code: this.normalizeCode(template.code)
        };
    }

    private normalizeCode(code: string | string[]): string[] {
        return Array.isArray(code) ? code : code.split('\n');
    }
}
