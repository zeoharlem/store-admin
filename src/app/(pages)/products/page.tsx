
import { Card } from '@/components/ui/card'

import { AdminProductsDataTable } from '@/features/products/presentation/components/admin-products-datatable'

const ProductsPage = () => {
  return (
    <div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
      <Card className='col-span-full w-full p-6'>
        <AdminProductsDataTable />
      </Card>
    </div>
  )
}

export default ProductsPage
