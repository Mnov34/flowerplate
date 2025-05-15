import { commands, ExtensionContext, OpenDialogOptions, TextEdit, TreeItem, window, workspace } from "vscode";
import { FlowerPlateProvider } from "./provider/FlowerPlateProvider";
import { Template } from "./util/types";
import { EditorScraper } from "./provider/EditorScraper";
import { TemplateManager } from "./util/TemplateManager";
import path from "path";
import { workerData } from "worker_threads";

export function activate(context: ExtensionContext) {
    window.showInformationMessage("activeted");
    const provider = new FlowerPlateProvider(context);
    const manager = new TemplateManager(context);

    const disable = commands.registerCommand("flowerplate.template.update", (treeItem: TreeItem) => {
        const template = (treeItem as any).template as Template;
        const editor = window.activeTextEditor;
        const code = EditorScraper.ScrapOnView(editor?.document);
        manager.updateTemplate(template.language, template.filename, code);
        provider.refresh();
        window.showInformationMessage('Template updated!');
    })


    context.subscriptions.push(
        window.registerTreeDataProvider('flowerplate.templates', provider),
        commands.registerCommand('flowerplate.insertTemplate', insertTemplate),
        window.onDidChangeActiveTextEditor(() => provider.refresh()), //refresh provider on changes in active text editor

        workspace.onDidChangeTextDocument(editor => {
            EditorScraper.ScrapOnView(editor.document);
            window.showInformationMessage("Save changes?");
        }),
        disable,

    );
}

async function insertTemplate(template: Template) {
    const editor = window.activeTextEditor;
    if (!editor) return;

    const manager = new TemplateManager({ extensionPath: __dirname } as ExtensionContext);

    const templates = await manager.getTemplates(template.language);
    const matchingTemplate = templates?.find(t => t.name === template.name);

    if (!matchingTemplate) {
        window.showErrorMessage("Template not found after update.");
        return;
    }

    const code = matchingTemplate.code.join("\n");
    await editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, code);
    });
}

export function deactivate() { }
