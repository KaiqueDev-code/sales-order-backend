
// "Bibliotecas da sap"
using {managed} from '@sap/cds/common';

// Tudo que esta a baixo do namespace tera esse nome
namespace sales;

// entidades -  dados 
entity  SalesOrderHeader: managed {
    key id: UUID;
        customer: Association to Customers;
        totalAmount: Decimal(15,2);
        itens: Composition of SalesOrderItens on itens.header = $self; // self esta referenciando ao SalesOrderHeader
    
}

entity SalesOrderItens {
    key id: UUID;
        header: Association to SalesOrderHeader;
        product: Association to Products;
        quantiti: Integer;
        price: Decimal(15,2)
}

entity Products {
    key id: UUID;
        itens: String;
        nome: String(255);
        price: Decimal(15,2)
}

entity Customers {
    key id: UUID;
        firstName: String(20);
        lastName: String(100);
        email: String(255)
}
