import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
/**
 * class that provide template for FlowerPlate
 */
export class WebviewFlowerPlate {
    //function to relete all css with html tempalte 
    //TODO: make functions for build view(class,enums etc..)
    static buildHtmlExample(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        const htmlPath = path.join(extensionUri.fsPath, 'src', 'html', 'html-view', 'def-view.html');
        let html = fs.readFileSync(htmlPath, 'utf8');
        const cssFiles = [
            'default-def-syntax-style.css',
            'default-syntax-style.css',
            'template-background.css'
        ];
        let styleLinks = cssFiles.map(fileName => {
                const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(  extensionUri,'src', 'html', 'css-view',fileName));
                return `<link rel="stylesheet" href="${cssUri}">`;
            }).join('\n');
        html = html.replace('{{styleLinks}}', styleLinks);
        return html;
    }
    
}
