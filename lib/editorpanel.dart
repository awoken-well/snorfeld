import 'package:flutter/material.dart';
import 'package:code_text_field/code_text_field.dart';
// Import the language & theme
import 'package:highlight/languages/markdown.dart';
import 'package:flutter_highlight/themes/monokai-sublime.dart';
import 'package:provider/provider.dart';

import 'watcher.dart';

class CodeEditorState extends ChangeNotifier {
  CodeController codeController = CodeController(
    text: "void main() {\n    print(\"Hello, world!\");\n}",
    language: markdown,
    theme: monokaiSublimeTheme,
  );

  Fragment fragment;

  CodeEditorState(this.fragment) {
    print("Controller created");
    codeController.text = fragment.raw;
  }
}

Widget EditorPanel() {
  return Consumer<Catalogue>(
      builder: (context, value, child) => ChangeNotifierProvider(
          create: (context) => CodeEditorState(value.selectedFragment),
          builder: (context, child) => Consumer<CodeEditorState>(
              builder: (context, codeEditorState, child) => CodeField(
                    expands: true,
                    controller: codeEditorState.codeController,
                    textStyle: const TextStyle(fontFamily: 'SourceCode'),
                  ))));
}
