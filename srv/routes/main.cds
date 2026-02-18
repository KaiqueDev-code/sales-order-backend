using { sales } from '../../db/schema';
using { db.types.SalesReport } from '../../db/types/sales-report';


@requires: 'authenticated-user'
service MyService {

    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
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
