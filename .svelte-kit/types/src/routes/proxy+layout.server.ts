// @ts-nocheck
import type { LayoutServerLoad } from './$types'

export const load = async ({ locals: { safeGetSession }, cookies, locals }: Parameters<LayoutServerLoad>[0]) => {
  const { session } = await safeGetSession()
  return {
    session,
    cookies: cookies.getAll(),
  }
}