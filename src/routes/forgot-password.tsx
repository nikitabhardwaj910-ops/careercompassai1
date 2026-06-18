import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — CareerCompass AI" }] }),
  component: () => <AuthShell mode="forgot" />,
});
