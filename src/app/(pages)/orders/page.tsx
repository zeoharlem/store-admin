import { TruckIcon, TriangleAlertIcon, CalendarX2Icon } from 'lucide-react'

import { Card } from '@/components/ui/card'

import StatisticsCard from '@/views/dashboards/statistics/statistics-card-01'

// import TransactionDatatable, { type Item } from '@/views/datatables/datatable-transaction'
import { AdminOrdersDataTable } from '@/features/orders/presentation/components/admin-orders-datatable'

// Statistics card data
const StatisticsCardData = [
  {
    icon: <TruckIcon className='size-4' />,
    value: '42',
    title: 'Shipped Orders',
    changePercentage: '+18.2%'
  },
  {
    icon: <TriangleAlertIcon className='size-4' />,
    value: '8',
    title: 'Damaged Returns',
    changePercentage: '-8.7%'
  },
  {
    icon: <CalendarX2Icon className='size-4' />,
    value: '27',
    title: 'Missed Delivery Slots',
    changePercentage: '+4.3%'
  }
]

// Transaction table data
const OrdersPlayBook = () => {
  return (
    <div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
      {/* Statistics Cards */}
      <div className='col-span-full grid gap-6 sm:grid-cols-3 md:max-lg:grid-cols-1'>
        {StatisticsCardData.map((card, index) => (
          <StatisticsCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            changePercentage={card.changePercentage}
          />
        ))}
      </div>

      <Card className='col-span-full w-full p-6'>
        {/*<TransactionDatatable data={transactionData} />*/}
        <AdminOrdersDataTable />
      </Card>
    </div>
  )
}

export default OrdersPlayBook
