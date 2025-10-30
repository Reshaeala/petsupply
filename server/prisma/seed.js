import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.inventoryAdjustment.deleteMany();
  await prisma.paymentAttempt.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      { email: "admin@naijapet.com", role: "SUPER_ADMIN" },
      { email: "stock@naijapet.com", role: "STOCK_PERSON" },
    ],
    skipDuplicates: true,
  });
  const speciesCats = [
    { name: "Dog", slug: "dog" },
    { name: "Cat", slug: "cat" },
    { name: "Bird", slug: "bird" },
  ];
  const dogCats = [
    { name: "Dog Food", slug: "dog-food" },
    { name: "Dog Treats", slug: "dog-treats" },
    { name: "Dog Toys", slug: "dog-toys" },
    { name: "Dog Grooming", slug: "dog-grooming" },
    { name: "Dog Flea & Tick", slug: "dog-flea-tick" },
  ];
  const catCats = [
    { name: "Cat Food", slug: "cat-food" },
    { name: "Cat Treats", slug: "cat-treats" },
    { name: "Cat Toys", slug: "cat-toys" },
    { name: "Cat Litter", slug: "cat-litter" },
    { name: "Cat Flea & Tick", slug: "cat-flea-tick" },
  ];
  const birdCats = [
    { name: "Bird Food", slug: "bird-food" },
    { name: "Bird Treats", slug: "bird-treats" },
    { name: "Bird Toys", slug: "bird-toys" },
    { name: "Bird Cages", slug: "bird-cages" },
    { name: "Bird Flea & Tick", slug: "bird-flea-tick" },
  ];
  await prisma.category.createMany({
    data: [...speciesCats, ...dogCats, ...catCats, ...birdCats],
    skipDuplicates: true,
  });
  const all = await prisma.category.findMany({});
  const idBySlug = Object.fromEntries(all.map((c) => [c.slug, c.id]));
  const toNGN = (usd) => Math.round(usd * 1600);
  const DOG_IMG =
    "https://www.petsense.com/cdn/shop/products/30780-1613060731_1b8fcfc7-7cb2-4dad-ab0a-c2e69a60cfe6_2000x.png?v=1739291836";
  const CAT_IMG =
    "https://target.scene7.com/is/image/Target/GUEST_1655bbe0-ec99-4063-b0c8-87f2a46da6ad?wid=300&hei=300&fmt=pjpeg";
  const BIRD_IMG =
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ3UcS3SLnM-oreBb4evolp_ANmmR_0EdfbR4wIyyzBB9khJ_72MkFEAIqCnQ-L5ETNvUa8to3GtNohpHxoo7EzSejC1-qmp9ydAJoukg1CGInENHK_deaD3A";
  const FLEA_TICK_IMG =
    "https://i5.walmartimages.com/seo/Hartz-UltraGuard-Topical-Flea-and-Tick-Prevention-Treatment-for-Cats-Kittens-3-Treatments_43f6bd94-ce69-46ab-b166-e02e21598ee0.bacb6cc37daa87df20e86a6a3407e9ee.jpeg?odnHeight=573&odnWidth=573&odnBg=FFFFFF";
  const dogBrands = [
    "Purina Pro Plan",
    "Blue Buffalo",
    "Hill's Science Diet",
    "Royal Canin",
    "Iams",
    "Pedigree",
  ];
  const catBrands = [
    "Purina ONE",
    "Blue Buffalo Wilderness",
    "Hill's Science Diet",
    "Royal Canin",
    "Iams",
    "Sheba",
  ];
  const birdBrands = [
    "Kaytee",
    "Harrison's",
    "Prevue Hendryx",
    "ZuPreem",
    "Lafeber",
    "Vitakraft",
  ];
  const dogFoods = [
    "Adult",
    "Puppy",
    "Large Breed",
    "Small Breed",
    "Sensitive Skin",
    "Weight Control",
  ];
  const dogFlavors = [
    "Chicken & Rice",
    "Beef & Brown Rice",
    "Lamb & Oatmeal",
    "Salmon & Rice",
    "Turkey & Sweet Potato",
  ];
  const catLines = [
    "Indoor",
    "Adult",
    "Kitten",
    "Hairball Control",
    "Sensitive Stomach",
    "Weight Control",
  ];
  const catFlavors = [
    "Chicken",
    "Salmon",
    "Tuna",
    "Turkey",
    "Whitefish",
    "Chicken & Rice",
  ];
  const foodUSD = [22.99, 27.99, 34.99, 39.99, 44.99, 49.99, 54.99, 59.99];
  const treatsUSD = [6.99, 8.99, 10.99, 12.99, 14.99, 16.99];
  const toysUSD = [7.99, 9.99, 12.49, 14.99, 19.99, 24.99];
  const litterUSD = [9.99, 12.49, 14.99, 17.99, 19.99, 22.99];
  const cagesUSD = [39.99, 59.99, 79.99, 99.99, 129.99];
  const fleaUSD = [14.99, 19.99, 24.99, 29.99, 34.99];
  const sku = (prefix, slug, i) =>
    `${prefix}-${slug.toUpperCase().replace(/-/g, "_")}-${String(i).padStart(
      3,
      "0"
    )}`;
  const cycle = (arr, i) => arr[(i - 1) % arr.length];
  function makeDog(i) {
    const slugs = [
      "dog-food",
      "dog-treats",
      "dog-toys",
      "dog-grooming",
      "dog-flea-tick",
    ];
    const s = cycle(slugs, i);
    const brand = dogBrands[i % dogBrands.length];
    const names = {
      "dog-food": () => {
        const line = dogFoods[i % dogFoods.length];
        const flavor = dogFlavors[i % dogFlavors.length];
        return [
          `${brand} ${line} ${flavor} Dry Dog Food`,
          foodUSD[i % foodUSD.length],
          "Balanced formula.",
        ];
      },
      "dog-treats": () => [
        `${brand} Soft-Baked Dog Treats`,
        treatsUSD[i % treatsUSD.length],
        "Tasty training rewards.",
      ],
      "dog-toys": () => [
        `${brand} Durable Chew Toy`,
        toysUSD[i % toysUSD.length],
        "Interactive play.",
      ],
      "dog-grooming": () => [
        `${brand} Gentle Dog Shampoo`,
        litterUSD[i % litterUSD.length],
        "Cleans and conditions.",
      ],
      "dog-flea-tick": () => [
        `${brand} Flea & Tick Topical for Dogs`,
        fleaUSD[i % fleaUSD.length],
        "Topical prevention.",
      ],
    };
    const [name, usd, desc] = names[s]();
    return {
      name,
      description: desc,
      priceNaira: toNGN(usd),
      imageUrl: s === "dog-flea-tick" ? FLEA_TICK_IMG : DOG_IMG,
      brand,
      sku: sku("DOG", s, i),
      stock: 40 + (i % 60),
      species: "dog",
      categoryId: idBySlug[s],
    };
  }
  function makeCat(i) {
    const slugs = [
      "cat-food",
      "cat-treats",
      "cat-toys",
      "cat-litter",
      "cat-flea-tick",
    ];
    const s = cycle(slugs, i);
    const brand = catBrands[i % catBrands.length];
    const names = {
      "cat-food": () => {
        const line = catLines[i % catLines.length];
        const flavor = catFlavors[i % catFlavors.length];
        return [
          `${brand} ${line} ${flavor} Cat Food`,
          foodUSD[i % foodUSD.length],
          "High-protein formula.",
        ];
      },
      "cat-treats": () => [
        `${brand} Crunchy Cat Treats`,
        treatsUSD[i % treatsUSD.length],
        "Bite-size treats.",
      ],
      "cat-toys": () => [
        `${brand} Feather Teaser Toy`,
        toysUSD[i % toysUSD.length],
        "Interactive play.",
      ],
      "cat-litter": () => [
        `${brand} Clumping Cat Litter`,
        litterUSD[i % litterUSD.length],
        "Odor control.",
      ],
      "cat-flea-tick": () => [
        `${brand} Flea & Tick Topical for Cats`,
        fleaUSD[i % fleaUSD.length],
        "Topical prevention.",
      ],
    };
    const [name, usd, desc] = names[s]();
    return {
      name,
      description: desc,
      priceNaira: toNGN(usd),
      imageUrl: s === "cat-flea-tick" ? FLEA_TICK_IMG : CAT_IMG,
      brand,
      sku: sku("CAT", s, i),
      stock: 35 + (i % 50),
      species: "cat",
      categoryId: idBySlug[s],
    };
  }
  function makeBird(i) {
    const slugs = [
      "bird-food",
      "bird-treats",
      "bird-toys",
      "bird-cages",
      "bird-flea-tick",
    ];
    const s = cycle(slugs, i);
    const brand = birdBrands[i % birdBrands.length];
    let name, usd, desc;
    if (s === "bird-food") {
      const type = [
        "Parakeet",
        "Cockatiel",
        "Parrot",
        "Finch",
        "Canary",
        "Lovebird",
      ][i % 6];
      name = `${brand} ${type} Seed Mix`;
      usd = foodUSD[i % foodUSD.length] * 0.6;
      desc = `Fortified seed mix for ${type.toLowerCase()}s.`;
    } else if (s === "bird-treats") {
      name = `${brand} Honey Treat Sticks`;
      usd = treatsUSD[i % treatsUSD.length] * 0.6;
      desc = "Crunchy treat sticks.";
    } else if (s === "bird-toys") {
      name = `${brand} Foraging Bird Toy`;
      usd = toysUSD[i % toysUSD.length] * 0.7;
      desc = "Stimulating toy.";
    } else if (s === "bird-cages") {
      name = `${brand} Easy-Clean Flight Cage`;
      usd = cagesUSD[i % cagesUSD.length];
      desc = "Spacious cage.";
    } else {
      name = `${brand} Flea & Tick Care for Birds`;
      usd = fleaUSD[i % fleaUSD.length] * 0.8;
      desc = "Parasite care.";
    }
    return {
      name,
      description: desc,
      priceNaira: toNGN(usd),
      imageUrl: s === "bird-flea-tick" ? FLEA_TICK_IMG : BIRD_IMG,
      brand,
      sku: sku("BIRD", s, i),
      stock: 20 + (i % 40),
      species: "bird",
      categoryId: idBySlug[s],
    };
  }
  const dogs = Array.from({ length: 20 }, (_, i) => makeDog(i + 1));
  const cats = Array.from({ length: 20 }, (_, i) => makeCat(i + 1));
  const birds = Array.from({ length: 20 }, (_, i) => makeBird(i + 1));
  await prisma.product.createMany({ data: [...dogs, ...cats, ...birds] });
  console.log("✅ Seed complete: users + 60 products in NGN.");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
