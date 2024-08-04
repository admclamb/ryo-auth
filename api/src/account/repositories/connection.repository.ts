import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'src/db';
import { Repository } from 'typeorm';

export class ConnectionRepository {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}

  findByConnectionType(connectionType: string): Promise<Connection> {
    if (!connectionType) {
      return null;
    }

    return this.connectionRepository.findOne({
      where: {
        connectionType,
      },
    });
  }
}
