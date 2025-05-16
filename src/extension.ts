import { commands, ExtensionContext, window } from "vscode";
import { FlowerPlateProvider } from "./provider/FlowerPlateProvider";
import { insertTemplate } from "./commands/InsertTemplateCommand";
import { openSettings } from "./commands/OpenSettingsCommand";
import { TemplateManager } from "./util/TemplateManager";

export function activate(context: ExtensionContext) {
    const templateManager = TemplateManager.getInstance(context);
    const provider = FlowerPlateProvider.getInstance(context);

    context.subscriptions.push(
        window.registerTreeDataProvider('flowerplate.templates.provider', provider),
        commands.registerCommand('flowerplate.settings.open', openSettings),
        commands.registerCommand('flowerplate.templates.insert', insertTemplate),
        window.onDidChangeActiveTextEditor(() => provider.refresh())
    );
}

export function deactivate() { }
