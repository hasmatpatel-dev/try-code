
'use client'

import ForgotPassword from '@/components/shadcn-space/blocks/forgot-password-01/forgot-password'
import LoginForm from '@/components/shadcn-space/blocks/login-01/login'
import RegisterForm from '@/components/shadcn-space/blocks/register-01/register'
import TwoFactorAuthForm from '@/components/shadcn-space/blocks/two-factor-authentication-01/two-factor-auth'
import VerifyEmail from '@/components/shadcn-space/blocks/verify-email-01/verify-email'



export default function Page() {
  return (
    <div>

        {/* login-01 */}
        <section>
          <LoginForm />
        </section>
    

        {/* register-01 */}
        <section>
          <RegisterForm />
        </section>
    

        {/* two-factor-authentication-01 */}
        <section>
          <TwoFactorAuthForm />
        </section>
    

        {/* forgot-password-01 */}
        <section>
          <ForgotPassword />
        </section>
    

        {/* verify-email-01 */}
        <section>
          <VerifyEmail />
        </section>
    
    </div>
  )
}
