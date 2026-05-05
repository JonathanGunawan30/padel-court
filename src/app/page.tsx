import Header from "@/components/organisms/header/Header";
import Banner from "@/components/organisms/header/Banner";
import Facility from "@/components/organisms/facility/Facility";
import Gallery from "@/components/organisms/gallery/Gallery";
import FieldList from "@/components/organisms/field-list/FieldList";
import FeatureStrip from "@/components/organisms/feature-strip/FeatureStrip";
import Footer from "@/components/organisms/footer/Footer";

export default function Home() {
  return (
    <>
      <Header/>
      <Banner/>
      <FieldList/>
      <Facility/>
      <Gallery/>
      <FeatureStrip/>
      <Footer/>
    </>
  );
}
