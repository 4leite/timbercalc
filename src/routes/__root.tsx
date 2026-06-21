import { TanStackDevtools } from "@tanstack/react-devtools"
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { Antifouc } from "@tohuhono/ui/antifouc"

import { AppProvider } from "#/components/AppProvider"
import Footer from "#/components/Footer"
import Header from "#/components/Header"
import { Layout } from "#/components/Layout"
import { NotFound } from "#/components/NotFound"

import appCss from "#/app.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Timberborn Calculator",
      },
      {
        name: "theme-color",
        content: "#e7f3ec",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      {
        rel: "apple-touch-icon",
        href: "/logo192.png",
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootComponent() {
  return <Outlet />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Antifouc />
        <HeadContent />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        <AppProvider>
          <Layout>
            <Header />
            {children}
            <Footer />
          </Layout>
        </AppProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
