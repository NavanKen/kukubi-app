import LoginPage from "./login-form";

export default function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const callbackUrl =
    typeof searchParams?.callbackUrl === "string"
      ? searchParams.callbackUrl
      : null;

  return <LoginPage callbackUrl={callbackUrl} />;
}
