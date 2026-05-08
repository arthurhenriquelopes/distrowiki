import { Skeleton } from "@/components/ui/skeleton";

interface DistroCardSkeletonProps {
  viewMode?: "list" | "grid" | "terminal";
}

const DistroCardSkeleton = ({ viewMode = "list" }: DistroCardSkeletonProps) => {
  if (viewMode === "terminal") {
    return (
      <div className="bg-[#0d1117] border-2 border-gray-500 rounded-none overflow-hidden animate-pulse">
        {/* Terminal Header */}
        <div className="bg-gray-800/50 border-b border-gray-700/50 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <Skeleton className="w-3 h-3 rounded-none" />
              <Skeleton className="w-3 h-3 rounded-none" />
              <Skeleton className="w-3 h-3 rounded-none" />
            </div>
            <Skeleton className="h-3 w-32 ml-2" />
          </div>
        </div>
        {/* Terminal Content */}
        <div className="p-4 space-y-2 min-h-[200px]">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3 mt-3" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-1/2 mt-3" />
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="bg-card border border-border rounded-none p-4 h-full flex flex-col items-center">
        <Skeleton className="w-16 h-16 rounded-none mb-3" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-16 mb-3" />
        <Skeleton className="h-6 w-12 rounded-none" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-none p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-16 h-16 rounded-none flex-shrink-0" />
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
        <Skeleton className="h-6 w-16 rounded-none" />
        <Skeleton className="h-6 w-20 rounded-none" />
      </div>

      {/* Performance Bars */}
      <div className="space-y-2 py-3 border-t border-border">
        {/* RAM */}
        <div>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-none" />
        </div>

        {/* CPU */}
        <div>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-none" />
        </div>

        {/* I/O */}
        <div>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-none" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-12 rounded-none" />
      </div>
    </div>
  );
};

export default DistroCardSkeleton;
