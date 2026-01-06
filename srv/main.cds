using { sales } from '../db/test';


service MyService {

    entity SalesOrderHeader as projection on sales.SalesOrderHeader;
    
}