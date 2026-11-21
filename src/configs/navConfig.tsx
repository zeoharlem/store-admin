// Third-party Imports
import type * as Icon from 'lucide-react'

type IconName = keyof typeof Icon

export type MenuLeafSubItem = {
  label: string
  href: string
  activePath?: string
  badge?: string
  badgeClassName?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
}

export type MenuGroupSubItem = {
  label: string
  childItems: MenuLeafSubItem[]
}

export type MenuSubItem = MenuLeafSubItem | MenuGroupSubItem

export type MenuItem = {
  icon: IconName
  label: string
} & (
  | {
      href: string
      badge?: string
      badgeClassName?: string
      childItems?: never
      target?: '_blank' | '_self' | '_parent' | '_top'
    }
  | {
      href?: never
      badge?: string
      badgeClassName?: string
      childItems: MenuSubItem[]
    }
)

export type NavItem = {
  groupLabel?: string
  items: MenuItem[]
}

export const navItems: NavItem[] = [
  {
    groupLabel: 'Dashboard & Layouts',
    items: [
      {
        icon: 'Package',
        label: 'Dashboard',
        href: '/dashboard/orders'
      },
      {
        icon: 'TrendingUp',
        label: 'Sales & Orders',
        href: '/orders',
        badgeClassName: 'right-8'
      },
      {
        icon: 'Ham',
        label: 'Products',
        href: '/products',
        badgeClassName: 'right-8'
      },
      {
        icon: 'Truck',
        label: 'Logistics',
        href: '/logistics',
        badgeClassName: 'right-8'
      },
    ]
  },
  {
    groupLabel: 'Apps',
    items: [
      {
        icon: 'MailIcon',
        label: 'Mail',
        href: '/apps/mail'
      },
      {
        icon: 'CalendarIcon',
        label: 'Calendar',
        href: '/apps/calendar'
      },
      {
        icon: 'UsersIcon',
        label: 'Administrator',
        childItems: [
          { label: 'List', href: '/apps/users/list' },
          { label: 'View', href: '/apps/users/view' }
        ]
      },
      {
        icon: 'ShieldCheckIcon',
        label: 'Roles & Permissions',

        ////badge: 'Pro',
        badgeClassName: 'right-8',
        childItems: [
          {
            label: 'Roles',
            href: '#',
          },
          {
            label: 'Permissions',
            href: '#',
          }
        ]
      }
    ]
  },
  {
    groupLabel: 'Pages',
    items: [
      {
        icon: 'UserCogIcon',
        label: 'Customer Service',
        childItems: [
          {
            label: 'General',
            href: '/pages/user-settings?setting=general'
          },
          {
            label: 'Workspace',
            href: '/pages/user-settings?setting=workspace'
          },
          {
            label: 'Notifications',
            href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/user-settings?setting=notifications',
            target: '_blank',

            ////badge: 'Pro',
            badgeClassName: 'right-8'
          },
          {
            label: 'Integrations',
            href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/user-settings?setting=integrations',
            target: '_blank',

            ////badge: 'Pro',
            badgeClassName: 'right-8'
          },
          {
            label: 'Members',
            href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/user-settings?setting=members',
            target: '_blank',

            ////badge: 'Pro',
            badgeClassName: 'right-8'
          },
          {
            label: 'Security',
            href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/user-settings?setting=security',
            target: '_blank',

            ////badge: 'Pro',
            badgeClassName: 'right-8'
          },
          {
            label: 'Billing & Usage',
            href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/user-settings?setting=billing',
            target: '_blank',

            ////badge: 'Pro',
            badgeClassName: 'right-8'
          }
        ]
      },
      {
        icon: 'UserIcon',
        label: 'Vendor Service',
        childItems: [
          {
            label: 'Profile',
            href: '/pages/user-profile?view=profile'
          },
          {
            label: 'Connections',
            href: '/pages/user-profile?view=connections'
          },
          {
            label: 'Teams',
            href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/user-profile?view=teams',
            target: '_blank',

            ////badge: 'Pro',
            badgeClassName: 'right-8'
          },
          {
            label: 'Projects',
            href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/user-profile?view=projects',
            target: '_blank',

            ////badge: 'Pro',
            badgeClassName: 'right-8'
          }
        ]
      },
      {
        icon: 'LockKeyholeIcon',
        label: 'Authentication',
        childItems: [
          {
            label: 'Login',
            childItems: [
              { label: 'Login v1', href: '/pages/auth/login', target: '_blank' },
              {
                label: 'Login v2',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/login-v2',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              },
              {
                label: 'Login v3',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/login-v3',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              }
            ]
          },
          {
            label: 'Register',
            childItems: [
              { label: 'Register v1', href: '/pages/auth/register', target: '_blank' },
              {
                label: 'Register v2',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/register-v2',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              },
              {
                label: 'Register v3',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/register-v3',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              }
            ]
          },
          {
            label: 'Forgot Password',
            childItems: [
              { label: 'Forgot Password v1', href: '/pages/auth/forgot-password', target: '_blank' },
              {
                label: 'Forgot Password v2',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/forgot-password-v2',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              },
              {
                label: 'Forgot Password v3',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/forgot-password-v3',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              }
            ]
          },
          {
            label: 'Verify Email',
            childItems: [
              { label: 'Verify Email v1', href: '/pages/auth/verify-email', target: '_blank' },
              {
                label: 'Verify Email v2',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/verify-email-v2',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              },
              {
                label: 'Verify Email v3',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/verify-email-v3',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              }
            ]
          },
          {
            label: 'Reset Password',
            childItems: [
              { label: 'Reset Password v1', href: '/pages/auth/reset-password', target: '_blank' },
              {
                label: 'Reset Password v2',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/reset-password-v2',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              },
              {
                label: 'Reset Password v3',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/reset-password-v3',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              }
            ]
          },
          {
            label: 'Two Steps',
            childItems: [
              { label: 'Two Steps v1', href: '/pages/auth/two-steps', target: '_blank' },
              {
                label: 'Two Steps v2',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/two-steps-v2',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              },
              {
                label: 'Two Steps v3',
                href: 'https://shadcn-nextjs-admincn-admin-template.vercel.app/pages/auth/two-steps-v3',
                target: '_blank',

                ////badge: 'Pro',
                badgeClassName: 'right-8'
              }
            ]
          }
        ]
      },

    ]
  },

  {
    groupLabel: 'Support',
    items: [
      {
        icon: 'Settings',
        label: 'Settings',
        childItems: [
          {
            label: 'Menu Item ',
            href: '#'
          },
        ]
      },

      {
        icon: 'BookOpenTextIcon',
        label: 'Documentation',
        href: 'https://shadcnstudio.com/docs/documentation-admin/getting-started',
        target: '_blank'
      }
    ]
  }
]
