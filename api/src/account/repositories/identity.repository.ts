import { InjectRepository } from '@nestjs/typeorm';
import { Identity } from 'src/db';
import { Repository } from 'typeorm';

export class IdentityRepository {
  constructor(
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
  ) {}

  create() {}
}
