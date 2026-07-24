import { apiSuccess } from "@/lib/api/route-handler";

export const dynamic = "force-static";

export function GET() {
  return apiSuccess(
    {
      service: "portfolio-front-app",
      status: "ok",
    },
    {
      headers: {
        "cache-control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
