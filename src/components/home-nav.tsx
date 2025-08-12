import {Monoton} from 'next/font/google'
import { UserButton } from '@clerk/clerk-react'
import { PlaceholdersAndVanishInput } from '@/components/placeholders-and-vanish-input'
import { ModeToggle } from './themeToogle'
const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-monoton',
})

function HomeNav() {
  return (
         <nav className='flex items-center justify-between w-full px-4 py-3'>
           <div>
             <h1 className={`${monoton.variable} text-3xl `}>Formi</h1>
           </div>
           <div className='flex-1 max-w-md mx-auto'>
             <PlaceholdersAndVanishInput placeholders={["Search your forms"]} onChange={(e) => {}} onSubmit={(e) => {}}/>
              
           </div>
           <div className='flex items-center gap-4'>
             {/* profile */}
             <ModeToggle/>
             <UserButton/>
           </div>
         </nav>
  )
}

export default HomeNav