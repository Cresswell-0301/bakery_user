import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img src="/logo.png" alt="Logo" className="" />
      <SignIn />
    </div>
  );
}
