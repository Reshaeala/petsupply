import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ---- Clean database (order matters for FKs) ----
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // ---- Categories ----
  // Top-level species
  const speciesCats = [
    { name: "Dog", slug: "dog" },
    { name: "Cat", slug: "cat" },
    { name: "Bird", slug: "bird" },
  ];

  // 5 per species (includes Flea & Tick)
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
  });

  // Map slugs -> ids
  const allCats = await prisma.category.findMany({
    where: {
      slug: {
        in: [
          "dog",
          "cat",
          "bird",
          "dog-food",
          "dog-treats",
          "dog-toys",
          "dog-grooming",
          "dog-flea-tick",
          "cat-food",
          "cat-treats",
          "cat-toys",
          "cat-litter",
          "cat-flea-tick",
          "bird-food",
          "bird-treats",
          "bird-toys",
          "bird-cages",
          "bird-flea-tick",
        ],
      },
    },
  });
  const catIdBySlug = Object.fromEntries(allCats.map((c) => [c.slug, c.id]));

  // ---- Helpers ----
  const toNGN = (usd) => Math.round(usd * 1600);

  const DOG_IMG =
    "https://www.petsense.com/cdn/shop/products/30780-1613060731_1b8fcfc7-7cb2-4dad-ab0a-c2e69a60cfe6_2000x.png?v=1739291836";
  const CAT_IMG =
    "https://target.scene7.com/is/image/Target/GUEST_1655bbe0-ec99-4063-b0c8-87f2a46da6ad?wid=300&hei=300&fmt=pjpeg";
  const BIRD_IMG =
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ3UcS3SLnM-oreBb4evolp_ANmmR_0EdfbR4wIyyzBB9khJ_72MkFEAIqCnQ-L5ETNvUa8to3GtNohpHxoo7EzSejC1-qmp9ydAJoukg1CGInENHK_deaD3A";
  const FLEA_TICK_IMG =
    "https://i5.walmartimages.com/seo/Hartz-UltraGuard-Topical-Flea-and-Tick-Prevention-Treatment-for-Cats-Kittens-3-Treatments_43f6bd94-ce69-46ab-b166-e02e21598ee0.bacb6cc37daa87df20e86a6a3407e9ee.jpeg?odnHeight=573&odnWidth=573&odnBg=FFFFFF";

  // Brand pools
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

  // Name bits
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
  const birdTypes = [
    "Parakeet",
    "Cockatiel",
    "Parrot",
    "Finch",
    "Canary",
    "Lovebird",
  ];

  // USD bases per category
  const foodUSD = [22.99, 27.99, 34.99, 39.99, 44.99, 49.99, 54.99, 59.99];
  const treatsUSD = [6.99, 8.99, 10.99, 12.99, 14.99, 16.99];
  const toysUSD = [7.99, 9.99, 12.49, 14.99, 19.99, 24.99];
  const groomUSD = [5.99, 7.99, 11.99, 13.99, 15.99, 18.99];
  const litterUSD = [9.99, 12.49, 14.99, 17.99, 19.99, 22.99];
  const cagesUSD = [39.99, 59.99, 79.99, 99.99, 129.99];
  const healthUSD = [8.99, 12.99, 16.99, 19.99, 24.99, 29.99];
  const fleaUSD = [14.99, 19.99, 24.99, 29.99, 34.99];

  // SKU helper
  const sku = (prefix, catSlug, i) =>
    `${prefix}-${catSlug.toUpperCase().replace(/-/g, "_")}-${String(i).padStart(
      3,
      "0"
    )}`;

  // Cycle helper across 5 categories for a species
  const cycle = (arr, i) => arr[(i - 1) % arr.length];

  // ---- Builders (4 items per each of the 5 categories = 20 per species) ----
  const buildDog = (i) => {
    const dogCategorySlugs = [
      "dog-food",
      "dog-treats",
      "dog-toys",
      "dog-grooming",
      "dog-flea-tick",
    ];
    const catSlug = cycle(dogCategorySlugs, i);
    const vendor = dogBrands[i % dogBrands.length];

    let name,
      usd,
      img = DOG_IMG,
      description;
    switch (catSlug) {
      case "dog-food": {
        const line = dogFoods[i % dogFoods.length];
        const flavor = dogFlavors[i % dogFlavors.length];
        name = `${vendor} ${line} ${flavor} Dry Dog Food`;
        usd = foodUSD[i % foodUSD.length];
        description = `Balanced ${line.toLowerCase()} formula with ${flavor.toLowerCase()}.`;
        break;
      }
      case "dog-treats": {
        name = `${vendor} Soft-Baked Dog Treats`;
        usd = treatsUSD[i % treatsUSD.length];
        description = "Tasty training rewards made with quality ingredients.";
        break;
      }
      case "dog-toys": {
        name = `${vendor} Durable Chew Toy`;
        usd = toysUSD[i % toysUSD.length];
        description = "Tough chew toy for interactive play.";
        break;
      }
      case "dog-grooming": {
        name = `${vendor} Gentle Dog Shampoo`;
        usd = groomUSD[i % groomUSD.length];
        description = "Cleans and conditions coat; gentle on skin.";
        break;
      }
      case "dog-flea-tick": {
        name = `${vendor} Flea & Tick Topical for Dogs`;
        usd = fleaUSD[i % fleaUSD.length];
        img = FLEA_TICK_IMG;
        description =
          "Topical prevention to help protect against fleas & ticks.";
        break;
      }
    }

    return {
      name,
      description,
      price: toNGN(usd),
      imageUrl: img,
      vendor,
      sku: sku("DOG", catSlug, i),
      stock: 40 + (i % 60),
      species: "dog",
      categoryId: catIdBySlug[catSlug],
    };
  };

  const buildCat = (i) => {
    const catCategorySlugs = [
      "cat-food",
      "cat-treats",
      "cat-toys",
      "cat-litter",
      "cat-flea-tick",
    ];
    const catSlug = cycle(catCategorySlugs, i);
    const vendor = catBrands[i % catBrands.length];

    let name,
      usd,
      img = CAT_IMG,
      description;
    switch (catSlug) {
      case "cat-food": {
        const line = catLines[i % catLines.length];
        const flavor = catFlavors[i % catFlavors.length];
        name = `${vendor} ${line} ${flavor} Cat Food`;
        usd = foodUSD[i % foodUSD.length];
        description = `High-protein ${line.toLowerCase()} formula. Flavor: ${flavor}.`;
        break;
      }
      case "cat-treats": {
        name = `${vendor} Crunchy Cat Treats`;
        usd = treatsUSD[i % treatsUSD.length];
        description = "Irresistible bite-size treats for cats.";
        break;
      }
      case "cat-toys": {
        name = `${vendor} Feather Teaser Toy`;
        usd = toysUSD[i % toysUSD.length];
        description = "Interactive play to engage hunting instincts.";
        break;
      }
      case "cat-litter": {
        name = `${vendor} Clumping Cat Litter`;
        usd = litterUSD[i % litterUSD.length];
        description = "Low dust, strong odor control clumping litter.";
        break;
      }
      case "cat-flea-tick": {
        name = `${vendor} Flea & Tick Topical for Cats`;
        usd = fleaUSD[i % fleaUSD.length];
        img = FLEA_TICK_IMG; // your requested image
        description =
          "Topical prevention to help protect against fleas & ticks.";
        break;
      }
    }

    return {
      name,
      description,
      price: toNGN(usd),
      imageUrl: img,
      vendor,
      sku: sku("CAT", catSlug, i),
      stock: 35 + (i % 50),
      species: "cat",
      categoryId: catIdBySlug[catSlug],
    };
  };

  const buildBird = (i) => {
    const birdCategorySlugs = [
      "bird-food",
      "bird-treats",
      "bird-toys",
      "bird-cages",
      "bird-flea-tick",
    ];
    const catSlug = cycle(birdCategorySlugs, i);
    const vendor = birdBrands[i % birdBrands.length];

    let name,
      usd,
      img = BIRD_IMG,
      description;
    switch (catSlug) {
      case "bird-food": {
        const type = birdTypes[i % birdTypes.length];
        name = `${vendor} ${type} Seed Mix`;
        usd = foodUSD[i % foodUSD.length] * 0.6; // birds cheaper
        description = `Fortified seed mix suitable for ${type.toLowerCase()}s.`;
        break;
      }
      case "bird-treats": {
        name = `${vendor} Honey Treat Sticks`;
        usd = treatsUSD[i % treatsUSD.length] * 0.6;
        description = "Crunchy treat sticks to reward and engage.";
        break;
      }
      case "bird-toys": {
        name = `${vendor} Foraging Bird Toy`;
        usd = toysUSD[i % toysUSD.length] * 0.7;
        description = "Stimulating toy that encourages natural behaviors.";
        break;
      }
      case "bird-cages": {
        name = `${vendor} Easy-Clean Flight Cage`;
        usd = cagesUSD[i % cagesUSD.length];
        description = "Spacious cage with easy-clean tray.";
        break;
      }
      case "bird-flea-tick": {
        // Included per your “5 per species” requirement for consistency
        name = `${vendor} Flea & Tick Care for Birds`;
        usd = fleaUSD[i % fleaUSD.length] * 0.8;
        img = FLEA_TICK_IMG;
        description = "Care product related to parasite protection.";
        break;
      }
    }

    return {
      name,
      description,
      price: toNGN(usd),
      imageUrl: img,
      vendor,
      sku: sku("BIRD", catSlug, i),
      stock: 20 + (i % 40),
      species: "bird",
      categoryId: catIdBySlug[catSlug],
    };
  };

  // ---- Generate 20 per species (total 60) ----
  const dogs = Array.from({ length: 20 }, (_, idx) => buildDog(idx + 1));
  const cats = Array.from({ length: 20 }, (_, idx) => buildCat(idx + 1));
  const birds = Array.from({ length: 20 }, (_, idx) => buildBird(idx + 1));

  await prisma.product.createMany({ data: [...dogs, ...cats, ...birds] });

  console.log(
    "✅ Seed complete: 60 products, 5 categories per species (incl. Flea & Tick), NGN prices."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
