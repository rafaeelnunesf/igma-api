import { Customer, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
  }

  async findAll(): Promise<Customer[]> {
  }

  async findOne(cpf: string): Promise<Customer> {
  }
}
