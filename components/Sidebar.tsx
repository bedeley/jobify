'use client'
import Link from "next/link";
import Logo from "../assets/logo.svg";
import links from "../utils/links";
import Image from "next/image";
import { Button } from "./ui/button";
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathName = usePathname()

  return (
    <aside className="py-4 px-8 bg-muted h-full">
      <Image src={Logo} alt="logo" className="mx-auto" />
      <div className="flex flex-col mt-20 gap-y-4">
        {links.map((link) => {
          const { href, label, icon } = link;
          return (
            <Button asChild key={href} variant={pathName === href? 'default': 'link'}>
              <Link href={href} className="flex flex-row gap-2 items-center">
                {icon} <span className="capitalize">{label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </aside>
  );
};
export default Sidebar;
