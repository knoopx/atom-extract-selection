'use babel'

import { CompositeDisposable } from 'atom'

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'extract-selection:extract-selection': this.extractSelection,
      }),
    )
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  extractSelection() {
    const editor = atom.workspace.getActiveTextEditor()
    if (editor) {
      let selection = editor.getSelectedText()
      let grammar = editor.getGrammar()

      if (selection && selection.length) {
        editor.delete()

        atom.workspace
          .open()
          .then((pane) => {
            let newEditor = atom.workspace.getActiveTextEditor()
            if (grammar !== null && grammar.name) {
              newEditor.setGrammar(grammar)
            }
            pane.insertText(selection, { select: false, autoIndent: true })
            pane.moveToTop()
          })
          .catch((error) => {
            atom.notifications.addError(error, { dismissable: true })
            atom.beep()
          })
      } else {
        atom.notifications.addWarning('No text selected to open in new tab.', {
          dismissable: true,
        })
        atom.beep()
      }
    }
  },
}
