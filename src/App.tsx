import { ThemeProvider } from '@/components/layout/ThemeProvider'

export function App() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen items-center justify-center bg-bg text-ink">
        <p className="font-serif text-2xl italic">Mini App skeleton</p>
      </div>
    </ThemeProvider>
  )
}
