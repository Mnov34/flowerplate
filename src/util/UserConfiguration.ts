import { EventEmitter, workspace, WorkspaceConfiguration } from "vscode";

export class UserConfiguration {
    private static instance: UserConfiguration;
    private config: WorkspaceConfiguration;
    private _onDidChange = new EventEmitter<void>();
    readonly onDidChange = this._onDidChange.event;

    private constructor() {
        this.config = workspace.getConfiguration('flowerplate');

        workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('flowerplate')) {
                this.config = workspace.getConfiguration('flowerplate');
                this._onDidChange.fire();
            }
        });
    }

    static getInstance(): UserConfiguration {
        if (!UserConfiguration.instance) { UserConfiguration.instance = new UserConfiguration(); }

        return UserConfiguration.instance;
    }

    get previewLines(): number {
        return this.config.get<number>('templates.tooltip.previewLines') ?? 5;
    }

    get customPaths(): string[] {
        return this.config.get<string[]>('templates.customPaths') ?? [];
    }

    get shouldAutoformat(): boolean {
        return this.config.get<boolean>('insert.autoformat') ?? false;
    }

    get shouldPreserveSelection(): boolean {
        return this.config.get<boolean>('insert.preserveSelection') ?? false;
    }

    get shouldSetVariables(): boolean {
        return this.config.get<boolean>('insert.setVariables') ?? true;
    }

    get shouldInsertImports(): boolean {
        return this.config.get<boolean>('insert.imports') ?? true;
    }

    get isDragAndDropEnabled(): boolean {
        return this.config.get<boolean>('dragAndDrop.enabled') ?? true;
    }

    get isSearchEnabled(): boolean {
        return this.config.get<boolean>('search.enabled') ?? true;
    }

    get searchPlaceholder(): string {
        return this.config.get<string>('search.placeHolder') ?? 'Filter templates...';
    }

}