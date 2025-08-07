'use client'

import { useState, useTransition } from "react"
import { Dumbbell } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function LoginFormOTP({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [otpValue, setOtpValue] = useState('')
  const [error] = useState<string>("")
  const [isPending] = useTransition()
  const email = "user@example.com"

  return (
    <div className={cn("flex flex-col items-stretch w-full max-w-[474px] gap-6 px-6 pt-16", className)} {...props}>
      {/* Logo */}
      <div className="flex items-center justify-center">
        <Dumbbell className="h-16 w-auto" />
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-medium tracking-tight">Welcome back</h2>
        <div className="pt-3 text-sm text-muted-foreground">
          We sent a temporary login code to{" "}
          <span className="font-semibold">{email}</span>.<br />
          <button 
            type="button" 
            className="underline cursor-pointer hover:no-underline"
            disabled={isPending}
          >
            Not you?
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-stretch gap-3">
        {error && (
          <div className="bg-destructive/15 text-destructive border border-destructive/20 rounded-md p-3 text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col items-stretch gap-6">
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