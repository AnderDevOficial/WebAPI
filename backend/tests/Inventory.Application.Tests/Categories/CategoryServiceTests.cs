using Inventory.Application.Abstractions.Persistence;
using Inventory.Application.Categories;
using Inventory.Application.Exceptions;
using Inventory.Domain.Entities;
using NSubstitute;

namespace Inventory.Application.Tests.Categories;

public sealed class CategoryServiceTests
{
    private readonly ICategoryRepository _categories = Substitute.For<ICategoryRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly CategoryService _sut;

    public CategoryServiceTests() => _sut = new CategoryService(_categories, _unitOfWork);

    [Fact]
    public async Task CreateAsync_TrimsValuesAndPersists()
    {
        var request = new CreateCategoryRequest { Name = "  Juguetes ", Description = "   " };

        var result = await _sut.CreateAsync(request);

        Assert.Equal("Juguetes", result.Name);
        Assert.Null(result.Description);
        await _categories.Received(1).AddAsync(Arg.Is<Category>(c => c.Name == "Juguetes"), Arg.Any<CancellationToken>());
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task CreateAsync_WhenNameExists_ThrowsConflict()
    {
        _categories.NameExistsAsync("Hogar", null, Arg.Any<CancellationToken>()).Returns(true);

        await Assert.ThrowsAsync<ConflictException>(() => _sut.CreateAsync(new CreateCategoryRequest { Name = "Hogar" }));
        await _unitOfWork.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateAsync_WhenMissing_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _sut.UpdateAsync(42, new UpdateCategoryRequest { Name = "Nueva" }));
    }

    [Fact]
    public async Task DeleteAsync_WhenCategoryHasProducts_ThrowsConflict()
    {
        _categories.GetByIdAsync(1, Arg.Any<CancellationToken>()).Returns(new Category { Id = 1, Name = "Hogar" });
        _categories.CountProductsAsync(1, Arg.Any<CancellationToken>()).Returns(3);

        await Assert.ThrowsAsync<ConflictException>(() => _sut.DeleteAsync(1));
        _categories.DidNotReceive().Remove(Arg.Any<Category>());
    }
}
