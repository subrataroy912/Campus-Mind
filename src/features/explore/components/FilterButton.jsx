import { Button } from "@/components/ui/button.jsx";

export default function FilterButton({ active, children, onClick }) {
  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
