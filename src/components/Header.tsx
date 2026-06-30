export default function Header() {
  return (
    <header
      className="
        mx-auto flex max-w-295 flex-wrap items-center justify-between gap-4 p-4
      "
    >
      <div
        className="grid text-xl leading-none font-extrabold uppercase"
        aria-label="Timberborn Calculator"
      >
        <span>Timberborn</span>
        <span>Calculator</span>
      </div>
      <nav aria-label="Main sections">
        <button type="button">Calculator</button>
      </nav>
      <a
        className="
          cursor-pointer rounded-lg border border-[#7ec59b] bg-[#2e654f] px-3
          py-[0.45rem] text-white no-underline
        "
        href="https://store.steampowered.com/app/1062090/Timberborn/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Timberborn Steam page"
      >
        Visit Timberborn Steam page
      </a>
    </header>
  )
}
