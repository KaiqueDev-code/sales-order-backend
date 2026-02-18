using { sales } from '../../db/schema';
using { db.types.SalesReportByDays } from '../../db/types/sales-report-by-days';


@requires: 'authenticated-user'
service MyService {

    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
    entity Products as projection on sales.Products;
    entity Customers as projection on sales.Customers;
    entity SalesOrderLogs as projection on sales.SalesOrderLogs;
    entity SalesOrderStatuses as projection on sales.SalesOrderStatuses;

}

// functions
extend service MyService with {
    function getSalesReportsByDays(days: SalesReportByDays.Params:days) returns array of SalesReportByDays.ExpectedResult;
};
