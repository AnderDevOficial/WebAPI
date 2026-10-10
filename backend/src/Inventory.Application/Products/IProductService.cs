using Inventory.Application.Common;

namespace Inventory.Application.Products;

public interface IProductService
{
    Task<PagedResult<ProductResponse>> GetPagedAsync(ProductQuery query, CancellationToken cancellationToken = default);

    Task<ProductResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default);

    Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request, CancellationToken cancellationToken = default);

    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
