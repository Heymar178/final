import * as React from "react";
import { View, Text, StyleSheet } from "react-native";

const Table = ({ children, style, ...props }: { children: React.ReactNode; style?: object }) => {
  return (
    <View style={[styles.table, style]} {...props}>
      {children}
    </View>
  );
};

const TableHeader = ({ children, style, ...props }: { children: React.ReactNode; style?: object }) => {
  return (
    <View style={[styles.tableHeader, style]} {...props}>
      {children}
    </View>
  );
};

const TableBody = ({ children, style, ...props }: { children: React.ReactNode; style?: object }) => {
  return (
    <View style={[styles.tableBody, style]} {...props}>
      {children}
    </View>
  );
};

const TableFooter = ({ children, style, ...props }: { children: React.ReactNode; style?: object }) => {
  return (
    <View style={[styles.tableFooter, style]} {...props}>
      {children}
    </View>
  );
};

const TableRow = ({ children, style, ...props }: { children: React.ReactNode; style?: object }) => {
  return (
    <View style={[styles.tableRow, style]} {...props}>
      {children}
    </View>
  );
};

const TableHead = ({ children, style, ...props }: { children: React.ReactNode; style?: object }) => {
  return (
    <Text style={[styles.tableHead, style]} {...props}>
      {children}
    </Text>
  );
};

const TableCell = ({ children, style, ...props }: { children: React.ReactNode; style?: object }) => {
  return (
    <Text style={[styles.tableCell, style]} {...props}>
      {children}
    </Text>
  );
};

const TableCaption = ({ children, style, ...props }: { children: React.ReactNode; style?: object }) => {
  return (
    <Text style={[styles.tableCaption, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  tableHeader: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableBody: {
    paddingHorizontal: 16,
  },
  tableFooter: {
    backgroundColor: "#f9fafb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 14,
  },
  tableHead: {
    flex: 1,
    fontWeight: "700",
    fontSize: 14,
    color: "#374151",
    paddingHorizontal: 8,
    textAlign: "left",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#4b5563",
    paddingHorizontal: 8,
    textAlign: "left",
  },
  tableCaption: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  
});

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
