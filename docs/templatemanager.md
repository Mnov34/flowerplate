# `TemplateManager.md`

## Responsibility

Loads, caches, and returns templates from the extension’s bundled JSON files:

- **Caching** per language  
- **Filesystem** reading under `src/templates/<language>`  
- **Error handling** with `window.showErrorMessage`

---

### Constructor

```ts
constructor(context: ExtensionContext) {
    this.templateRoot = path.join(context.extensionPath, 'src', 'templates');
}
```
- Sets the root folder for language‐specific template directories.

---

`getTemplates(language: string): Promise<Template[]>`

1. Cache check → return cached array if present.

2. Load via loadLocalTemplates(language)

3. Cache and return the result.

4. On failure, show error and return empty list.

---

`loadLocalTemplates(language: string): Promise<Template[]>`

- Reads directory entries under <templateRoot>/<language>.

- Filters for .json files.

- For each file: calls loadTemplateFile, logs errors, accumulates results.

---

`loadTemplateFile(filePath: string): Promise<Template>`

- Reads file contents as UTF-8.

- Parses JSON into a Template.

- Validates presence of name, code, and language.

- Normalizes code to string[].
```ts
private normalizeCode(code: string | string[]): string[] {
    return Array.isArray(code) ? code : code.split('\n');
}
```
