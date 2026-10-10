using Inventory.Domain.Entities;

namespace Inventory.Application.Abstractions.Persistence;

public interface ICategoryRepository : IRepository<Category>
{
    Task<IReadOnlyList<(Category Category, int ProductCount)>> GetAllWithProductCountAsync(
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default);

    Task<bool> NameExistsAsync(string name, int? excludeId = null, CancellationToken cancellationToken = default);

    Task<int> CountProductsAsync(int id, CancellationToken cancellationToken = default);
}
