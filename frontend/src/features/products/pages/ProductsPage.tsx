import { useMemo, useState } from 'react'
import { PageHeader } from '../../../components/layout/PageHeader'
import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Modal } from '../../../components/ui/Modal'
import { Pagination } from '../../../components/ui/Pagination'
import { Spinner } from '../../../components/ui/Spinner'
import { useToast } from '../../../components/ui/toast'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { getErrorMessage } from '../../../lib/http/apiError'
import { useCategories } from '../../categories/hooks'
import { ProductFiltersBar, type StatusFilter } from '../components/ProductFiltersBar'
import { ProductForm } from '../components/ProductForm'
import { ProductTable } from '../components/ProductTable'
import { useDeleteProduct, useProducts, useSaveProduct } from '../hooks'
import type { Product, ProductFilters, ProductInput, ProductSortField } from '../types'

const PAGE_SIZE = 10

type EditorState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; product: Product }

const statusToIsActive: Record<StatusFilter, boolean | undefined> = {
  all: undefined,
  active: true,
  inactive: false,
}

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<{ sortBy: ProductSortField; descending: boolean }>({
    sortBy: 'Name',
    descending: false,
  })
  const [editor, setEditor] = useState<EditorState>({ mode: 'closed' })
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const debouncedSearch = useDebouncedValue(search.trim())

  const filters = useMemo<ProductFilters>(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      search: debouncedSearch || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      isActive: statusToIsActive[status],
      ...sort,
    }),
    [page, debouncedSearch, categoryId, status, sort],
  )

  const { data, isPending, isError, error, isFetching, refetch } = useProducts(filters)
  const { data: categories = [] } = useCategories()
  const saveProduct = useSaveProduct()
  const deleteProduct = useDeleteProduct()
  const { notify } = useToast()

  const withPageReset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setPage(1)
  }

  const handleSort = (field: ProductSortField) => {
    setSort((current) => ({
      sortBy: field,
      descending: current.sortBy === field ? !current.descending : false,
    }))
    setPage(1)
  }

  const closeEditor = () => setEditor({ mode: 'closed' })
  const openCreate = () => setEditor({ mode: 'create' })

  const handleSave = async (input: ProductInput) => {
    const id = editor.mode === 'edit' ? editor.product.id : undefined
    await saveProduct.mutateAsync({ id, input })
    notify(id ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.')
    closeEditor()
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteProduct.mutateAsync(pendingDelete.id)
      notify('Producto eliminado correctamente.')
      if (data && data.items.length === 1 && page > 1) setPage(page - 1)
    } catch (deleteError) {
      notify(getErrorMessage(deleteError), 'error')
    } finally {
      setPendingDelete(null)
    }
  }

  const hasActiveFilters = Boolean(debouncedSearch || categoryId || status !== 'all')

  const renderContent = () => {
    if (isPending) return <div className="center-block"><Spinner label="Cargando productos…" /></div>

    if (isError) {
      return (
        <Alert
          variant="error"
          title="No fue posible cargar los productos"
          action={<Button variant="secondary" size="sm" onClick={() => refetch()}>Reintentar</Button>}
        >
          {getErrorMessage(error)}
        </Alert>
      )
    }

    if (data.items.length === 0) {
      return hasActiveFilters ? (
        <EmptyState title="Sin resultados" description="Ningún producto coincide con los filtros aplicados." />
      ) : (
        <EmptyState
          title="Aún no hay productos"
          description="Registra tu primer producto para comenzar."
          action={<Button onClick={openCreate}>Nuevo producto</Button>}
        />
      )
    }

    return (
      <>
        <ProductTable
          products={data.items}
          sortBy={sort.sortBy}
          descending={sort.descending}
          onSort={handleSort}
          onEdit={(product) => setEditor({ mode: 'edit', product })}
          onDelete={setPendingDelete}
        />
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          pageSize={data.pageSize}
          onPageChange={setPage}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Productos"
        description="Consulta, registra y actualiza el catálogo de productos."
        actions={
          <Button onClick={openCreate} disabled={categories.length === 0}
            title={categories.length === 0 ? 'Primero crea una categoría' : undefined}>
            Nuevo producto
          </Button>
        }
      />

      <section className="card">
        <div className="card-toolbar">
          <ProductFiltersBar
            search={search}
            categoryId={categoryId}
            status={status}
            categories={categories}
            onSearchChange={withPageReset(setSearch)}
            onCategoryChange={withPageReset(setCategoryId)}
            onStatusChange={withPageReset(setStatus)}
          />
          {isFetching && !isPending && <Spinner size="sm" />}
        </div>
        {renderContent()}
      </section>

      <Modal
        isOpen={editor.mode !== 'closed'}
        title={editor.mode === 'edit' ? 'Editar producto' : 'Nuevo producto'}
        onClose={closeEditor}
      >
        {editor.mode !== 'closed' && (
          <ProductForm
            key={editor.mode === 'edit' ? editor.product.id : 'new'}
            product={editor.mode === 'edit' ? editor.product : undefined}
            categories={categories}
            isSubmitting={saveProduct.isPending}
            onSubmit={handleSave}
            onCancel={closeEditor}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="Eliminar producto"
        message={`¿Seguro que deseas eliminar el producto "${pendingDelete?.name ?? ''}"? Esta acción no se puede deshacer.`}
        isLoading={deleteProduct.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
