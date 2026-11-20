import { Contact } from "@/components/contact/contact";
import { Engineer } from "@/components/engineer/engineer";
import { Hero } from "@/components/hero/hero";
import { Intelligence } from "@/components/intelligence/intelligence";
import { Lab } from "@/components/lab/lab";
import { Philosophy } from "@/components/philosophy/philosophy";
import { Systems } from "@/components/systems/systems";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Engineer />
      <Systems />
      <Philosophy />
      <Intelligence />
      <Lab />
      <Contact />
    </main>
  );
}
