import V9Sustainability from "./src/components/v9/MirorV9Sustainability";
import V9People from "./src/components/v9/MirorV9People";
import V9Leadership from "./src/components/v9/MirorV9Leadership";
import V9Careers from "./src/components/v9/MirorV9Careers";
import V9ClientsPartners from "./src/components/v9/MirorV9ClientsPartners";
import V9Locations from "./src/components/v9/MirorV9Locations";
import V9Insights from "./src/components/v9/MirorV9Insights";
import V9Resources from "./src/components/v9/MirorV9Resources";
import V9WhyMiror from "./src/components/v9/MirorV9WhyMiror";
import V9Faq from "./src/components/v9/MirorV9Faq";
import V9Contact from "./src/components/v9/MirorV9Contact";
import V9SmartContact from "./src/components/v9/MirorV9SmartContact";
import V9Menu from "./src/components/v9/MirorV9Menu";
import "./src/styles/miror-v9-sections.css";

export default function MirorV9CorporateLayer() {
  return (
    <>
      <V9Menu />
      <main>
        <V9Sustainability />
        <V9People />
        <V9Leadership />
        <V9Careers />
        <V9ClientsPartners />
        <V9Locations />
        <V9Insights />
        <V9Resources />
        <V9WhyMiror />
        <V9Faq />
        <V9Contact />
        <V9SmartContact />
      </main>
    </>
  );
}
