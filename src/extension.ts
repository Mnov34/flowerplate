import * as vscode from 'vscode';
import { WebviewViewProvider } from './provider/webviewViewProvider';

export function activate(context: vscode.ExtensionContext) {
    const leftPanelWebViewProvider = new WebviewViewProvider(context);
    let view = vscode.window.registerWebviewViewProvider(
        "flowerplate",
        leftPanelWebViewProvider
    );
    const disposable = vscode.commands.registerCommand('flowerplate.helloWorld', () => {
        vscode.window.showInformationMessage('Flowerplate initialized');
    }); 
    context.subscriptions.push(view,disposable);
}
export function deactivate() {}
