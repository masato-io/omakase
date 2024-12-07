"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { ColDef } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { Badge } from "@/components/ui/badge";
import { statusColors } from "@/lib/colors";
import { statusLabels } from "@/lib/enum-labels";
import { ManufacturingOrder } from "@/app/(leftpanel)/manufacturing-orders/standard/page";
import { MOSidePanel } from "./side-panel";

type Props = {
  manufacturingOrders: ManufacturingOrder[];
};
// TODO: Make this a shared utility once we have a better understanding of the status patterns across different module tables.
const StatusEnumRenderer = <T extends keyof typeof statusColors>({
  value,
}: {
  value: T;
}) => {
  const color = statusColors[value] || "bg-gray-300";
  const label = statusLabels[value] || value;

  return (
    <div className="flex h-full items-center">
      <Badge className="flex items-center gap-2" size="sm" variant="secondary">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {label}
      </Badge>
    </div>
  );
};

const componentStatusColors: Record<string, string> = {
  Ready: "bg-green-500",
  Pending: "bg-yellow-500",
  In_Progress: "bg-blue-500",
  Blocked: "bg-red-500",
};

const componentStatusLabels: Record<string, string> = {
  Ready: "Ready",
  Pending: "Pending",
  In_Progress: "In Progress",
  Blocked: "Blocked",
};

const ComponentStatusEnumRenderer = <
  T extends keyof typeof componentStatusColors,
>({
  value,
}: {
  value: T;
}) => {
  const color = componentStatusColors[value] || "bg-gray-300";
  const label = componentStatusLabels[value] || value;

  return (
    <div className="flex h-full items-center">
      <Badge className="flex items-center gap-2" size="sm" variant="secondary">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {label}
      </Badge>
    </div>
  );
};

const QuantityRenderer = <T extends string | number>({
  value,
}: {
  value: T;
}) => {
  const quantity =
    typeof value === "number" ? value : parseFloat(value as string);
  const unit = quantity === 1 ? "piece" : "pieces";

  return quantity ? (
    <div className="flex flex-row items-center gap-2">
      {quantity}
      <span className="text-foreground">{unit}</span>
    </div>
  ) : null;
};

const MOBatchIdRenderer = <T extends string | number>({
  value,
}: {
  value: T;
}) => {
  return value ? (
    <div className="flex h-full items-center">
      <Badge className="flex items-center gap-2" size="sm" variant="secondary">
        {value}
      </Badge>
    </div>
  ) : null;
};

interface Row {
  id: string;
  name: string;
  bom: { name: string };
  quantity: number;
  status: string;
  componentsStatus: string;
  startDateTime: string;
  endDateTime: string;
  moBatchId: string;
}

export const StandardManufacturingOrdersTable = ({
  manufacturingOrders,
}: Props) => {
  const { theme } = useTheme();

  const rowData: Row[] = manufacturingOrders.map((order) => ({
    id: order.id,
    name: order.name,
    bom: order.bom,
    quantity: order.quantity ?? 0,
    status: order.status,
    componentsStatus: order.componentsStatus || "N/A",
    startDateTime: order.startDateTime || "N/A",
    endDateTime: order.endDateTime || "N/A",
    moBatchId: order.moBatchId || "N/A",
  }));

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const colDefs: ColDef<Row>[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "bom.name", headerName: "BOM", flex: 1 },
    {
      field: "quantity",
      headerName: "Quantity",
      cellRenderer: QuantityRenderer,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: StatusEnumRenderer,
      flex: 1,
    },
    {
      field: "componentsStatus",
      headerName: "Components Status",
      cellRenderer: ComponentStatusEnumRenderer,
      flex: 1,
    },
    { field: "startDateTime", headerName: "Start Date Time", flex: 1 },
    { field: "endDateTime", headerName: "End Date Time", flex: 1 },
    {
      field: "moBatchId",
      headerName: "MO Batch ID",
      cellRenderer: MOBatchIdRenderer,
      flex: 1,
    },
  ];

  return (
    <div
      className={theme === "dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"}
      style={{ width: "100%", height: "80vh" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        rowSelection={{
          mode: "singleRow",
          checkboxes: false,
          enableClickSelection: false,
        }}
        onRowClicked={(e) => setSelectedId(rowData[e.rowIndex!].id)}
      />
      <MOSidePanel
        id={selectedId}
        onOpenChange={(open) => setSelectedId(open ? selectedId : null)}
      />
    </div>
  );
};

export default StandardManufacturingOrdersTable;
