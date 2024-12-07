import { Dispatch, SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FabrixComponent, gql } from "@fabrix-framework/fabrix";

type MOSidePanelProps = {
  id: string | null;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};
export function MOSidePanel({ id, onOpenChange }: MOSidePanelProps) {
  return (
    <Sheet open={id != null} onOpenChange={onOpenChange} modal={false}>
      {id && (
        <FabrixComponent
          contentClassName="grid gap-1"
          query={gql`
          query mo {
            manufacturingOrder(id: "${id ?? ""}") {
              name
              quantity
              bom {
                id
                name
              }
              status
              startDateTime
              endDateTime
              componentsStatus
              item {
                id
                name
              }
            }
            mOLineItems(query: { moId: { eq: "${id}" } } ) {
              collection {
                id
                requiredQuantity
                totalCost
                itemMoId
                bomLineItem {
                  item { id name inventoryType bomId }
                  uom { name id }
                }
              }
            }
          }
          `}
        >
          {({ getOperation }) =>
            getOperation<{ manufacturingOrder: { name: string } }>(
              0,
              ({ data, getComponent }) => (
                <SheetContent
                  className="w-fit max-w-full sm:max-w-full"
                  overlay={false}
                  onInteractOutside={(e) => e.preventDefault()}
                >
                  <Tabs defaultValue="overview">
                    <SheetHeader>
                      <SheetTitle>{data.manufacturingOrder.name}</SheetTitle>
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="items">Items</TabsTrigger>
                        <TabsTrigger value="work-orders">
                          Work Orders
                        </TabsTrigger>
                        <TabsTrigger value="activities">Activities</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview">
                        {getComponent("manufacturingOrder")}
                      </TabsContent>
                      <TabsContent value="items">
                        {getComponent("mOLineItems")}
                      </TabsContent>
                      <TabsContent value="work-orders">Work Orders</TabsContent>
                      <TabsContent value="activities">Activities</TabsContent>
                    </SheetHeader>
                  </Tabs>
                </SheetContent>
              ),
            )
          }
        </FabrixComponent>
      )}
    </Sheet>
  );
}
