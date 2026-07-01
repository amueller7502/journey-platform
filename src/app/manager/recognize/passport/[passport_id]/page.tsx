import { redirect } from "next/navigation";

export default async function ManagerRecognizePassportIdAliasPage({
  params,
}: {
  params: Promise<{ passport_id: string }>;
}) {
  const { passport_id } = await params;

  redirect(`/manager/passport/${passport_id}`);
}
