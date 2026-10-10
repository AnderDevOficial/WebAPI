using Inventory.Application.Abstractions.Persistence;

namespace Inventory.Infrastructure.Persistence;

internal sealed class UnitOfWork(InventoryDbContext context) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        context.SaveChangesAsync(cancellationToken);
}
