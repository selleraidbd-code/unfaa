import { Button } from "@workspace/ui/components/button";
import { add } from "@workspace/landing/add";

export default function Page() {
  console.log(add(1, 2));
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello apps / portal</h1>
        <Button size="sm">Button </Button>
        <p>add(1, 2) = {add(1, 2)}</p>
      </div>
    </div>
  );
}
