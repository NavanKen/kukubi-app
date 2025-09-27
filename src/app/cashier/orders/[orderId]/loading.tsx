import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailSkeleton() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6">
              <div className="grid grid-cols-4 gap-4 mb-4 pb-3 border-b">
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>

              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 py-4 last:border-b-0"
                >
                  <Skeleton className="h-5 w-3" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 bg-card p-4 rounded-md">
            <div>
              <Skeleton className="h-7 w-20 mb-4" />

              <div className="space-y-3">
                <div>
                  <Skeleton className="h-5 w-28 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>

            <div>
              <Skeleton className="h-7 w-40 mb-4" />

              <div className="space-y-3">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}

                <div className="flex justify-between items-center pt-3 border-t">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
