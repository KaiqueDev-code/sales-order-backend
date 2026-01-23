
// "Bibliotecas da sap"
using { managed } from '@sap/cds/common';

// Tudo que esta a baixo do namespace tera esse nome
namespace sales;

// entidades -  dados 
entity  SalesOrderHeaders: managed {
    key id: UUID;
        customer: Association to Customers;
        totalAmount: Decimal(15,2);
        items: Composition of many SalesOrderItems on items.header = $self; // self esta referenciando ao SalesOrderHeaders
    
}

entity SalesOrderItems {
    key id: UUID;
        header: Association to SalesOrderHeaders;
        product: Association to Products;
        quantiti: Integer;
        price: Decimal(15,2);
}

entity SalesOrderLogs : managed {
    key id: UUID;
        header: Association to SalesOrderHeaders;
        userData: LargeString;
        orderData: LargeString;
}

entity Products {
    key id: UUID;
        nome: String(255);
        price: Decimal(15,2);
        stock: Integer;
}

entity Customers {
    key id: UUID;
        firstName: String(20);
        lastName: String(100);
        email: String(255);
}
