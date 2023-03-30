import { ReactNode } from 'react'

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white overflow-hidden dark:bg-slate-800 h-screen dark:text-zinc-300">
      {children}
    </div>
  )
}
