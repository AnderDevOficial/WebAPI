using Inventory.Application.Abstractions.Persistence;
using Inventory.Application.Common;
using Inventory.Application.Products;
using Inventory.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Infrastructure.Persistence.Repositories;

internal sealed class ProductRepository(InventoryDbContext context)
    : Repository<Product>(context), IProductRepository
{
    public async Task<PagedResult<Product>> GetPagedAsync(ProductQuery query, CancellationToken cancellationToken = default)
    {
        var products = Set.AsNoTracking().Include(product => product.Category).AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim();
            products = products.Where(product => product.Name.Contains(term) || product.Sku.Contains(term));
        }

        if (query.CategoryId is { } categoryId)
        {
            products = products.Where(product => product.CategoryId == categoryId);
        }

        if (query.IsActive is { } isActive)
        {
            products = products.Where(product => product.IsActive == isActive);
        }

        var totalCount = await products.CountAsync(cancellationToken);

        var items = await ApplySorting(products, query.SortBy, query.Descending)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Product>(items, query.Page, query.PageSize, totalCount);
    }

    public Task<Product?> GetByIdWithCategoryAsync(int id, CancellationToken cancellationToken = default) =>
        Set.Include(product => product.Category).FirstOrDefaultAsync(product => product.Id == id, cancellationToken);

    public Task<bool> SkuExistsAsync(string sku, int? excludeId = null, CancellationToken cancellationToken = default) =>
        Set.AnyAsync(
            product => product.Sku == sku && (excludeId == null || product.Id != excludeId),
            cancellationToken);

    private static IOrderedQueryable<Product> ApplySorting(IQueryable<Product> products, ProductSortField sortBy, bool descending) =>
        (sortBy, descending) switch
        {
            (ProductSortField.Price, false) => products.OrderBy(product => product.Price).ThenBy(product => product.Id),
            (ProductSortField.Price, true) => products.OrderByDescending(product => product.Price).ThenBy(product => product.Id),
            (ProductSortField.Stock, false) => products.OrderBy(product => product.Stock).ThenBy(product => product.Id),
            (ProductSortField.Stock, true) => products.OrderByDescending(product => product.Stock).ThenBy(product => product.Id),
            (ProductSortField.CreatedAt, false) => products.OrderBy(product => product.CreatedAt).ThenBy(product => product.Id),
            (ProductSortField.CreatedAt, true) => products.OrderByDescending(product => product.CreatedAt).ThenBy(product => product.Id),
            (_, true) => products.OrderByDescending(product => product.Name).ThenBy(product => product.Id),
            _ => products.OrderBy(product => product.Name).ThenBy(product => product.Id)
        };
}
