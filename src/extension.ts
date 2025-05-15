import { commands, ExtensionContext, window } from "vscode";
import { FlowerPlateProvider } from "./provider/FlowerPlateProvider";
import { insertTemplate } from "./commands/InsertTemplateCommand";
import { openSettings } from "./commands/OpenSettingsCommand";

export function activate(context: ExtensionContext) {
    const provider = new FlowerPlateProvider(context);

    context.subscriptions.push(
        window.registerTreeDataProvider('flowerplate.templates.provider', provider),
        commands.registerCommand('flowerplate.settings.open', openSettings),
        commands.registerCommand('flowerplate.templates.insert', insertTemplate),
        window.onDidChangeActiveTextEditor(() => provider.refresh())
    );
}

export function deactivate() { }