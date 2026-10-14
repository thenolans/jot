import { paths } from '@/app/paths'
import ButtonLink from '@/components/ui/ButtonLink'
import Heading from '@/components/ui/Heading'
import Logo from '@/components/ui/Logo'

import NoteDemo from './NoteDemo'

export default function LandingPage() {
  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-16">
      <header className="pt-6">
        <Logo />
      </header>

      <main className="flex flex-wrap items-center justify-center gap-10 pt-10 pb-16 lg:gap-16">
        <div className="basis-md">
          <Heading as="h1" variant="hero">
            Your notes, organized.
          </Heading>
          <p className="mt-4 mb-8 text-xl leading-relaxed text-muted">
            No formatting toolbar. No fuss. Jot anything down, organize it into
            folders, and share notes with others.
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink to={paths.register} size="lg">
              Get started
            </ButtonLink>
            <ButtonLink to={paths.login} variant="ghost" size="lg">
              Sign in
            </ButtonLink>
          </div>
        </div>

        <div className="flex basis-sm justify-center">
          <NoteDemo />
        </div>
      </main>
    </div>
  )
}
