export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t px-4 pt-10 pb-14 text-muted-foreground">
      <div
        className="
          flex flex-col items-center justify-between gap-4 text-center
          sm:flex-row sm:text-left
        "
      >
        <p className="text-sm">&copy; {year} Jon Vivian. All rights reserved.</p>
        <p
          className="
            m-0 text-xs font-semibold tracking-widest text-primary uppercase
          "
        >
          Built with TanStack Start
        </p>
      </div>
    </footer>
  )
}
