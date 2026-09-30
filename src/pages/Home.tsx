import Loader from "@/components/Loader";
import Navbar from "@/common/Navbar";
import Hero from "@/sections/Hero";
import WarriorToken from "@/sections/WarriorToken";
import ThirdSection from "@/sections/Thirdsection";
import Blog from "@/sections/Blog";
import Avtar from "@/sections/Avtar";
import HowWeDo from "@/sections/HowWeDo";

export default function Home() {
  return (
    <div>
      <Loader />
      <Navbar />
      <Hero />
      <WarriorToken />
      <ThirdSection />
      <Blog />
      <Avtar />
      <HowWeDo />
    </div>
  );
}
