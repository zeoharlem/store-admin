'use client'

// React Imports
import { useState, type FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Third-party Imports
import { EyeIcon, EyeOffIcon } from 'lucide-react'

// Components Import
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { browserAxios } from '@/shared/infrastructure/http/clients/browser-axios'
import { unwrapResponse } from '@/shared/infrastructure/http/utils/unwrap-response'
import { ApiResponse } from '@/shared/infrastructure/http/types/api-reponses'

interface LoginData {
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    status: string
  }
}

const LoginForm = () => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await browserAxios.post<ApiResponse<LoginData>>('/api/auth/login', { email, password })

      unwrapResponse(response.data, response.status)

      router.replace('/dashboard/orders')
      router.refresh()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className='gap-4'>
        {/* Email */}
        <Field className='gap-2'>
          <FieldLabel htmlFor='userEmail' className='leading-5'>
            Email address*
          </FieldLabel>

          <Input
            type='email'
            id='userEmail'
            name='email'
            placeholder='Enter your email address'
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoComplete='email'
            required
            disabled={isSubmitting}
          />
        </Field>

        {/* Password */}
        <Field className='w-full gap-2'>
          <FieldLabel htmlFor='password' className='leading-5'>
            Password*
          </FieldLabel>

          <InputGroup>
            <InputGroupInput
              id='password'
              name='password'
              type={isVisible ? 'text' : 'password'}
              placeholder='••••••••••••••••'
              value={password}
              onChange={event => setPassword(event.target.value)}
              autoComplete='current-password'
              required
              disabled={isSubmitting}
            />

            <InputGroupAddon align='inline-end' className='pr-1.5'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setIsVisible(prevState => !prevState)}
                className='text-muted-foreground rounded-l-none hover:bg-transparent'
                disabled={isSubmitting}
              >
                {isVisible ? <EyeOffIcon /> : <EyeIcon />}

                <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Field>

        {/* Remember Me and Forgot Password */}
        <div className='flex items-center justify-between gap-y-2'>
          <Field orientation='horizontal' className='flex items-center gap-2'>
            <Checkbox
              id='rememberMe'
              checked={rememberMe}
              onCheckedChange={checked => setRememberMe(checked === true)}
              disabled={isSubmitting}
            />

            <FieldLabel htmlFor='rememberMe' className='text-muted-foreground'>
              Remember Me
            </FieldLabel>
          </Field>

          <Link href='/pages/auth/forgot-password' className='text-base text-nowrap hover:underline'>
            Forgot Password?
          </Link>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className='text-destructive text-sm' role='alert' aria-live='polite'>
            {errorMessage}
          </p>
        )}

        {/* Submit */}
        <Field>
          <Button className='w-full' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in to Shadcn Studio'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
