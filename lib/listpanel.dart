import 'package:flutter/material.dart';
import 'package:snorfeld/watcher.dart';
import 'package:provider/provider.dart';

Widget buildList() {
  return Container(
      width: 300,
      child: Consumer<Catalogue>(builder: (context, catalogue, child) {
        return ListView.builder(
            itemCount: catalogue.getFragmentList().length,
            itemBuilder: (context, index) {
              return ListTile(
                title: Text(catalogue.getFragmentList().elementAt(index).path),
              );
            });
      }));
}
