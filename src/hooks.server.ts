import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

const supabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      /**
       * SvelteKit's cookies API requires `path` to be explicitly set in
       * the cookie options. Setting `path` to `/` replicates previous/
       * standard behavior.
       */
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' })
        })
      },
    },
  })

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null }
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      // JWT validation has failed
      return { session: null, user: null }
    }

    return { session, user }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  const accessToken = event.cookies.get('sb-access-token')
  if ((event.url.pathname === '/login' || event.url.pathname === '/register') && accessToken) {
    throw redirect(303, '/')
  }

  if (!event.locals.session && event.url.pathname.startsWith('/private')) {
    redirect(303, '/auth')
  }

  if (event.locals.session && event.url.pathname === '/auth') {
    redirect(303, '/private')
  }

  return resolve(event)
}

const adminGuard: Handle = async ({ event, resolve }) => {
  const { user } = event.locals;

  if (user) {
    // Zisti, či má používateľ rolu admin
    const { data, error } = await event.locals.supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching admin role:', error);
      event.locals.isAdmin = false;
    } else {
      event.locals.isAdmin = data?.role === 'admin';
    }
  } else {
    event.locals.isAdmin = false; // Ak používateľ nie je prihlásený, nie je admin.
  }
  return resolve(event);
};

const getUser: Handle = async ({ event, resolve }) => {
  const { user } = event.locals;

  if (user) {
    // Získať username používateľa z tabuľky 'profiles'
    const { data, error } = await event.locals.supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching username:', error);
      event.locals.username = null; // Ak nastane chyba, neexistuje username.
    } else {
      event.locals.username = data?.username; // Uložíme username do locals
    }
  } else {
    event.locals.username = null; // Ak používateľ nie je prihlásený, neexistuje username.
  }
  return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard, adminGuard, getUser)