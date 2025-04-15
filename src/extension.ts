import * as vscode from 'vscode';
import { WebviewFlowerPlate } from './html/webview';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push( //TODO: refactor this shit in another func mb register directory 
        vscode.commands.registerCommand('ShowTemplate', () => {
            // creation webview panel
            const panel = vscode.window.createWebviewPanel(
                'floweplate',
                "FlowerPlate",
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src')]
                }
            );

            // add html to panel.webview
            panel.webview.html = WebviewFlowerPlate.buildHtmlExample(
                panel.webview,
                context.extensionUri
            );
        })
    );
}

export function deactivate() {}
