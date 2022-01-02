import 'package:code_editor/code_editor.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'watcher.dart';
import 'listpanel.dart';
import 'editorpanel.dart';

void main() {
  runApp(const MyApp());

  // watch();
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Snorfeld',
      theme: ThemeData(
        primarySwatch: Colors.blueGrey,
      ),
      home: const MyHomePage(title: 'Snorfeld - Noveling Away'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          // Here we take the value from the MyHomePage object that was created by
          // the App.build method, and use it to set our appbar title.
          title: Text(widget.title),
        ),
        body: ChangeNotifierProvider(
          create: (context) => Catalogue(),
          child: Row(children: [
            SizedBox(
              width: 240,
              child: buildList(),
            ),
            Container(width: 0.5, color: Colors.black),
            Expanded(child: EditorPanel())
          ]),
        ));
  }
}
