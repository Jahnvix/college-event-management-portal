import { AuthShell } from "@/features/auth/components/auth-shell";
import { EmailRequestForm } from "@/features/auth/components/email-request-form";
export default function ForgotPasswordPage() { return <AuthShell title="Reset your password"><EmailRequestForm /></AuthShell>; }
