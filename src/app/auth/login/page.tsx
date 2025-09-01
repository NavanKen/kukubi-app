import LoginPage from "./login-form";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const callbackUrl = searchParams.callbackUrl ?? null;

  return <LoginPage callbackUrl={callbackUrl} />;
}
