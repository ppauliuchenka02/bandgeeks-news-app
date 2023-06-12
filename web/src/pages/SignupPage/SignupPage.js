import { useRef } from 'react'
import { useEffect } from 'react'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
// eslint-disable-next-line import/order
import { toast, Toaster } from '@redwoodjs/web/toast'
import { useAuth } from 'src/auth'

// For Form Usage (from Redwood Tutorial)

// Authentication Logic
const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()
  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.meme())
    }
  }, [isAuthenticated])

  const usernameRef = useRef(null)
  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  const onSubmit = async (data) => {
    const response = await signUp({
      username: data.username,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success('Registered - Successfully!!')
      navigate(routes.meme())
    }
  }

  return (
    <>
      <MetaTags title="Signup" />

      <main className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="rw-segment">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Register an Account
            </h2>

            <div className="rw-segment-main">
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <Form onSubmit={onSubmit} className="space-y-6">
                  <Label
                    name="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                    errorClassName="rw-label rw-label-error"
                  >
                    Username
                  </Label>
                  <TextField
                    name="username"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    errorClassName="rw-input rw-input-error"
                    ref={usernameRef}
                    validation={{
                      required: true,
                      pattern: {
                        value: /^(?!.*\s)[a-zA-Z0-9]{8,}$/,
                        message:
                          'Username MUST be AT LEAST 8 Characters with NO Spaces and only alphanumeric characters',
                      },
                    }}
                  />

                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                    errorClassName="rw-label rw-label-error"
                  >
                    Password
                  </Label>
                  <PasswordField
                    name="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: true,
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\d).{8,}$/,
                        message:
                          'Password MUST be AT LEAST 8 Characters with: 1 uppercase, 1 lowercase, 1 digit, and 1 special character',
                      },
                    }}
                  />

                  <FieldError name="password" className="rw-field-error" />

                  <Label
                    name="confirm-password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                    errorClassName="rw-label rw-label-error"
                  >
                    Confirm Password
                  </Label>
                  <PasswordField
                    name="confirm-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'MUST confirm password',
                      },
                    }}
                  />

                  <FieldError
                    name="confirm-password"
                    className="rw-field-error"
                  />

                  <div className="rw-button-group">
                    <Submit className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Sign Up
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span>Already have an account?</span>{' '}
            <Link
              to={routes.login()}
              className="leading-6 text-indigo-600 underline"
            >
              Log in!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
