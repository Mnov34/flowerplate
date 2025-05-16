import { commands, Position, Selection, TextEditor, window } from 'vscode';
import { Template } from '../util/types';
import { UserConfiguration } from '../util/UserConfiguration';

export async function insertTemplate(template: Template) {
    const config: UserConfiguration = UserConfiguration.getInstance();
    const editor: TextEditor | undefined = window.activeTextEditor;

    if (!editor) { return; }

    const enableImports: boolean = config.shouldInsertImports;

    const code: string = template.code.join('\n');
    const selection: Selection = editor.selection;

    await editor.edit(editBuilder => {
        editBuilder.insert(selection.active, code);
    });

    const splitImports: string[] = template.imports || [];
    if (enableImports && splitImports.length > 0 &&
        !(splitImports.length === 1 && splitImports[0] === "")) {
            const imports: string = splitImports.join('\n') + '\n';

            await editor.edit(editBuilder => {
                editBuilder.insert(
                    new Position(0, 0),
                    imports
                );
            });
    }

    if (config.shouldPreserveSelection) {
        const newPosition: Position = selection.active.translate(0, code.length);
        editor.selection = new Selection(newPosition, newPosition);
    }

    if (config.shouldAutoformat) {
        await commands.executeCommand('editor.action.formatSelection');
    }
}
