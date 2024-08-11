import { EntityFactory } from 'src/common/factory/entity.factory';
import { Identity } from 'src/db';
import { IdentityDto } from '../dto/identity.dto';

export class IdentityFactory implements EntityFactory<Identity, IdentityDto> {
  createDto(identity: Identity): IdentityDto {
    return {
      connection: identity.connection.connectionType,
      id: identity.id,
    };
  }

  create() {
    return new Identity();
  }
}
