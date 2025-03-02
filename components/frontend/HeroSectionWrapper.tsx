import { getKitUsers } from "@/actions/users";
import HeroSection from "./hero-section";

export default async function HeroSectionWrapper() {
  const count = (await getKitUsers()) ?? 0;
  return <HeroSection count={count} />; 
}
