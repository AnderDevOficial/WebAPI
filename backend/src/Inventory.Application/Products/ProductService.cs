using Inventory.Application.Abstractions.Persistence;
using Inventory.Application.Common;
using Inventory.Application.Exceptions;
using Inventory.Domain.Entities;

namespace Inventory.Application.Products;

internal sealed class ProductService(
    IProductRepository products,
    ICategoryRepository categories,
    IUnitOfWork unitOfWork) : IProductService
{
    private const string ResourceName = "el producto";

    public async Task<PagedResult<ProductResponse>> GetPagedAsync(ProductQuery query, CancellationToken cancellationToken = default)
    {
        var page = await products.GetPagedAsync(query, cancellationToken);
        return page.Map(product => product.ToResponse());
    }

    public async Task<ProductResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await GetExistingAsync(id, cancellationToken);
        return product.ToResponse();
    }

    public async Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default)
    {
        await ValidateAsync(request, null, cancellationToken);

        var product = request.ToEntity();
        await products.AddAsync(product, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(product.Id, cancellationToken);
    }

    public async Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request, CancellationToken cancellationToken = default)
    {
        var product = await GetExistingAsync(id, cancellationToken);
        await ValidateAsync(request, id, cancellationToken);

        request.Apply(product);
        products.Update(product);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await products.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException(ResourceName, id);

        products.Remove(product);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<Product> GetExistingAsync(int id, CancellationToken cancellationToken) =>
        await products.GetByIdWithCategoryAsync(id, cancellationToken) ?? throw new NotFoundException(ResourceName, id);

    private async Task ValidateAsync(ProductRequest request, int? excludeId, CancellationToken cancellationToken)
    {
        if (!await categories.ExistsAsync(request.CategoryId, cancellationToken))
        {
            throw new BusinessValidationException(nameof(request.CategoryId), "La categoría seleccionada no existe.");
        }

        var sku = ProductMappings.NormalizeSku(request.Sku);
        if (await products.SkuExistsAsync(sku, excludeId, cancellationToken))
        {
            throw new ConflictException($"Ya existe un producto con el SKU '{sku}'.");
        }
    }
}
