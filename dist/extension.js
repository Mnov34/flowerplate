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
var import_vscode4 = require("vscode");

// src/provider/FlowerPlateProvider.ts
var import_vscode2 = require("vscode");

// src/util/TemplateManager.ts
var import_vscode = require("vscode");
var path = require("path");
var TemplateManager = class {
  cache = /* @__PURE__ */ new Map();
  templateRoot;
  constructor(context) {
    this.templateRoot = path.join(__dirname, "..", "resources", "templates");
  }
  async getTemplates(language) {
    if (this.cache.has(language)) {
      return this.cache.get(language);
    }
    try {
      const templates = await this.loadLocalTemplates(language);
      this.cache.set(language, templates);
      return templates;
    } catch (error) {
      import_vscode.window.showErrorMessage(`Failed to load templates: ${error}`);
      return [];
    }
  }
  async loadLocalTemplates(language) {
    const templateDir = path.join(this.templateRoot, language);
    const templateFiles = await import_vscode.workspace.fs.readDirectory(import_vscode.Uri.file(templateDir));
    const templates = [];
    for (const [file] of templateFiles.filter((f) => f[0].endsWith(".json"))) {
      try {
        const template = await this.loadTemplateFile(path.join(templateDir, file));
        templates.push({
          ...template,
          filename: file
        });
      } catch (error) {
        console.error(`Error loading ${file}:`, error);
      }
    }
    return templates;
  }
  async loadTemplateFile(filePath) {
    const data = await import_vscode.workspace.fs.readFile(import_vscode.Uri.file(filePath));
    const template = JSON.parse(Buffer.from(data).toString());
    if (!template.name || !template.code || !template.language) {
      throw new Error("Invalid template format");
    }
    return {
      ...template,
      code: this.normalizeCode(template.code)
    };
  }
  async updateTemplate(language, filename, newCode) {
    const filePath = path.join(this.templateRoot, language, filename);
    const fileUri = import_vscode.Uri.file(filePath);
    try {
      const data = await import_vscode.workspace.fs.readFile(fileUri);
      const parsed = JSON.parse(Buffer.from(data).toString());
      const updated = {
        ...parsed,
        code: newCode
      };
      const json = JSON.stringify(updated, null, 2);
      await import_vscode.workspace.fs.writeFile(fileUri, Buffer.from(json, "utf8"));
      import_vscode.window.showInformationMessage(`Template "${updated.name}" saved to ${filename}.`);
      this.clearCache(language);
    } catch (err) {
      import_vscode.window.showErrorMessage(`Failed to save template: ${err}`);
      throw err;
    }
  }
  normalizeCode(code) {
    return Array.isArray(code) ? code : code.split("\n");
  }
  clearCache(language) {
    this.cache.delete(language);
  }
};

// src/provider/FlowerPlateProvider.ts
var FlowerPlateProvider = class {
  templateManager;
  _onDidChangeTreeData = new import_vscode2.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  constructor(context) {
    this.templateManager = new TemplateManager(context);
  }
  refresh() {
    this._onDidChangeTreeData.fire(void 0);
  }
  getTreeItem(element) {
    return element;
  }
  async getChildren() {
    const editor = import_vscode2.window.activeTextEditor;
    if (!editor) {
      return [this.createStatusItem("No file opened")];
    }
    ;
    if (editor.document.languageId !== "python") {
      return [this.createStatusItem("Flowerplate only supports python for now.")];
    }
    ;
    try {
      const templates = await this.templateManager.getTemplates("python");
      if (templates?.length === 0) {
        return [this.createStatusItem("No templates available")];
      }
      if (templates === void 0) {
        throw new Error("Templates is undefined");
      }
      return templates.map((template) => this.createTemplateItem(template));
    } catch (error) {
      return [this.createStatusItem("Template failed to load")];
    }
  }
  async getTemplateItems() {
    try {
      const items = [];
      if (items.length === 0) {
        return [new import_vscode2.TreeItem("No template available")];
      }
      ;
      return items;
    } catch (error) {
      return [new import_vscode2.TreeItem("Templates failed to load")];
    }
  }
  createStatusItem(message) {
    const item = new import_vscode2.TreeItem(message);
    item.iconPath = new import_vscode2.ThemeIcon("warning");
    return item;
  }
  createTemplateItem(template) {
    const item = new import_vscode2.TreeItem(template.name);
    item.description = template.tags?.join(", ");
    item.tooltip = this.createTooltip(template);
    item.command = {
      command: "flowerplate.insertTemplate",
      title: "Insert template",
      arguments: [template]
    };
    item.contextValue = "flowerplateTemplate";
    item.template = template;
    return item;
  }
  createTooltip(template) {
    return [
      `**${template.name}**`,
      ...template.code.slice(0, 5),
      template.code.length > 5 ? `...(+${template.code.length - 5} lines)` : ""
    ].join("\n");
  }
};

// src/provider/EditorScraper.ts
var import_vscode3 = require("vscode");
var EditorScraper = class {
  static context;
  constructor() {
  }
  static ScrapOnView(document) {
    if (!document) {
      import_vscode3.window.showErrorMessage("No document provided");
      return [];
    }
    const lines = document.getText().split("\n");
    return lines;
  }
};

// src/extension.ts
function activate(context) {
  import_vscode4.window.showInformationMessage("activeted");
  const provider = new FlowerPlateProvider(context);
  const manager = new TemplateManager(context);
  const disable = import_vscode4.commands.registerCommand("flowerplate.template.update", (treeItem) => {
    const template = treeItem.template;
    const editor = import_vscode4.window.activeTextEditor;
    const code = EditorScraper.ScrapOnView(editor?.document);
    manager.updateTemplate(template.language, template.filename, code);
    provider.refresh();
    import_vscode4.window.showInformationMessage("Template updated!");
  });
  context.subscriptions.push(
    import_vscode4.window.registerTreeDataProvider("flowerplate.templates", provider),
    import_vscode4.commands.registerCommand("flowerplate.insertTemplate", insertTemplate),
    import_vscode4.window.onDidChangeActiveTextEditor(() => provider.refresh()),
    //refresh provider on changes in active text editor
    import_vscode4.workspace.onDidChangeTextDocument((editor) => {
      EditorScraper.ScrapOnView(editor.document);
      import_vscode4.window.showInformationMessage("Save changes?");
    }),
    disable
  );
}
async function insertTemplate(template) {
  const editor = import_vscode4.window.activeTextEditor;
  if (!editor) return;
  const manager = new TemplateManager({ extensionPath: __dirname });
  const templates = await manager.getTemplates(template.language);
  const matchingTemplate = templates?.find((t) => t.name === template.name);
  if (!matchingTemplate) {
    import_vscode4.window.showErrorMessage("Template not found after update.");
    return;
  }
  const code = matchingTemplate.code.join("\n");
  await editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, code);
  });
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
