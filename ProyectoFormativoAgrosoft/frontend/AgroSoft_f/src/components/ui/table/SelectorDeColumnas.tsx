import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";
import { Selection } from "@heroui/react";

interface SelectorColumnasProps {
  columnas: { uid: string; name: string }[];
  visibleColumns: Selection;
  setVisibleColumns: (columns: Selection) => void;
}

export const SelectorColumnas = ({
  columnas,
  visibleColumns,
  setVisibleColumns,
}: SelectorColumnasProps) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          endContent={<ChevronDownIcon size={16} />}
          variant="flat"
          size="sm"
          className="w-full sm:w-auto"
        >
          Columnas
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Columnas de tabla"
        closeOnSelect={false}
        selectedKeys={visibleColumns}
        selectionMode="multiple"
        onSelectionChange={setVisibleColumns}
      >
        {columnas.map((columna) => (
          <DropdownItem key={columna.uid} className="capitalize">
            {columna.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
