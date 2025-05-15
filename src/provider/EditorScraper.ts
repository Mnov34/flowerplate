import { TextDocument, TextEditor, window } from "vscode";

export class EditorScraper {
  static context: TextDocument | undefined;

  constructor() {}

  public static ScrapOnView(document:TextDocument|undefined): string[] {
    if (!document) {
      window.showErrorMessage("No document provided")
      return [];
    }
    const lines = document.getText().split('\n');
    return lines
  }
}