export interface EntityFactory<Entity, EntityDto> {
  create(...args: any): Entity | Promise<Entity>;

  createDto(entity: Entity): EntityDto;
}
