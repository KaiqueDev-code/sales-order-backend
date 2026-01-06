
// "Bibliotecas da sap"
using {managed} from '@sap/cds/common';

// Tudo que esta a baixo do namespace tera esse nome
namespace sales;

// entidades -  dados 
entity  SalesOrderHeader: managed {
    key id: UUID

}