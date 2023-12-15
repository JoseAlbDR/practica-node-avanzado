import { TAGS } from '../../../config';
import { ITags } from '../../../data/seed/seed';

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly onSale: boolean,
    public readonly price: number,
    public readonly tags: ITags[],
    public readonly createdBy: string,
    public readonly image?: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const {
      name,
      onSale = true,
      price,
      tags,
      createdBy,
      image = false,
    } = props;

    if (!name || name === '') return ['Mising name'];

    let onSaleBoolean = onSale;
    if (typeof onSale !== 'boolean') onSaleBoolean = onSale === 'true';
    if (!price) return ['Price is required'];
    if (price <= 0) return ['Price must be greater than zero'];
    if (!tags || tags.length === 0) return ['Tags are required'];
    if (!(tags as ITags[]).every((tag) => TAGS.includes(tag)))
      return [`Not allowed tags used, allowed tags: ${TAGS.join(', ')}`];
    if (!createdBy) return ['Created by is required'];
    return [
      undefined,
      new CreateProductDto(name, onSale, price, tags, createdBy, image),
    ];
  }
}