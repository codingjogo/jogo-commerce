import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <section className="container cpy">
      <h1>Hello World</h1>
      <Card className="max-w-xs">
        <CardContent className="p-4 grid gap-2">
        <Button>Hello Button!</Button>
        <Button variant={'secondary'}>Secondary</Button>
        </CardContent>
      </Card>
    </section>
  );
}
