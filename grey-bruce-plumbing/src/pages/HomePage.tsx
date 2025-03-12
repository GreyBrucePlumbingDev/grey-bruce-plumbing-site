// src/pages/HomePage.tsx
import { useEffect } from 'react'
import { checkSupabaseConnection } from '../lib/supabase'

const HomePage = () => {
  useEffect(() => {
    // Check Supabase connection when the homepage loads
    checkSupabaseConnection()
  }, [])

  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Grey-Bruce Plumbing</h1>
            <p className="py-6">Professional plumbing services for Grey and Bruce counties. Residential and commercial solutions for all your plumbing needs.</p>
            <button className="btn btn-primary">Get Started</button>
          </div>    
        </div>
      </div>
    </div>
  )
}

export default HomePage