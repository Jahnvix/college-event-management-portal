import { AuthShell } from "@/features/auth/components/auth-shell";
import { TokenForm } from "@/features/auth/components/token-form";
export default function ResetPasswordPage() { return <AuthShell title="Choose a new password"><Suspense fallback={null}><TokenForm mode="reset" /></Suspense></AuthShell>; }
import { Suspense } from "react";
