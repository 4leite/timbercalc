import { createFileRoute } from "@tanstack/react-router"

import { Calculator } from "#/components/Calculator"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <main className="flex-1 pt-12 pb-8">
      <Calculator />
    </main>
  )
}
