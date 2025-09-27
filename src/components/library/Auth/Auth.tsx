import React, { useState, useContext } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { SupabaseContext } from "@/context"
import { AuthError, User } from "@supabase/supabase-js"

interface AuthModalProps {
  onAuthSuccess?: (user: User) => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { supabase } = useContext(SupabaseContext)
  const { toast } = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      let result
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (result.error) {
          throw result.error
        }
        
        if (result.data.user && !result.data.user.email_confirmed_at) {
          toast({
            title: 'Check your email',
            description: 'We sent you a confirmation link. Please check your email to verify your account.',
          })
        } else {
          toast({
            description: 'Account created successfully!'
          })
          onAuthSuccess?.(result.data.user!)
          setIsOpen(false)
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (result.error) {
          throw result.error
        }
        
        toast({
          description: 'Signed in successfully!'
        })
        onAuthSuccess?.(result.data.user!)
        setIsOpen(false)
      }
    } catch (error: unknown) {
      toast({
        title: 'Authentication failed',
        description: (error as AuthError).message || 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-semibold">
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="font-serif max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full font-semibold"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface UserMenuProps {
  user: User
  onSignOut: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onSignOut }) => {
  const { supabase } = useContext(SupabaseContext)
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      onSignOut()
      toast({
        description: 'Signed out successfully'
      })
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as AuthError).message || 'Failed to sign out',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 hidden sm:inline">
        {user.email}
      </span>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleSignOut}
        className="font-semibold"
      >
        Sign Out
      </Button>
    </div>
  )
}