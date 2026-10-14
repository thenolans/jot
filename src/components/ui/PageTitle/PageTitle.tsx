type PageTitleProps = {
  /** The page's name, without the app name. */
  children: string
}

/** Sets the document title to the page's name followed by the app name. */
export default function PageTitle({ children }: PageTitleProps) {
  return <title>{`${children} · Jot`}</title>
}
