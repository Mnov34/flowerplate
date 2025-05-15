# `FlowerPlateProvider.md`

## Responsibility

`FlowerPlateProvider` implements `TreeDataProvider<TreeItem>`, powering the “Templates” tree view:

- Shows **status messages** (no file, unsupported file, errors).  
- Lists available **template items** (name, tags, preview).

---

### Constructor

```ts
constructor(context: ExtensionContext) {
    this.templateManager = new TemplateManager(context);
}
```

Initializes a `TemplateManager` instance to load and cache templates.

---

### `Events & Refresh`

- onDidChangeTreeData (exposed) fires when the view must refresh.

- refresh() manually triggers the event, invoked on editor change.

```ts
refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
}
```

---

### `getChildren()`

Determines which tree items to show:

1. No open editor → No file opened

2. Non-Python file → Flowerplate only supports python for now.

3. Load templates via TemplateManager.getTemplates('python')

    - Empty array → No templates available

    - Error/undefined → Template failed to load

    - Populated → map each to a TreeItem

```ts
async getChildren(): Promise<TreeItem[]> {
    const editor = window.activeTextEditor;
    if (!editor) return [this.createStatusItem('No file opened')];
    if (editor.document.languageId !== 'python')
        return [this.createStatusItem('Flowerplate only supports python for now.')];

    try {
        const templates = await this.templateManager.getTemplates('python');
        if (!templates || templates.length === 0)
            return [this.createStatusItem('No templates available')];
        return templates.map(t => this.createTemplateItem(t));
    } catch {
        return [this.createStatusItem('Template failed to load')];
    }
}
```

---

### Helper Methods

- `createStatusItem(message: string): TreeItem`
    Creates a warning‐icon item for status messages.

- `createTemplateItem(template: Template): TreeItem`

    - Label: template.name

    - Description: comma‐joined template.tags

    - Tooltip: first few lines of code

    - Command: calls flowerplate.insertTemplate with the template

- `createTooltip(template: Template): string`
    Builds a markdown‐style preview of the template code.
