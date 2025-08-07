import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - BEGIN",
  description: "Sign in to your BEGIN fitness tracking account",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}