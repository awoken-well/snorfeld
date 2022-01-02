import 'package:watcher/watcher.dart';
import 'package:flutter/material.dart';
import 'dart:io';

class Catalogue extends ChangeNotifier {
  Map<String, Fragment> fragmentMap = {};

  Fragment selectedFragment = Fragment('empty', 'empty');

  Catalogue() {
    watch(this);
  }

  Iterable<Fragment> getFragmentList() {
    return fragmentMap.values;
  }

  void add(String key, Fragment fragment) {
    fragmentMap[key] = fragment;
    selectedFragment = fragment;
    notifyListeners();
  }

  void remove(String key) {
    fragmentMap.remove(key);
    notifyListeners();
  }

  void update(String key, Fragment fragment) {
    fragmentMap[key] = fragment;
    notifyListeners();
  }
}

class Fragment {
  String path;
  String raw;

  Fragment(this.path, this.raw);
}

final validFiles = RegExp(r'^.*\.(md|txt)$');

void watch(Catalogue catalogue) {
  var path = '/Users/olafjanssen/Downloads/nanowrimo2021';
  var watcher = DirectoryWatcher(path);

  var stream = Directory(path).list(recursive: true);
  stream.forEach((file) {
    if (validFiles.hasMatch(file.path)) {
      catalogue.add(
          file.path, Fragment(file.path, File(file.path).readAsStringSync()));
    }
  });

  watcher.events.listen((event) {
    if (validFiles.hasMatch(event.path)) {
      switch (event.type) {
        case ChangeType.ADD:
          {
            catalogue.add(event.path,
                Fragment(event.path, File(event.path).readAsStringSync()));
          }
          break;

        case ChangeType.REMOVE:
          {
            catalogue.remove(event.path);
          }
          break;

        case ChangeType.MODIFY:
          {
            catalogue.update(event.path,
                Fragment(event.path, File(event.path).readAsStringSync()));
          }
          break;
      }
    }
  });
}
