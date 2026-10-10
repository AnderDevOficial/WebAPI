using Inventory.Application.Abstractions.Persistence;
using Inventory.Application.Exceptions;
using Inventory.Application.Products;
using Inventory.Domain.Entities;
using NSubstitute;

namespace Inventory.Application.Tests.Products;

public sealed class ProductServiceTests
{
    private readonly IProductRepository _products = Substitute.For<IProductRepository>();
    private readonly ICategoryRepository _categories = Substitute.For<ICategoryRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly ProductService _sut;

    public ProductServiceTests() => _sut = new ProductService(_products, _categories, _unitOfWork);

    private static CreateProductRequest ValidRequest() => new()
    {
        Name = "Audífonos",
        Sku = "elec-0100",
        Price = 799.999m,
        Stock = 10,
        CategoryId = 1
    };

    [Fact]
    public async Task CreateAsync_WhenCategoryDoesNotExist_ThrowsValidation()
    {
        _categories.ExistsAsync(1, Arg.Any<CancellationToken>()).Returns(false);

        var exception = await Assert.ThrowsAsync<BusinessValidationException>(() => _sut.CreateAsync(ValidRequest()));

        Assert.True(exception.Errors.ContainsKey(nameof(ProductRequest.CategoryId)));
    }

    [Fact]
    public async Task CreateAsync_WhenSkuExists_ThrowsConflict()
    {
        _categories.ExistsAsync(1, Arg.Any<CancellationToken>()).Returns(true);
        _products.SkuExistsAsync("ELEC-0100", null, Arg.Any<CancellationToken>()).Returns(true);

        await Assert.ThrowsAsync<ConflictException>(() => _sut.CreateAsync(ValidRequest()));
    }

    [Fact]
    public async Task CreateAsync_NormalizesSkuAndRoundsPrice()
    {
        _categories.ExistsAsync(1, Arg.Any<CancellationToken>()).Returns(true);
        Product? saved = null;
        await _products.AddAsync(Arg.Do<Product>(p => saved = p), Arg.Any<CancellationToken>());
        _products.GetByIdWithCategoryAsync(Arg.Any<int>(), Arg.Any<CancellationToken>()).Returns(_ => saved);

        var result = await _sut.CreateAsync(ValidRequest());

        Assert.Equal("ELEC-0100", result.Sku);
        Assert.Equal(800.00m, result.Price);
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task DeleteAsync_WhenMissing_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _sut.DeleteAsync(99));
    }
}
