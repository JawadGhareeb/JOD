import { Skeleton } from "@/src/components/ui/LoadingSkeleton";

export function HomePostCardSkeleton() {
  return (
    <Skeleton
      containerStyle={{ marginBottom: 12 }}
      layout={{
        width: "100%",
        children: [
          {
            
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            children: [
              {
                flexDirection: "row-reverse",
                alignItems: "center",
                children: [
                  { width: 42, height: 42, borderRadius: 21, marginRight: 8 },
                  {
                    children: [
                      { width: 100, height: 12, borderRadius: 8, marginBottom: 6 },
                      { width: 140, height: 10, borderRadius: 8 },
                    ],
                  },
                ],
              },
              { width: 78, height: 24, borderRadius: 999 },
            ],
          },
          { width: 74, height: 22, borderRadius: 999, marginBottom: 10 },
          { width: "100%", height: 14, borderRadius: 8, marginBottom: 8 },
          { width: "88%", height: 14, borderRadius: 8, marginBottom: 10 },
          { width: "100%", height: 168, borderRadius: 12, marginBottom: 10 },
          {
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            marginBottom: 10,
            children: [
              { width: 70, height: 12, borderRadius: 8 },
              { width: 70, height: 12, borderRadius: 8 },
              { width: 70, height: 12, borderRadius: 8 },
              { width: 70, height: 12, borderRadius: 8 },
            ],
          },
          { width: "100%", height: 34, borderRadius: 8 },
        ],
      }}
    />
  );
}
