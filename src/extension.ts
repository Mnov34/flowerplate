import { ExtensionContext, window } from "vscode";
import { FlowerPlateProvider } from "./provider/FlowerPlateProvider";

export function activate(context: ExtensionContext) {
    const provider = new FlowerPlateProvider();

    window.registerTreeDataProvider('flowerplate.templates', provider);

    window.onDidChangeActiveTextEditor(() => provider.refresh());
}

export function deactivate() {}
