import { useState } from 'react'
import { PageHeader } from '../../../components/layout/PageHeader'
import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Modal } from '../../../components/ui/Modal'
import { Spinner } from '../../../components/ui/Spinner'
import { useToast } from '../../../components/ui/toast'
import { getErrorMessage } from '../../../lib/http/apiError'
import { CategoryForm } from '../components/CategoryForm'
import { CategoryTable } from '../components/CategoryTable'
import { useCategories, useDeleteCategory, useSaveCategory } from '../hooks'
import type { Category, CategoryInput } from '../types'

type EditorState = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; category: Category }

export function CategoriesPage() {
  const { data: categories, isPending, isError, error, refetch } = useCategories()
  const saveCategory = useSaveCategory()
  const deleteCategory = useDeleteCategory()
  const { notify } = useToast()

  const [editor, setEditor] = useState<EditorState>({ mode: 'closed' })
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null)

  const closeEditor = () => setEditor({ mode: 'closed' })

  const handleSave = async (input: CategoryInput) => {
    const id = editor.mode === 'edit' ? editor.category.id : undefined
    await saveCategory.mutateAsync({ id, input })
    notify(id ? 'Categoría actualizada correctamente.' : 'Categoría creada correctamente.')
    closeEditor()
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteCategory.mutateAsync(pendingDelete.id)
      notify('Categoría eliminada correctamente.')
    } catch (deleteError) {
      notify(getErrorMessage(deleteError), 'error')
    } finally {
      setPendingDelete(null)
    }
  }

  const openCreate = () => setEditor({ mode: 'create' })

  return (
    <>
      <PageHeader
        title="Categorías"
        description="Organiza tus productos por categoría."
        actions={<Button onClick={openCreate}>Nueva categoría</Button>}
      />

      <section className="card">
        {isPending ? (
          <div className="center-block"><Spinner label="Cargando categorías…" /></div>
        ) : isError ? (
          <Alert
            variant="error"
            title="No fue posible cargar las categorías"
            action={<Button variant="secondary" size="sm" onClick={() => refetch()}>Reintentar</Button>}
          >
            {getErrorMessage(error)}
          </Alert>
        ) : categories.length === 0 ? (
          <EmptyState
            title="Aún no hay categorías"
            description="Crea la primera categoría para comenzar a registrar productos."
            action={<Button onClick={openCreate}>Nueva categoría</Button>}
          />
        ) : (
          <CategoryTable
            categories={categories}
            onEdit={(category) => setEditor({ mode: 'edit', category })}
            onDelete={setPendingDelete}
          />
        )}
      </section>

      <Modal
        isOpen={editor.mode !== 'closed'}
        title={editor.mode === 'edit' ? 'Editar categoría' : 'Nueva categoría'}
        onClose={closeEditor}
      >
        {editor.mode !== 'closed' && (
          <CategoryForm
            key={editor.mode === 'edit' ? editor.category.id : 'new'}
            category={editor.mode === 'edit' ? editor.category : undefined}
            isSubmitting={saveCategory.isPending}
            onSubmit={handleSave}
            onCancel={closeEditor}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={pendingDelete !== null}
        title="Eliminar categoría"
        message={`¿Seguro que deseas eliminar la categoría "${pendingDelete?.name ?? ''}"? Esta acción no se puede deshacer.`}
        isLoading={deleteCategory.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
