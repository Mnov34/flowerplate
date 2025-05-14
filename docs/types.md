
# `types.md`

## `Template`

Describes a single boilerplate template.

| Property   | Type                         | Description                          |
| ---------- | ---------------------------- | ------------------------------------ |
| `name`     | `string`                     | Human‐readable template identifier   |
| `code`     | `string[]`                   | Lines of code to insert              |
| `language` | `string`                     | File language (e.g. `"python"`)      |
| `tags?`    | `string[]`                   | Optional keywords for searching      |
| `variables?` | `Record<string, TemplateVariable>` | Optional parameters for templating |

---

## `TemplateVariable`

Defines a variable placeholder inside a template.

| Property      | Type                        | Description                                         |
| ------------- | --------------------------- | --------------------------------------------------- |
| `default`     | `any`                       | Default value used if none provided                 |
| `type`        | `"string" | "number" | "boolean"` | Data type of the variable                        |
| `description?` | `string`                    | (Optional) human‐friendly description of variable   |
