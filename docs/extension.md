# `extension.md`

## Overview

This is the entry point of the Flowerplate VSCode extension. It:

- Registers the **Tree Data Provider** for the sidebar view.
- Hooks up the **Insert Template** command.
- Listens for active editor changes to refresh the template list.

---

### `activate(context: ExtensionContext)`

1. **Instantiate** `FlowerPlateProvider` with the extension context.  
2. **Register**  
   - Tree Data Provider under ID `flowerplate.templates`.  
   - Command `flowerplate.insertTemplate` (bound to `insertTemplate` function).  
   - Listener for `onDidChangeActiveTextEditor` → triggers provider refresh.  
3. **Dispose** registrations automatically when the extension is deactivated.

```ts
export function activate(context: ExtensionContext) {
    const provider = new FlowerPlateProvider(context);

    context.subscriptions.push(
        window.registerTreeDataProvider('flowerplate.templates', provider),
        commands.registerCommand('flowerplate.insertTemplate', insertTemplate),
        window.onDidChangeActiveTextEditor(() => provider.refresh())
    );
}
```

---

### `insertTemplate(template: Template)`

- Fetches the active text editor.

- Concatenates the array of code lines into a single string.

- Inserts the code at the current cursor position.

```ts
async function insertTemplate(template: Template) {
    const editor = window.activeTextEditor;
    if (!editor) return;

    const code = template.code.join("\n");
    await editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, code);
    });
}
```

---

### `deactivate()`

- Currently a no-op. Provided for future cleanup (timers, disposables, etc.).

```ts
export function deactivate() { }
```
