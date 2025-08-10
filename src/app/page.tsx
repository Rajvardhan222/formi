import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold">Welcome to Formi</h1>
      <p className="mt-4">Your one-stop solution for all forms management.</p>
      <Image src="/images/hero.png" alt="Hero Image" width={500} height={300} />
    </>
  );
}
