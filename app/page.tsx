import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "../assets/logo.svg";
import LandingImg from "@/assets/main.svg";
import Link from "next/link";


export default function page() {
  return (
    <main className="max-w-6xl">
      <header className=" mx-auto px-4 sm:px-8 py-6">
        <Image src={Logo} alt="logo" />
      </header>
      <section className=" mx-auto px-4 sm:px-8 h-screen -mt-20 grid lg:grid-cols-2 items-center">
        <div>
          <h1 className="capitalize text-4xl md:text-7xl font-bold">
            job<span className="text-primary"> tracking</span> app
          </h1>
          <p className="leading-loose max-w-md mt-4 ">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil
            ratione porro perferendis repudiandae magnam enim possimus
            architecto vero laborum? Voluptatum, sit eum fugit eius eos natus
            velit quidem reiciendis fugiat.
          </p>
          <Button variant="default" asChild className="mt-4 capitalize">
            <Link href="/add-job">
              get started
            </Link>
          </Button>
        </div>
        <div>
          <Image src={LandingImg} alt="image" className="hidden lg:block" />
        </div>
      </section>
    </main>
  );
}
