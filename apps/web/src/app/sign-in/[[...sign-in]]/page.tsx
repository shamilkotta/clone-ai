import Bg from "@/components/Bg";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Bg />
      <SignIn />
    </div>
  );
}
