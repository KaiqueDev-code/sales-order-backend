import { SalesOrderControllerImpl } from "srv/controlles/sales-order-header/implementation";
import { SalesOrderHeaderController } from "srv/controlles/sales-order-header/protocols";
import { salesOrderHeaderService } from "../service/sales-order-header";

export const makeSalesOrderHeaderController = (): SalesOrderHeaderController => {
    return new SalesOrderControllerImpl(salesOrderHeaderService);
 }

 export const salesOrderHeaderController = makeSalesOrderHeaderController();