"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode2 = __toESM(require("vscode"));

// src/provider/webviewViewProvider.ts
var vscode = __toESM(require("vscode"));
var WebviewViewProvider = class {
  constructor(context) {
    this.context = context;
  }
  resolveWebviewView(webviewView, context, _token) {
    webviewView.webview.options = {
      enableScripts: true
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
};

// src/extension.ts
function activate(context) {
  const leftPanelWebViewProvider = new WebviewViewProvider(context);
  let view = vscode2.window.registerWebviewViewProvider(
    "test",
    leftPanelWebViewProvider
  );
  const disposable = vscode2.commands.registerCommand("flowerplate.helloWorld", () => {
    vscode2.window.showInformationMessage("Flowerplate initialized");
  });
  context.subscriptions.push(disposable);
  context.subscriptions.push(view);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
