import * as vscode from 'vscode';

export class WebviewViewProvider implements vscode.WebviewViewProvider {
    constructor(private context: vscode.ExtensionContext) {}

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
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
                <body>
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