import { redirect } from "next/navigation";

export default function ArtistDashboardRoot() {
  redirect("/dashboard/artist/overview");
}