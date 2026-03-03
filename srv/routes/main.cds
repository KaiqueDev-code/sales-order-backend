using { sales } from '../../db/schema';

using { db.types.BulkCreateSalesOrder as Bulk } from '../../db/types/bulk-create-sales-orders';
using { db.types.SalesReport as SalesReport } from '../../db/types/sales-report';


@requires: 'authenticated-user'
@path: '/sales-order'
service MyService {

    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders actions{
        action cloneSalesOrder() returns Boolean;
    };
    entity Products as projection on sales.Products;
    entity Customers as projection on sales.Customers actions{
        function getSalesReportsByCustomerId() returns array of SalesReport.ExpectedResult;
    }
    entity SalesOrderLogs as projection on sales.SalesOrderLogs;
    entity SalesOrderStatuses as projection on sales.SalesOrderStatuses;

}

// functions
extend service MyService with {
    function getSalesReportsByDays(days: SalesReport.Params:days) returns array of SalesReport.ExpectedResult;
};

// Actions
extend service MyService with{
    action bulkCreateSalesOrder(payload: array of Bulk.Payload) returns Bulk.ExpectedResult;
}