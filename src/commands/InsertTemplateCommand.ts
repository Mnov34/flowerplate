import { commands, Position, Selection, TextEditor, window } from 'vscode';
import { Template } from '../util/types';
import { UserConfiguration } from '../util/UserConfiguration';

export async function insertTemplate(template: Template) {
    const config: UserConfiguration = UserConfiguration.getInstance();
    const editor: TextEditor | undefined = window.activeTextEditor;

    if (!editor) { return; }

    const enableImports: boolean = config.shouldInsertImports;
    const imports: string[] = template.imports || [];
    const codeLines: string[] = [
        ...(enableImports ? imports : []),
        ...template.code
    ];

    const code: string = codeLines.join('\n');
    const selection: Selection = editor.selection;

    await editor.edit(editBuilder => {
        editBuilder.insert(selection.active, code);
    });

    if (config.shouldPreserveSelection) {
        const newPosition: Position = selection.active.translate(0, code.length);
        editor.selection = new Selection(newPosition, newPosition);
    }

    if (config.shouldAutoformat) {
        await commands.executeCommand('editor.action.formatSelection');
    }
}