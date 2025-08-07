import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { LoginForm } from "@/components/ui/login-form"
import { Dumbbell } from "lucide-react"

export default async function LoginPage() {
  const supabase = await createClient()
  
  // Check if user is already authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // If user is logged in, redirect to dashboard
    redirect('/')
  }

  return (
    <div className="grid min-h-svh md:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-bold">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Dumbbell className="size-4" />
            </div>
            BEGIN
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden md:block bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="absolute inset-0 flex items-center justify-center">
          <Dumbbell className="h-64 w-64 text-primary/10" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
    </div>
  )
}

