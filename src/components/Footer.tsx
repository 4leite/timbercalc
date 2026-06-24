import { useState } from "react"

export default function Footer() {
  const [policyOpen, setPolicyOpen] = useState(false)

  return (
    <>
      <footer
        className="
          mx-auto flex max-w-[1180px] flex-wrap items-center justify-between
          gap-4 p-4
        "
      >
        <p>
          <span>CalcSpirit.com © 2026</span>
          <span aria-hidden="true"> | </span>
          <button type="button" onClick={() => setPolicyOpen(true)}>
            Privacy Policy
          </button>
        </p>
        <p>
          This website is an unofficial fan-made project and is not affiliated with or endorsed by
          Mechanistry. The assets are derived from Timberborn, a game developed by Mechanistry. All
          trademarks and registered trademarks are the property of their respective owners.
        </p>
      </footer>
      {policyOpen ? (
        <div className="privacy-modal-root fixed inset-0 z-50" role="presentation">
          <div
            className="privacy-modal-backdrop absolute inset-0 bg-black/65"
            aria-hidden="true"
            onClick={() => setPolicyOpen(false)}
          />
          <div
            className="
              absolute top-1/2 left-1/2 max-h-[80vh] w-[min(90vw,42rem)]
              max-w-2xl -translate-1/2 overflow-auto rounded-2xl border
              border-white/25 bg-[#1e3a30] p-4
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
          >
            <div className="flex items-center justify-between">
              <h2 id="privacy-modal-title">Privacy Policy</h2>
              <button type="button" aria-label="Close" onClick={() => setPolicyOpen(false)}>
                ×
              </button>
            </div>
            <div>
              <p>Last updated: April 2026</p>
              <section>
                <h3>1. Introduction</h3>
                <p>This privacy policy explains how CalcSpirit.com handles user data.</p>
              </section>
              <section>
                <h3>2. Data Collected</h3>
                <p>The site does not collect any personally identifiable information.</p>
              </section>
              <section>
                <h3>10. Changes to This Policy</h3>
                <p>This privacy policy may be updated at any time.</p>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
