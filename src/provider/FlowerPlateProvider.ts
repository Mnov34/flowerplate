import { EventEmitter, ExtensionContext, MarkdownString, ThemeIcon, TreeDataProvider, TreeItem, window } from "vscode";
import { TemplateManager } from "../util/TemplateManager";
import { Template } from '../util/types';
import { UserConfiguration } from '../util/UserConfiguration';

export class FlowerPlateProvider implements TreeDataProvider<TreeItem> {
    private static _instance: FlowerPlateProvider;
    private config: UserConfiguration = UserConfiguration.getInstance();
    private templateManager: TemplateManager = TemplateManager.getInstance();
    private _onDidChangeTreeData = new EventEmitter<TreeItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private constructor(context: ExtensionContext) {
        this.config.onDidChange(() => this.refresh());
    }

    public static getInstance(context?: ExtensionContext) {
        if (!FlowerPlateProvider._instance) {
            if (!context) {
                throw new Error('FlowerPlateProvider must be initialized with ExtensionContext first');
            }
            FlowerPlateProvider._instance = new FlowerPlateProvider(context);
        }
        return FlowerPlateProvider._instance;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: TreeItem): TreeItem {
        return element;
    }

    async getChildren(): Promise<TreeItem[]> {
        const editor = window.activeTextEditor;

        if (!editor) { return [this.createStatusItem('No file opened')]; };
        if (editor.document.languageId !== 'python') { return [this.createStatusItem('Flowerplate only supports python for now.')]; };

        try {
            const templates = await this.templateManager.getTemplates('python');

            if (templates?.length === 0) { return [this.createStatusItem('No templates available')]; }
            if (templates === undefined) { throw new Error('Templates is undefined'); }


            return templates.map(template => this.createTemplateItem(template));
        } catch (error) {
            return [this.createStatusItem('Template failed to load')];
        }
    }

    private createStatusItem(message: string): TreeItem {
        const item = new TreeItem(message);
        item.iconPath = new ThemeIcon('warning');
        return item;
    }

    private createTemplateItem(template: Template): TreeItem {
        const item = new TreeItem(template.name);

        item.description = template.tags?.join(', ');
        item.tooltip = this.createTooltip(template);
        item.command = {
            command: 'flowerplate.templates.insert',
            title: 'Insert template',
            arguments: [template]
        };

        return item;
    }

    private createTooltip(template: Template): MarkdownString {
        const previewLines = this.config.previewLines;
        const importsEnabled = this.config.shouldInsertImports;
        const mdString = new MarkdownString(undefined, true);
        const codePreview = template.code.slice(0, previewLines).join('\n');
        const codeImports = template.imports.join('\n');

        mdString.appendMarkdown(`**${template.name}**`);
        mdString.appendMarkdown('\n\n---\n\n');

        if (importsEnabled && template.imports.length >= 1) {
            mdString.appendCodeblock(codeImports, template.language);
        }

        mdString.appendMarkdown('\n');
        mdString.appendCodeblock(codePreview, template.language);

        if (template.code.length > previewLines) {
            const remaining = template.code.length - previewLines;
            mdString.appendMarkdown(`\n*...(+${remaining} ${remaining === 1 ? 'line' : 'lines'})*`);
        }

        mdString.appendMarkdown('\n\n---\n');
        mdString.appendMarkdown(`**Language**: ${template.language}  \n`);

        if (template.tags?.length) {
            mdString.appendMarkdown(`**Tags**: ${template.tags.join(', ')}  \n`);
        }
        if (template.variables) {
            mdString.appendMarkdown(`**Variables**: ${Object.keys(template.variables).join(', ')}`);
        }

        return mdString;
    }
}
