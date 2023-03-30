import { ReactNode } from 'react'

export default function Loader({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex justify-center items-center">{children}</div>
  )
}
