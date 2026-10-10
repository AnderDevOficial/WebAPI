using Inventory.Application.Abstractions.Persistence;
using Inventory.Application.Exceptions;
using Inventory.Domain.Entities;

namespace Inventory.Application.Categories;

internal sealed class CategoryService(ICategoryRepository categories, IUnitOfWork unitOfWork) : ICategoryService
{
    private const string ResourceName = "la categoría";

    public async Task<IReadOnlyList<CategoryResponse>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var rows = await categories.GetAllWithProductCountAsync(cancellationToken);
        return rows.Select(row => row.Category.ToResponse(row.ProductCount)).ToList();
    }

    public async Task<CategoryResponse> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var category = await GetExistingAsync(id, cancellationToken);
        var productCount = await categories.CountProductsAsync(id, cancellationToken);
        return category.ToResponse(productCount);
    }

    public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureUniqueNameAsync(request.Name, null, cancellationToken);

        var category = request.ToEntity();
        await categories.AddAsync(category, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return category.ToResponse(productCount: 0);
    }

    public async Task<CategoryResponse> UpdateAsync(int id, UpdateCategoryRequest request, CancellationToken cancellationToken = default)
    {
        var category = await GetExistingAsync(id, cancellationToken);
        await EnsureUniqueNameAsync(request.Name, id, cancellationToken);

        request.Apply(category);
        categories.Update(category);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var productCount = await categories.CountProductsAsync(id, cancellationToken);
        return category.ToResponse(productCount);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var category = await GetExistingAsync(id, cancellationToken);

        if (await categories.CountProductsAsync(id, cancellationToken) > 0)
        {
            throw new ConflictException("No se puede eliminar la categoría porque tiene productos asociados.");
        }

        categories.Remove(category);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task<Category> GetExistingAsync(int id, CancellationToken cancellationToken) =>
        await categories.GetByIdAsync(id, cancellationToken) ?? throw new NotFoundException(ResourceName, id);

    private async Task EnsureUniqueNameAsync(string name, int? excludeId, CancellationToken cancellationToken)
    {
        if (await categories.NameExistsAsync(name.Trim(), excludeId, cancellationToken))
        {
            throw new ConflictException($"Ya existe una categoría con el nombre '{name.Trim()}'.");
        }
    }
}
