using { sales } from '../db/schema';


service MyService {

    entity SalesOrderHeader as projection on sales.SalesOrderHeader;
    entity Products as projection on sales.Products;
    entity Customers as projection on sales.Customers    
}