import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/press/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/press/$slug"!</div>
}
