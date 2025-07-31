import { Query } from "mongoose";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };
    const excludedFields = ["searchTerm", "sort", "fields", "page", "limit"];
    excludedFields.forEach(field => delete filter[field]);

    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(searchAbleFields: string[]): this {
    const searchTerm = this.query.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchAbleFields.map(field => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }
    return this;
  }

  sort(): this {
    const sortBy = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
    const page = this.query.page ? parseInt(this.query.page) : 1;
    const limit = this.query.limit ? parseInt(this.query.limit) : 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = this.query.page ? parseInt(this.query.page) : 1;
    const limit = this.query.limit ? parseInt(this.query.limit) : 10;
    const totalPages = Math.ceil(totalDocuments / limit);
    return {
      total: totalDocuments,
      page,
      limit,
      totalPages,
    };
  }
}
