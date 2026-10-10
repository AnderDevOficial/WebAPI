using Inventory.Application.Common;
using Inventory.Application.Products;
using Inventory.Domain.Entities;

namespace Inventory.Application.Abstractions.Persistence;

public interface IProductRepository : IRepository<Product>
{
    Task<PagedResult<Product>> GetPagedAsync(ProductQuery query, CancellationToken cancellationToken = default);

    Task<Product?> GetByIdWithCategoryAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> SkuExistsAsync(string sku, int? excludeId = null, CancellationToken cancellationToken = default);
}
