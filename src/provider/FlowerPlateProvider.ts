import { EventEmitter, TreeDataProvider, TreeItem, window } from "vscode";

export class FlowerPlateProvider implements TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData = new EventEmitter<TreeItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: TreeItem): TreeItem {
        return element;
    }

    async getChildren(element?: TreeItem): Promise<TreeItem[]> {
        const editor = window.activeTextEditor;

        if (!editor) { return [new TreeItem('No file opened')]; };
        if (editor.document.languageId !== 'python') { return [new TreeItem('Flowerplate only supports python for now.')]; };

        return this.getTemplateItems();
    }

    private async getTemplateItems(): Promise<TreeItem[]> {
        try {
            const items: TreeItem[] = []

            if (items.length === 0) { return [new TreeItem('No template available')]; };

            return items;
        } catch (error) {
            return [new TreeItem('Templates failed to load')];
        }
    }
}