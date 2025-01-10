import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth';

export function Navbar() {
  const { user } = useUser();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-black">Expert 8</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}