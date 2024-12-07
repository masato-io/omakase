"use client";

import { StandardManufacturingOrdersKanban } from "@/app/(leftpanel)/manufacturing-orders/standard/kanban";
import { useViewContext } from "@/app/(leftpanel)/view-context";
import { StandardManufacturingOrdersTableClient } from "@/app/(leftpanel)/manufacturing-orders/standard/client-table";
import { StandardManufacturingOrdersCalendar } from "@/app/(leftpanel)/manufacturing-orders/standard/calendar";
import { gql } from "@fabrix-framework/fabrix";
import { useEffect, useState } from "react";
import { statusLabels } from "@/lib/enum-labels";
import { statusColors } from "@/lib/colors";
import { useQuery } from "urql";

export type ManufacturingOrder = {
  id: string;
  name: string;
  bom: { name: string };
  quantity?: number;
  status: string;
  componentsStatus?: string;
  startDateTime?: string;
  endDateTime?: string;
  moBatchId?: string;
};

const QUERY = gql`
  query {
    manufacturingOrders {
      collection {
        id
        name
        quantity
        bom {
          name
        }
        status
        componentsStatus
        startDateTime
        endDateTime
        moBatchId
      }
    }
    __type(name: "ManufacturingOrderStatus") {
      enumValues {
        name
      }
    }
  }
`;

export default function StandardManufacturingOrdersPage() {
  const { viewType } = useViewContext();
  const [{ data }] = useQuery({ query: QUERY });
  const [statuses, setStatuses] = useState([]);
  const [manufacturingOrders, setManufacturingOrders] = useState<
    ManufacturingOrder[]
  >([]);

  useEffect(() => {
    if (data) {
      const fetchedStatuses = data.__type.enumValues.map(
        (enumValue: { name: string }) => ({
          id: enumValue.name,
          name:
            statusLabels[enumValue.name] || enumValue.name.replace(/_/g, " "),
          color: statusColors[enumValue.name] || "bg-chart-1",
        }),
      );

      const fetchedOrders = data.manufacturingOrders.collection.map(
        (order: ManufacturingOrder) => ({
          ...order,
          startAt: order.startDateTime
            ? new Date(order.startDateTime)
            : new Date(),
          endAt: order.endDateTime ? new Date(order.endDateTime) : new Date(),
        }),
      );

      setStatuses(fetchedStatuses);
      setManufacturingOrders(fetchedOrders);
    }
  }, [data]);

  return (
    <div>
      {viewType === "table" && (
        <StandardManufacturingOrdersTableClient
          manufacturingOrders={manufacturingOrders}
        />
      )}
      {viewType === "kanban" && (
        <StandardManufacturingOrdersKanban
          manufacturingOrders={manufacturingOrders}
          setManufacturingOrders={setManufacturingOrders}
          statuses={statuses}
        />
      )}
      {viewType === "calendar" && (
        <StandardManufacturingOrdersCalendar
          manufacturingOrders={manufacturingOrders}
          statuses={statuses}
        />
      )}
    </div>
  );
}
