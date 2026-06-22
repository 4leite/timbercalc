/* eslint-disable better-tailwindcss/no-unknown-classes */
export default function Header() {
  return (
    <header className="app-header">
      <div className="app-logo" aria-label="Timberborn Calculator">
        <span>Timberborn</span>
        <span>Calculator</span>
      </div>
      <nav aria-label="Main sections" className="app-nav">
        <button type="button" className="app-nav__button">
          Calculator
        </button>
      </nav>
      <a
        className="steam-page-cta"
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
