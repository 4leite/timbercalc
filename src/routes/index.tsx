import { createFileRoute } from "@tanstack/react-router"

import { Calculator } from "#/components/Calculator"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <main className="flex-1 py-8">
      <Calculator />
    </main>
  )
}
