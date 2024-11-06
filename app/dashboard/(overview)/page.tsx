import { lusitana } from '@/app/ui/fonts';
import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { Suspense } from 'react';
import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from '@/app/ui/skeletons';

export default async function DashboardPage() {
  return (
    <main>
      <h2 className={`${lusitana.className} text-[24px] mb-[16px]`}>
        Dashboard
      </h2>
      <div className="grid grid-cols-4 gap-6 md:grid-cols-2 sm:grid-cols-1">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="flex mt-6 gap-6 pb-[48px] md:flex-wrap">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
