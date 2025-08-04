import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

interface TableComponentProps<T> {
  columns: { key: keyof T | "acciones"; label: string }[];
  data: T[];
  renderActions?: (row: T) => JSX.Element; // Nueva prop para botones en la tabla
}

export default function TableComponent<T>({ columns, data, renderActions }: TableComponentProps<T>) {
  return (
    <Table aria-label="User Data Table">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key as string}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => (
             <TableCell key={column.key as string}>
             {column.key === "acciones" && renderActions
               ? renderActions(row)
               : String(row[column.key as keyof T])} {/* Convertimos a string */}
           </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
