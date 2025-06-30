import Layout from "@/components/layout";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import Cta from "@/components/cta";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Cta />
      <Footer />
    </Layout>
  );
}
