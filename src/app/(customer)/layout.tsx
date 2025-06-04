import Link from 'next/link'
import CartIcon from '@/components/features/cart/CartIcon'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="font-medium">Maison by K</Link>
        <CartIcon />
      </header>
      <main>{children}</main>
    </div>
  )
}
