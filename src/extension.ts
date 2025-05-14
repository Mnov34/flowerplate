import { commands, ExtensionContext, window } from "vscode";
import { FlowerPlateProvider } from "./provider/FlowerPlateProvider";
import { Template } from "./util/types";

export function activate(context: ExtensionContext) {
    const provider = new FlowerPlateProvider(context);

    context.subscriptions.push(
        window.registerTreeDataProvider('flowerplate.templates.provider', provider),
        commands.registerCommand('flowerplate.templates.insert', insertTemplate),
        window.onDidChangeActiveTextEditor(() => provider.refresh())
    );
}

async function insertTemplate(template: Template) {
    const editor = window.activeTextEditor;

    // eslint-disable-next-line curly
    if (!editor) return;

    const code = template.code.join("\n");
    await editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, code);
    });

}

export function deactivate() { }
