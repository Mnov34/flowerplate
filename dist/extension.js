"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var import_vscode2 = require("vscode");

// src/provider/FlowerPlateProvider.ts
var import_vscode = require("vscode");
var FlowerPlateProvider = class {
  _onDidChangeTreeData = new import_vscode.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  constructor() {
  }
  refresh() {
    this._onDidChangeTreeData.fire(void 0);
  }
  getTreeItem(element) {
    return element;
  }
  async getChildren(element) {
    const editor = import_vscode.window.activeTextEditor;
    if (!editor) {
      return [new import_vscode.TreeItem("No file opened")];
    }
    ;
    if (editor.document.languageId !== "python") {
      return [new import_vscode.TreeItem("Flowerplate only supports python for now.")];
    }
    ;
    return this.getTemplateItems();
  }
  async getTemplateItems() {
    try {
      const items = [];
      if (items.length === 0) {
        return [new import_vscode.TreeItem("No template available")];
      }
      ;
      return items;
    } catch (error) {
      return [new import_vscode.TreeItem("Templates failed to load")];
    }
  }
};

// src/extension.ts
function activate(context) {
  const provider = new FlowerPlateProvider();
  import_vscode2.window.registerTreeDataProvider("flowerplate.templates", provider);
  import_vscode2.window.onDidChangeActiveTextEditor(() => provider.refresh());
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
