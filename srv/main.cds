using { sales } from '../db/schema';

@requires: 'authenticated-user'
service MyService {

    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;
    entity Products as projection on sales.Products;
    entity Customers as projection on sales.Customers;
}