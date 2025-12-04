import { Skeleton } from "@/components/ui/skeleton";

interface DistroCardSkeletonProps {
  viewMode?: "list" | "grid";
}

const DistroCardSkeleton = ({ viewMode = "list" }: DistroCardSkeletonProps) => {
  if (viewMode === "grid") {
    return (
      <div className="bg-card border border-border rounded-xl p-4 h-full flex flex-col items-center">
        <Skeleton className="w-16 h-16 rounded-lg mb-3" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-16 mb-3" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Category & Year */}
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>

      {/* Desktop Environment Badges */}
      <div className="flex gap-1.5 mb-3">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>

      {/* Performance Bars */}
      <div className="space-y-2 py-3 border-t border-border">
        {/* RAM */}
        <div>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>

        {/* CPU */}
        <div>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>

        {/* I/O */}
        <div>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    </div>
  );
};

export default DistroCardSkeleton;
