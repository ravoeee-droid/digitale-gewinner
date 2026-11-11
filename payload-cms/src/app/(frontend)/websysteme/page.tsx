import { redirect } from 'next/navigation'

/** Isolated preview route. The existing homepage remains unchanged. */
export default function WebsystemePreview() {
  redirect('/websysteme.html')
}
