import { redirect } from 'next/navigation'

const HomePage = () => {
  redirect('/pages/auth/login')
}

export default HomePage
