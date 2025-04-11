// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WebviewViewProvider } from './provider/webviewViewProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const leftPanelWebViewProvider = new WebviewViewProvider(context);

	let view = vscode.window.registerWebviewViewProvider(
		"test",
		leftPanelWebViewProvider
	);
	
	const disposable = vscode.commands.registerCommand('flowerplate.helloWorld', () => {
		vscode.window.showInformationMessage('Flowerplate initialized');
	}); 

	context.subscriptions.push(disposable);
	context.subscriptions.push(view);
}

// This method is called when your extension is deactivated
export function deactivate() {}
