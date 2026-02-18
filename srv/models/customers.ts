// Define as propriedades e comportamentos de um customer.

// Interface que define as propriedades de um customer
export type CustomerProps = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

// Classe que encapsula a lógica de negócio para customer
// Responsável por: validar e processar dados de email
export class CustomerModel {
    // Construtor privado para forçar uso do método factory
    constructor(private props: CustomerProps) {}

    // Factory method para criar uma instância de CustomerModel
    public static with(props: CustomerProps): CustomerModel {
        return new CustomerModel(props);
    }

    // Getter para obter o ID do customer
    public get id() {
        return this.props.id;
    }

    // Getter para obter o primeiro nome do customer
    public get firstName() {
        return this.props.firstName;
    }

    // Getter para obter o último nome do customer
    public get lastName() {
        return this.props.lastName;
    }

    // Getter para obter o email do customer
    public get email() {
        return this.props.email;
    }

    // Define um domínio padrão de email (@gmail.com) se não houver @ no email
    // Retorna 'this' para permitir encadeamento (method chaining)
    public SetDefaultEmailDomain(): CustomerModel {
        // Verifica se o email não contém @
        if (!this.props.email?.includes('@')) {
            this.props.email = `${this.props.email}@yahoo.com`;
        }
        return this;
    }

    // Converte a instância do modelo para um objeto simples (DTO)
    public ToObject(): CustomerProps {
        return {
            id: this.props.id,
            firstName: this.props.firstName,
            lastName: this.props.lastName,
            email: this.props.email
        };
    }
}
