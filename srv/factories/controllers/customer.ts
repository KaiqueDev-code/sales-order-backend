import { CustomerController } from '@/controllers/customer/protocols';
import { CustomerControllerImp } from '@/controllers/customer/implementation';
import { customerService } from '@/factories/service/customer';

const makeCustomerController = (): CustomerController => {
    return new CustomerControllerImp(customerService);
};

export const customerController = makeCustomerController();
