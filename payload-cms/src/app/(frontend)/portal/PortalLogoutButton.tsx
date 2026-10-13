'use client'

export default function PortalLogoutButton() {
  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/portal'
  }

  return (
    <button className="portal-logout" type="button" onClick={handleLogout}>
      Abmelden
    </button>
  )
}
