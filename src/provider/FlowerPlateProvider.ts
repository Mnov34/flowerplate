import { EventEmitter, ExtensionContext, ThemeIcon, TreeDataProvider, TreeItem, window } from "vscode";
import { TemplateManager } from "../util/TemplateManager";
import { Template } from '../util/types';

export class FlowerPlateProvider implements TreeDataProvider<TreeItem> {
    private templateManager: TemplateManager;
    private _onDidChangeTreeData = new EventEmitter<TreeItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(context: ExtensionContext) {
        this.templateManager = new TemplateManager(context);
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

    private async getTemplateItems(): Promise<TreeItem[]> {
        try {
            const items: TreeItem[] = [];

            if (items.length === 0) { return [new TreeItem('No template available')]; };

            return items;
        } catch (error) {
            return [new TreeItem('Templates failed to load')];
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

    private createTooltip(template: Template): string {
        return [
            `**${template.name}**`,
            ...template.code.slice(0, 5),
            template.code.length > 5 ? `...(+${template.code.length - 5} lines)` : ''
        ].join('\n');
    }
}