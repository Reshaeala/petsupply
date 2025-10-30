import { useNavigate } from "react-router-dom";
import HeroBanner from "@/components/HeroBanner";
import GreetingBar from "@/components/GreetingBar";
import AnimalSelector from "@/components/AnimalSelector";
import PopularCategoryIcons from "@/components/PopularCategoryIcons";
import PromoBanner from "@/components/PromoBanner";

export default function LandingPage() {
  const nav = useNavigate();

  const animals = [
    {
      name: "Dog",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
      value: "dog",
    },
    {
      name: "Cat",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
      value: "cat",
    },
    {
      name: "Bird",
      image:
        "https://cms.bbcearth.com/sites/default/files/inline-images/parakeet-jayanth-muppaneni-unsplash-W-fWLDNdKAw.jpg",
      value: "bird",
    },
  ];

  const popular = [
    { name: "Dog Food", onClick: () => nav("/category/dog-food") },
    { name: "Dog Treats", onClick: () => nav("/category/dog-treats") },
    {
      name: "Dog Flea & Tick",
      onClick: () => nav("/category/dog-flea-tick"),
    },
    { name: "Cat Food", onClick: () => nav("/category/cat-food") },
    { name: "Cat Litter", onClick: () => nav("/category/cat-litter") },
    // { name: "Deals", onClick: () => nav("/category/deals") },
  ];

  return (
    <div className="grid gap-6">
      <HeroBanner onClick={() => nav("/shop")} />
      <GreetingBar />
      <AnimalSelector
        items={animals}
        onItemClick={(item) =>
          nav(`/species/${(item.value ?? "").toLowerCase()}`)
        }
      />
      <PopularCategoryIcons items={popular} />
      {/* <PromoBanner /> */}
    </div>
  );
}
