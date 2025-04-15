import * as vscode from 'vscode';
/**
 *  WebviewViewProvider class implement interface WebviewViewProvider from vscode module
 * 		 * @param webviewView Webview view to restore. The provider should take ownership of this view. The
        *    provider must set the webview's `.html` and hook up all webview events it is interested in.
        * @param context Additional metadata about the view being resolved.
        * @param token Cancellation token indicating that the view being provided is no longer needed.
 */
export class WebviewViewProvider implements vscode.WebviewViewProvider {
    constructor(private context: vscode.ExtensionContext) { }
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) 
    {
        webviewView.webview.options = {
            enableScripts: true,
        };
        webviewView.webview.html = this.getWebviewContent();
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case "showMessage":
                    vscode.window.showInformationMessage(message.text);
                    break;
            }
        });
    }
    getWebviewContent() {
        return `
                <!DOCTYPE html>
                <html>
                <body 
                >
                    <h1>Hello from Side Panel!</h1>
                    <button onclick="sendMessage()">Send Message</button>
                    <script>
                        const vscode = acquireVsCodeApi();
                        function sendMessage() {
                            vscode.postMessage({
                                command: 'showMessage',
                                text: 'Hello from Webview!'
                            });
                        }
                    </script>
                </body>
                </html>
            `;
    }
}