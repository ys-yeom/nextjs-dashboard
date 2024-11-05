'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
//import { useState } from 'react';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  //const [index, setIndex] = useState(0);

  
  console.log(pathname);
  

  return (
    <>
      {links.map((link, i) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'bg-[#f9fafb] rounded-md flex h-[48px] items-center px-3 gap-2 text-[14px] hover:bg-[#e0f2fe] hover:text-[#2f6feb] sm:flex-grow sm:justify-center',
              {'bg-[#e0f2fe] text-[#2f6feb]' : pathname === link.href}
              //{'bg-[#e0f2fe] text-[#2f6feb]' : index === i}
            )}
            //onClick={()=> setIndex(i)}
          >
            <LinkIcon className="w-6" />
            <p className="sm:hidden">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
