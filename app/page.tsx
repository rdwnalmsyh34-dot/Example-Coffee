import { Suspense } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import BeverageShowcase from './components/BeverageShowcase'
import MenuGrid from './components/MenuGrid'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <BeverageShowcase />
      <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading menu...</div>}>
        <MenuGrid />
      </Suspense>
      <Footer />
    </main>
  )
}