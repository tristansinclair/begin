'use client'

import { useState, useTransition } from "react"
import { Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { sendOTP, verifyOTP } from "@/app/login/actions"

type AuthStep = 'email' | 'code'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const [error, setError] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  async function handleEmailSubmit(formData: FormData) {
    setError("")
    
    startTransition(async () => {
      const result = await sendOTP(formData)
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.success && result?.email) {
        setEmail(result.email)
        setStep('code')
      }
    })
  }

  async function handleCodeSubmit(formData: FormData) {
    setError("")
    
    // Add email and token to form data
    formData.append('email', email)
    formData.append('token', otpValue)
    
    startTransition(async () => {
      const result = await verifyOTP(formData)
      
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  // async function handleGoogleSignIn() {
  //   setError("")
    
  //   startTransition(async () => {
  //     const result = await signInWithGoogle()
      
  //     if (result?.error) {
  //       setError(result.error)
  //     }
  //   })
  // }

  function handleBackToEmail() {
    setStep('email')
    setError("")
    setOtpValue("")
  }

  return (
    <div className={cn("flex flex-col items-stretch w-full max-w-[474px] gap-6 px-6 pt-16", className)} {...props}>
      {/* Logo */}
      <div className="flex items-center justify-center">
        <Dumbbell className="h-16 w-auto" />
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-medium tracking-tight">Welcome back</h2>
        {step === 'code' && (
          <div className="pt-3 text-sm text-muted-foreground">
            We sent a temporary login code to{" "}
            <span className="font-semibold">{email}</span>.<br />
            <button 
              type="button" 
              className="underline cursor-pointer hover:no-underline"
              onClick={handleBackToEmail}
              disabled={isPending}
            >
              Not you?
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-col items-stretch gap-3">
        {/* {step === 'email' && (
          <>
            {/* Google Sign In */}
            {/* <div className="flex flex-col items-stretch gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-full font-semibold"
                onClick={handleGoogleSignIn}
                disabled={isPending}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                    <g clipPath="url(#clip0_9_516)">
                      <path d="M19.8052 10.2304C19.8052 9.55059 19.7501 8.86714 19.6325 8.19839H10.2002V12.0492H15.6016C15.3775 13.2912 14.6573 14.3898 13.6027 15.088V17.5866H16.8252C18.7176 15.8449 19.8052 13.2728 19.8052 10.2304Z" fill="#4285F4"/>
                      <path d="M10.1999 20.0007C12.897 20.0007 15.1714 19.1151 16.8286 17.5866L13.6061 15.0879C12.7096 15.6979 11.5521 16.0433 10.2036 16.0433C7.59474 16.0433 5.38272 14.2832 4.58904 11.9169H1.26367V14.4927C2.96127 17.8695 6.41892 20.0007 10.1999 20.0007V20.0007Z" fill="#34A853"/>
                      <path d="M4.58565 11.9169C4.16676 10.675 4.16676 9.33011 4.58565 8.08814V5.51236H1.26395C-0.154389 8.33801 -0.154389 11.6671 1.26395 14.4927L4.58565 11.9169V11.9169Z" fill="#FBBC04"/>
                      <path d="M10.1999 3.95805C11.6256 3.936 13.0035 4.47247 14.036 5.45722L16.8911 2.60218C15.0833 0.904587 12.6838 -0.0287217 10.1999 0.000673888C6.41892 0.000673888 2.96127 2.13185 1.26367 5.51234L4.58537 8.08813C5.37538 5.71811 7.59107 3.95805 10.1999 3.95805V3.95805Z" fill="#EA4335"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_9_516">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Continue with Google</span>
                </span>
              </Button>
            </div>

            {/* Divider */}
            {/* <div className="relative flex h-5 items-center justify-center">
              <hr className="h-px grow border-border" />
              <h3 className="w-11 shrink-0 text-center text-sm font-semibold text-muted-foreground px-2">
                or
              </h3>
              <hr className="h-px grow border-border" />
            </div>
          </>
        )} */}

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/15 text-destructive border border-destructive/20 rounded-md p-3 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form 
          action={step === 'email' ? handleEmailSubmit : handleCodeSubmit}
          className="flex flex-col items-stretch gap-6"
        >
          {step === 'email' ? (
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Enter email address"
                className="h-12 rounded-2xl px-4 bg-secondary/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
                required
                disabled={isPending}
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
                disabled={isPending}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}

          <Button
            type="submit"
            className="h-12 rounded-full font-semibold bg-foreground text-background hover:bg-foreground/90"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Continue"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to BEGIN's{" "}
            <a href="/terms" className="underline hover:no-underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:no-underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  )
}
