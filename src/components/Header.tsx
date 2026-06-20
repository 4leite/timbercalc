import { Link } from "@tanstack/react-router"
import { buttonVariants } from "@tohuhono/ui/button"
import { ModeToggle } from "@tohuhono/ui/mode-toggle"

export default function Header() {
  return (
    <header
      className="
        sticky top-0 z-50 border-sidebar-border bg-sidebar
        text-sidebar-foreground
      "
    >
      <nav className="flex flex-wrap items-center justify-between gap-2 p-2">
        <Link to="/" className={buttonVariants({ variant: "link" })}>
          Timberborn Calculator
        </Link>

        <ModeToggle />
      </nav>
    </header>
  )
}
