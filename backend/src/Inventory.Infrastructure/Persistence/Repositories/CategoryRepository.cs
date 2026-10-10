using Inventory.Application.Abstractions.Persistence;
using Inventory.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Inventory.Infrastructure.Persistence.Repositories;

internal sealed class CategoryRepository(InventoryDbContext context)
    : Repository<Category>(context), ICategoryRepository
{
    public async Task<IReadOnlyList<(Category Category, int ProductCount)>> GetAllWithProductCountAsync(
        CancellationToken cancellationToken = default)
    {
        var rows = await Set
            .AsNoTracking()
            .OrderBy(category => category.Name)
            .Select(category => new { Category = category, ProductCount = category.Products.Count })
            .ToListAsync(cancellationToken);

        return rows.Select(row => (row.Category, row.ProductCount)).ToList();
    }

    public Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default) =>
        Set.AnyAsync(category => category.Id == id, cancellationToken);

    public Task<bool> NameExistsAsync(string name, int? excludeId = null, CancellationToken cancellationToken = default) =>
        Set.AnyAsync(
            category => category.Name == name && (excludeId == null || category.Id != excludeId),
            cancellationToken);

    public Task<int> CountProductsAsync(int id, CancellationToken cancellationToken = default) =>
        Context.Products.CountAsync(product => product.CategoryId == id, cancellationToken);
}
