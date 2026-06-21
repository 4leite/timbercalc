import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@tohuhono/ui/card"

export function NotFound() {
  return (
    <div className="grid h-full place-content-center">
      <Card>
        <CardHeader>
          <CardTitle>404 - page not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The page you requested does not exist or may have moved.</p>
        </CardContent>
        <CardFooter>
          <Link to="/">Return home</Link>
        </CardFooter>
      </Card>
    </div>
  )
}
