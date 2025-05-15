import { commands } from "vscode";

export async function openSettings() {
    return commands.executeCommand(
        'workbench.action.openSettings',
        '@ext:DevGarden.flowerplate'
    );
}
