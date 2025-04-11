// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { webviewViewProvider } from './provider/webviewViewProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage('Flowerplate correctly initialized');
	const leftPanelWebViewProvider = new webviewViewProvider();

	let view = vscode.window.registerWebviewViewProvider(
		"test",
		leftPanelWebViewProvider
	);
	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('flowerplate.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Flowerplate initialized');
	}); 

	context.subscriptions.push(disposable);
	context.subscriptions.push(view);
}

// This method is called when your extension is deactivated
export function deactivate() {}
