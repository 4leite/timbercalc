import type { PropsWithChildren } from "react"

export const Layout = ({ children }: PropsWithChildren) => {
  return <div className="flex min-h-svh w-full flex-col"> {children}</div>
}
