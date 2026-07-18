import { notFound, redirect } from "next/navigation";
import { managerLinkKeyIsValid } from "@/lib/server/public-access";

export const dynamic = "force-dynamic";

export default async function ManagerSubmissionPage({
  params,
}: {
  params: Promise<{ access_key: string }>;
}) {
  const { access_key } = await params;
  if (!managerLinkKeyIsValid(access_key)) {
    notFound();
  }
  redirect("/manage");
}
