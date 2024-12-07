"use client";

import React, { useState } from "react";
import {
  CompactSelect,
  CompactSelectContent,
  CompactSelectItem,
  CompactSelectTrigger,
} from "@/components/ui/compact-select";
import {
  Calendar,
  Columns3,
  Kanban,
  Layers2,
  ListFilter,
  Table,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ViewsComboBox } from "@/app/(leftpanel)/procurements/purchase-orders/views-combobox";
import { Button } from "@/components/ui/button";
import { useViewContext, ViewType } from "@/app/(leftpanel)/view-context";

export default function SubNav() {
  const { viewType, setViewType } = useViewContext();
  const [selectedToggle, setSelectedToggle] = useState("columns");

  const iconMap = {
    table: Table,
    kanban: Kanban,
    calendar: Calendar,
  };

  return (
    <div className="flex w-full justify-between gap-4 px-4 py-2">
      <div className="flex w-auto max-w-[50%] flex-grow items-center gap-4">
        <ViewsComboBox />
        <Button size="sm" variant="ghost">
          <Layers2 />
          Save this view
        </Button>
      </div>

      <div className="flex w-auto items-center gap-4">
        <div className="mr-8 flex w-auto max-w-[40%]">
          <CompactSelect
            value={viewType}
            onValueChange={(value: ViewType) => setViewType(value)}
          >
            <CompactSelectTrigger
              placeholder="Select an option"
              value={viewType}
              iconMap={iconMap}
            />
            <CompactSelectContent>
              <CompactSelectItem value="table" iconMap={iconMap}>
                Table
              </CompactSelectItem>
              <CompactSelectItem value="kanban" iconMap={iconMap}>
                Kanban
              </CompactSelectItem>
              <CompactSelectItem value="calendar" iconMap={iconMap}>
                Calendar
              </CompactSelectItem>
            </CompactSelectContent>
          </CompactSelect>
        </div>

        <ToggleGroup
          type="single"
          size="xs"
          value={selectedToggle}
          onValueChange={(value) => setSelectedToggle(value)}
        >
          <ToggleGroupItem value="columns" aria-label="Toggle Column">
            <Columns3 /> Columns
          </ToggleGroupItem>
          <ToggleGroupItem value="filters" aria-label="Toggle Filters">
            <ListFilter />
            Filters
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
