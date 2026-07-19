import { AuthShell } from "@/features/auth/components/auth-shell";
import { TokenForm } from "@/features/auth/components/token-form";
export default function VerifyEmailPage() { return <AuthShell title="Verify your email"><Suspense fallback={null}><TokenForm mode="verify" /></Suspense></AuthShell>; }
import { Suspense } from "react";
