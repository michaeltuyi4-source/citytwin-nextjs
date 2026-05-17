// CityTwin — neighborhoods.js
// Stage 1 data: manually researched, hardcoded
// Cities: Charlotte NC, Baltimore MD, Chicago IL
// Scores are 1–10. Sources: Walk Score, Niche, Apartment List, RentCafe, local guides (2024–2025)

const NEIGHBORHOODS = {

  charlotte: {
    cityName: "Charlotte, NC",
    cityNote: "Sun Belt boomtown. Car-dependent overall but pockets of strong walkability near the light rail.",
    neighborhoods: [
      {
        id: "south-end",
        name: "South End",
        tagline: "Charlotte's live-work-play hub",
        scores: {
          walkability: 8,
          transitAccess: 9,     // LYNX Blue Line light rail runs through it
          foodScene: 9,         // Breweries, restaurants dense along Rail Trail
          coffeeShops: 8,
          outdoorSpaces: 7,     // Rail Trail greenway, parks nearby
          nightlife: 9,
          familyFriendly: 5,    // Young professional skew, not quiet
          culturalDiversity: 6,
          affordability: 4,     // 1BR avg ~$2,000/mo — premium pricing
          quietResidential: 3,
        },
        rentRange: "$1,800–$2,300/mo (1BR)",
        walkScore: 82,
        highlights: [
          "LYNX Blue Line light rail — direct to Uptown in minutes",
          "Charlotte Rail Trail — 3.5 miles of greenway for walking and cycling",
          "Dense brewery and restaurant scene (NoDa Brewing, Sycamore, Free Range)",
          "Modern apartment buildings with rooftop amenities",
        ],
        gaps: [
          "Expensive — one of Charlotte's priciest rental markets",
          "Loud and busy on weekends — not for those wanting quiet",
          "Limited green space beyond the Rail Trail",
        ],
        bestFor: ["Young professionals", "Remote workers", "Social movers", "No-car lifestyle"],
        coords: { lat: 35.2076, lng: -80.8567 },
      },
      {
        id: "noda",
        name: "NoDa (North Davidson)",
        tagline: "Charlotte's arts and music district",
        scores: {
          walkability: 7,
          transitAccess: 7,     // Blue Line extension added a stop
          foodScene: 8,         // Independent restaurants, food halls
          coffeeShops: 8,       // Strong indie coffee culture
          outdoorSpaces: 5,
          nightlife: 8,         // Music venues, gallery crawls
          familyFriendly: 5,
          culturalDiversity: 7,
          affordability: 6,     // 1BR avg ~$1,775/mo — more reasonable than South End
          quietResidential: 4,
        },
        rentRange: "$1,500–$1,900/mo (1BR)",
        walkScore: 74,
        highlights: [
          "Charlotte's creative hub — murals, galleries, live music every weekend",
          "Blue Line light rail stop added in recent expansion",
          "Strong indie coffee and food scene (Smelly Cat Coffee, Haberdish)",
          "More affordable than South End while offering similar energy",
        ],
        gaps: [
          "Less polished than South End — some areas still developing",
          "Walkability drops sharply off the main strip",
          "Limited green space and parks",
        ],
        bestFor: ["Creatives", "Artists", "Music lovers", "Budget-conscious young professionals"],
        coords: { lat: 35.2368, lng: -80.8275 },
      },
      {
        id: "dilworth",
        name: "Dilworth",
        tagline: "Historic charm, walkable streets, top dining",
        scores: {
          walkability: 8,       // Walk Score 78 — Charlotte's 5th most walkable
          transitAccess: 6,
          foodScene: 8,         // 174 restaurants/bars/cafes, upscale dining
          coffeeShops: 7,
          outdoorSpaces: 8,     // Latta Park, Freedom Park nearby
          nightlife: 6,
          familyFriendly: 8,    // Historic neighborhood, community events
          culturalDiversity: 5,
          affordability: 3,     // Among Charlotte's most expensive — avg ~$1,950/mo
          quietResidential: 8,
        },
        rentRange: "$1,800–$2,200/mo (1BR)",
        walkScore: 78,
        highlights: [
          "Charlotte's first suburb (1890) — tree-lined streets, Craftsman bungalows",
          "Latta Park and Freedom Park within walking distance",
          "Strong dining scene (300 East, Sunflour Baking, Ed's Tavern)",
          "Community events year-round (Dilworth Jubilee, Home Tour)",
        ],
        gaps: [
          "Premium pricing — one of Charlotte's most expensive neighborhoods",
          "Quieter nightlife compared to South End or NoDa",
          "Car still needed for some errands",
        ],
        bestFor: ["Families", "Professionals wanting calm + access", "Dog owners", "History buffs"],
        coords: { lat: 35.2015, lng: -80.8548 },
      },
    ],
  },

  montgomery: {
    cityName: "Montgomery County, MD",
    cityNote: "DC suburb corridor along I-270. One of the most diverse counties in the US. MARC train and Metro Red Line connect to DC. Strong schools, biotech/federal job base.",
    neighborhoods: [
      {
        id: "rockville-town-center",
        name: "Rockville Town Center",
        tagline: "Montgomery County's most walkable urban core",
        scores: {
          walkability: 8,       // Best walkability in Rockville — Walk Score ~80 near Town Center
          transitAccess: 9,     // Red Line Metro station at heart of neighborhood
          foodScene: 7,         // Growing restaurant scene — Kusshi Sushi, Little Miner Taco, Fork & Kitchen
          coffeeShops: 7,       // Trader Joe's opened 2025; cafes and chains walkable
          outdoorSpaces: 6,     // Some green space, parks accessible but not abundant
          nightlife: 6,         // More dining-focused than bar scene
          familyFriendly: 7,    // MCPS schools, family amenities nearby
          culturalDiversity: 8, // One of most diverse areas in Montgomery County
          affordability: 5,     // 1BR avg ~$2,031–$2,048/mo — mid-range for area
          quietResidential: 6,
        },
        rentRange: "$1,800–$2,400/mo (1BR)",
        walkScore: 80,
        highlights: [
          "Rockville Metro Station (Red Line) — DC downtown in under 30 minutes",
          "Rockville Town Center / 'The Square' — walkable dining, retail, entertainment hub",
          "Trader Joe's opened summer 2025 — grocery shopping now fully walkable",
          "Montgomery County's highest concentration of restaurants and bars in one area",
          "Direct access to entire DC Metro system for city exploration on weekends",
        ],
        gaps: [
          "Outside Town Center core, car still needed for many errands",
          "Nightlife quieter than DC neighborhoods — more of a dinner-and-home vibe",
          "Premium rents for the area — priced above Germantown and parts of Gaithersburg",
        ],
        bestFor: ["DC commuters", "Young professionals", "Car-free or car-light movers", "Urban suburbanites"],
        coords: { lat: 39.0840, lng: -77.1528 },
      },
      {
        id: "kentlands-gaithersburg",
        name: "Kentlands, Gaithersburg",
        tagline: "America's New Urbanism model — walkable, community-first, beautifully designed",
        scores: {
          walkability: 8,       // Nationally recognized New Urbanist design — daily needs within 5–10 min walk
          transitAccess: 5,     // Bus service + MARC Brunswick Line nearby; no Metro directly
          foodScene: 7,         // Kentlands Market Square, Downtown Crown, RIO — solid suburban dining
          coffeeShops: 7,       // Whole Foods, Giant, Starbucks all walkable within neighborhood
          outdoorSpaces: 8,     // Lake Helene, Inspiration Lake, Little Quarry Park, Seneca Creek State Park nearby
          nightlife: 5,         // Quiet suburban evenings — most people drive to Rockville or Bethesda
          familyFriendly: 10,   // MCPS top-rated schools, pools, community events, design built for families
          culturalDiversity: 7, // Gaithersburg among most diverse cities in Maryland
          affordability: 6,     // More affordable than Rockville Town Center; home prices $600K–$1M+
          quietResidential: 9,  // Quiet, planned community — designed for calm suburban life
        },
        rentRange: "$1,700–$2,200/mo (1BR apt); homes $600K–$1M+",
        walkScore: 72,
        highlights: [
          "Nationally recognized New Urbanism design — walkable streets, front porches, hidden parking",
          "Lake Helene and Inspiration Lake — paved pathways, waterside walks within the neighborhood",
          "Kentlands Market Square — Whole Foods, restaurants, boutiques, movie theater all walkable",
          "Community events year-round: Kentlands 5K, Community Day, Halloween Rocks, holiday festivals",
          "MCPS schools — among the highest-rated public school districts in the nation",
          "25 minutes to downtown DC by car; MARC train option nearby",
        ],
        gaps: [
          "Transit-dependent on bus + MARC — no Metro station within the neighborhood",
          "Nightlife is minimal — evenings are quiet by design",
          "Home prices are high — ownership is expensive even by Montgomery County standards",
        ],
        bestFor: ["Families", "Community-focused movers", "Those valuing walkable suburban design", "Remote workers wanting quiet"],
        coords: { lat: 39.1290, lng: -77.2297 },
      },
      {
        id: "germantown",
        name: "Germantown",
        tagline: "Most affordable in Montgomery County — space, value, and nature access",
        scores: {
          walkability: 5,       // Mostly car-dependent; strip mall commercial corridors
          transitAccess: 5,     // MARC Germantown station; Shady Grove Metro ~9 miles south
          foodScene: 6,         // Scattered international gems — Ethiopian, Peruvian, Latin strip malls
          coffeeShops: 5,       // Chain-heavy; few independent options
          outdoorSpaces: 9,     // Seneca Creek State Park, Black Hill Regional Park, Black Rock Mill
          nightlife: 3,         // Very quiet — limited bar scene; most nightlife is further south
          familyFriendly: 9,    // MCPS schools, community centers, safe, newer homes, parks
          culturalDiversity: 9, // One of Montgomery County's most diverse communities
          affordability: 8,     // 1BR avg ~$1,739/mo — most affordable of the three
          quietResidential: 9,  // Sprawling, newer suburban homes — very quiet
        },
        rentRange: "$1,500–$2,000/mo (1BR)",
        walkScore: 46,
        highlights: [
          "Most affordable option in Montgomery County — $1,000+/mo less than Rockville in some cases",
          "Seneca Creek State Park and Black Hill Regional Park — exceptional outdoor recreation",
          "Lancaster County Dutch Market — beloved farmers market with fresh PA produce and baked goods",
          "Butler's Orchard nearby — apple/pumpkin picking, seasonal activities",
          "Black Rock Center for the Arts — free exhibits, community cultural programming",
          "Highly diverse community — strong international food culture in local strip malls",
        ],
        gaps: [
          "Car is essential — walkability among the lowest of the three",
          "I-270 commute to DC can be brutal — 45–60 minutes in peak traffic",
          "Nightlife essentially non-existent — quiet community by nature",
          "Food scene is good but scattered — requires driving to find the best spots",
        ],
        bestFor: ["Families wanting space and value", "Outdoor enthusiasts", "Those prioritizing affordability", "Remote workers needing quiet"],
        coords: { lat: 39.1732, lng: -77.2717 },
      },
    ],
  },

  chicago: {
    cityName: "Chicago, IL",
    cityNote: "America's most walkable major inland city. World-class food, strong transit, distinct neighborhood personalities.",
    neighborhoods: [
      {
        id: "wicker-park",
        name: "Wicker Park",
        tagline: "Chicago's most walkable creative neighborhood",
        scores: {
          walkability: 10,      // Walk Score 96 — one of highest in all of Chicago
          transitAccess: 9,     // CTA Blue Line, multiple bus routes
          foodScene: 9,         // Dense, diverse, acclaimed restaurant scene
          coffeeShops: 9,       // Strong indie coffee culture (The Wormhole, etc.)
          outdoorSpaces: 7,     // 606 Trail, Wicker Park itself
          nightlife: 9,
          familyFriendly: 6,
          culturalDiversity: 7,
          affordability: 5,     // 1BR avg ~$2,100–$2,400 — mid-to-high Chicago range
          quietResidential: 4,
        },
        rentRange: "$1,900–$2,500/mo (1BR)",
        walkScore: 96,
        highlights: [
          "Walk Score of 96 — second highest in all of Chicago",
          "The 606 Trail — elevated greenway for cycling and walking through the neighborhood",
          "Milwaukee and Damen Avenues — boutiques, record stores, cafes, bars",
          "CTA Blue Line — direct to downtown Loop in ~15 min",
          "Time Out named the area one of the world's coolest neighborhoods (2024)",
        ],
        gaps: [
          "Expensive by Chicago standards — premium for the lifestyle",
          "Can be noisy on weekends — active nightlife spills onto streets",
          "Parking difficult — best approached car-free",
        ],
        bestFor: ["Creatives", "Remote workers", "Foodies", "No-car lifestyle", "Young professionals"],
        coords: { lat: 41.9088, lng: -87.6788 },
      },
      {
        id: "west-loop",
        name: "West Loop",
        tagline: "Chicago's restaurant row and professional powerhouse",
        scores: {
          walkability: 9,       // Walk Score 96
          transitAccess: 9,     // CTA Blue and Green/Pink Lines
          foodScene: 10,        // Randolph Street 'Restaurant Row' — Michelin-starred dining
          coffeeShops: 8,
          outdoorSpaces: 6,     // Mary Bartelme Park, limited green space
          nightlife: 8,
          familyFriendly: 5,
          culturalDiversity: 6,
          affordability: 3,     // Avg rent $2,922 — among Chicago's most expensive
          quietResidential: 4,
        },
        rentRange: "$2,500–$3,400/mo (1BR)",
        walkScore: 96,
        highlights: [
          "Randolph Street 'Restaurant Row' — some of Chicago's best dining",
          "Fulton Market District — Google, McDonald's HQ, major employers nearby",
          "CTA Blue and Green/Pink Lines — excellent downtown access",
          "Loft conversions and high-rises with skyline views",
          "Fastest-growing and most in-demand neighborhood in Chicago",
        ],
        gaps: [
          "Most expensive neighborhood in Chicago — significant premium",
          "Less residential feel — more business/entertainment district energy",
          "Green space limited compared to lakefront neighborhoods",
        ],
        bestFor: ["Finance/tech professionals", "Foodies", "Career-focused movers", "Urbanists"],
        coords: { lat: 41.8831, lng: -87.6478 },
      },
      {
        id: "lincoln-park",
        name: "Lincoln Park",
        tagline: "Chicago's most walkable family-friendly neighborhood",
        scores: {
          walkability: 9,       // Walk Score 94 — top neighborhood in Chicago
          transitAccess: 8,     // Multiple CTA lines and bus routes
          foodScene: 9,         // 400+ restaurants within walking distance
          coffeeShops: 9,       // Every major and indie option represented
          outdoorSpaces: 10,    // Lincoln Park itself — 1,200 acres, zoo, lakefront
          nightlife: 7,
          familyFriendly: 10,   // Top-rated schools, zoo, parks — best in Chicago
          culturalDiversity: 6,
          affordability: 4,     // Premium pricing for the lifestyle
          quietResidential: 7,
        },
        rentRange: "$1,900–$2,800/mo (1BR)",
        walkScore: 94,
        highlights: [
          "Lincoln Park — 1,200-acre park with free zoo, lakefront trails, beach",
          "400+ restaurants within walking distance — every cuisine represented",
          "Top-rated public schools — best family neighborhood in Chicago",
          "Trader Joe's, Whole Foods, Mariano's all walkable",
          "DePaul University adds youthful energy; historic brownstones add character",
        ],
        gaps: [
          "Premium pricing — comparable to West Loop",
          "Can feel too polished / less gritty than Wicker Park or Logan Square",
          "High competition for housing — moves quickly on the market",
        ],
        bestFor: ["Families", "Outdoor enthusiasts", "Dog owners", "Those wanting calm + access"],
        coords: { lat: 41.9214, lng: -87.6513 },
      },
    ],
  },

  dallas: {
    cityName: "Dallas, TX",
    cityNote: "Booming Sun Belt city. Car-dependent overall but strong walkable pockets. No state income tax, major finance and tech employers.",
    neighborhoods: [
      {
        id: "uptown-dallas",
        name: "Uptown",
        tagline: "Dallas's premier live-work-play neighborhood",
        scores: {
          walkability: 8,
          transitAccess: 7,     // M-Line Trolley free along McKinney Ave
          foodScene: 9,         // Hundreds of restaurants along McKinney Ave
          coffeeShops: 8,
          outdoorSpaces: 7,     // Katy Trail 3.5 miles, Klyde Warren Park nearby
          nightlife: 9,         // Top bar and nightlife scene in Dallas
          familyFriendly: 5,
          culturalDiversity: 6,
          affordability: 4,     // 1BR avg ~$1,900–$2,200/mo
          quietResidential: 3,
        },
        rentRange: "$1,800–$2,300/mo (1BR)",
        walkScore: 82,
        highlights: [
          "Katy Trail — 3.5-mile greenway perfect for running and cycling",
          "McKinney Avenue — dense strip of restaurants, bars, and boutiques",
          "Free M-Line Trolley connecting neighborhood to downtown",
          "West Village — walkable shopping and dining destination",
          "Close to major employers in the Dallas CBD",
        ],
        gaps: [
          "One of Dallas's most expensive rental markets",
          "Very loud on weekend nights — not for quiet seekers",
          "Car still needed for most errands outside the core strip",
        ],
        bestFor: ["Young professionals", "Social movers", "Finance and tech workers", "No-car lifestyle seekers"],
        coords: { lat: 32.7983, lng: -96.8028 },
      },
      {
        id: "bishop-arts",
        name: "Bishop Arts District",
        tagline: "Dallas's most charming walkable neighborhood — indie, artsy, community-driven",
        scores: {
          walkability: 8,
          transitAccess: 6,     // Dallas Streetcar connects to downtown
          foodScene: 9,         // 60+ independent restaurants and cafes
          coffeeShops: 9,       // Strong indie coffee culture
          outdoorSpaces: 6,
          nightlife: 7,
          familyFriendly: 7,    // Strong community events, neighborhood feel
          culturalDiversity: 8, // Diverse Oak Cliff community
          affordability: 6,     // More affordable than Uptown
          quietResidential: 6,
        },
        rentRange: "$1,200–$1,800/mo (1BR)",
        walkScore: 76,
        highlights: [
          "60+ independent boutiques, galleries, and restaurants in a compact walkable district",
          "Free Dallas Streetcar connecting to downtown",
          "Strong community identity — neighborhood events year-round",
          "Lucia, Oddfellows, Eno's Pizza — acclaimed local dining",
          "Historic Craftsman bungalows and charming streetscapes",
        ],
        gaps: [
          "Car still needed for errands beyond the district",
          "Less nightlife energy than Uptown",
          "Limited direct transit connections to suburban employers",
        ],
        bestFor: ["Creatives", "Food lovers", "Community-focused movers", "Those wanting character over polish"],
        coords: { lat: 32.7487, lng: -96.8328 },
      },
      {
        id: "deep-ellum",
        name: "Deep Ellum",
        tagline: "Dallas's arts and live music heartbeat",
        scores: {
          walkability: 7,
          transitAccess: 7,     // DART Green Line station
          foodScene: 8,         // Pecan Lodge BBQ, Cane Rosso, diverse dining
          coffeeShops: 7,       // Merit Coffee, Fiction Coffee
          outdoorSpaces: 5,
          nightlife: 10,        // Best live music and bar scene in Dallas
          familyFriendly: 3,
          culturalDiversity: 7,
          affordability: 6,     // 1BR avg ~$1,500–$1,800/mo
          quietResidential: 2,
        },
        rentRange: "$1,400–$1,900/mo (1BR)",
        walkScore: 74,
        highlights: [
          "Dallas's legendary live music and arts district — murals everywhere",
          "The Bomb Factory and Trees — major concert venues",
          "Deep Ellum Brewing Company and Braindead Brewing",
          "DART Green Line — direct connection to downtown and beyond",
          "Loft apartments in converted warehouses with neighborhood character",
        ],
        gaps: [
          "Very noisy on weekends — streets packed Thursday through Sunday",
          "Not suitable for families or quiet seekers",
          "Parking extremely difficult on busy nights",
        ],
        bestFor: ["Music lovers", "Creatives", "Nightlife seekers", "Artists and musicians"],
        coords: { lat: 32.7838, lng: -96.7844 },
      },
    ],
  },

  houston: {
    cityName: "Houston, TX",
    cityNote: "America's most diverse large city. No zoning laws. Car-dependent overall but walkable pockets inside the 610 Loop. Strong energy, healthcare, and tech sectors.",
    neighborhoods: [
      {
        id: "montrose",
        name: "Montrose",
        tagline: "Houston's creative and cultural heartbeat — diverse, walkable, vibrant",
        scores: {
          walkability: 9,       // Walk Score 86 — Houston's most walkable area
          transitAccess: 7,     // METRORail nearby, multiple bus routes
          foodScene: 9,         // One of Houston's densest restaurant areas
          coffeeShops: 9,       // Strong indie coffee culture
          outdoorSpaces: 7,     // Buffalo Bayou Park, Menil Collection grounds
          nightlife: 8,         // Diverse bar scene, live music
          familyFriendly: 6,
          culturalDiversity: 9, // One of Houston's most diverse neighborhoods
          affordability: 5,     // 1BR avg ~$1,923/mo
          quietResidential: 4,
        },
        rentRange: "$1,700–$2,200/mo (1BR)",
        walkScore: 86,
        highlights: [
          "Walk Score 86 — Houston's most walkable neighborhood",
          "The Menil Collection — world-class free art museum within walking distance",
          "Rothko Chapel — iconic cultural landmark",
          "Buffalo Bayou Park — 160 acres of trails and green space nearby",
          "Poison Girl, Anvil Bar, The Hay Merchant — acclaimed nightlife",
          "Strong LGBTQ+ community and inclusive culture",
        ],
        gaps: [
          "Car still useful for errands outside the walkable core",
          "Can be noisy near nightlife strips on weekends",
          "Premium rents for Houston — among the most expensive in the city",
        ],
        bestFor: ["Creatives", "Culture lovers", "LGBTQ+ movers", "Young professionals", "Foodies"],
        coords: { lat: 29.7384, lng: -95.3950 },
      },
      {
        id: "midtown-houston",
        name: "Midtown",
        tagline: "Houston's most walkable social neighborhood — young, energetic, well-connected",
        scores: {
          walkability: 9,       // Walk Score 91 — among city's highest
          transitAccess: 8,     // METRORail Red Line runs through it
          foodScene: 8,
          coffeeShops: 7,
          outdoorSpaces: 7,     // Midtown Park, Baldwin Park
          nightlife: 9,         // Dense bar and restaurant scene
          familyFriendly: 4,
          culturalDiversity: 8,
          affordability: 6,     // 1BR avg ~$1,655/mo — more affordable than Montrose
          quietResidential: 3,
        },
        rentRange: "$1,400–$1,900/mo (1BR)",
        walkScore: 91,
        highlights: [
          "Walk Score 91 — Houston's second most walkable neighborhood",
          "METRORail Red Line — direct to downtown, Museum District, Med Center",
          "Axelrad Beer Garden and Bagby Park — neighborhood social hubs",
          "Midtown Park and Baldwin Park — green space for dog walking and relaxing",
          "Most affordable walkable option inside the Loop",
        ],
        gaps: [
          "Party-heavy on weekends — can get very rowdy",
          "Not suitable for families or those wanting quiet",
          "Traffic congestion common during events",
        ],
        bestFor: ["Young professionals", "First-time Houston movers", "Social butterflies", "Bar-hoppers"],
        coords: { lat: 29.7445, lng: -95.3740 },
      },
      {
        id: "the-heights",
        name: "The Heights",
        tagline: "Walkable, charming, community-driven — Houston's hidden gem",
        scores: {
          walkability: 7,       // Walk Score 75 — walkable for Houston
          transitAccess: 5,
          foodScene: 8,         // 19th Street — local restaurants and cafes
          coffeeShops: 8,       // Strong farmers market and indie cafe culture
          outdoorSpaces: 8,     // White Oak Bayou trail, hike and bike paths
          nightlife: 6,
          familyFriendly: 8,    // Strong community, safe streets
          culturalDiversity: 6,
          affordability: 5,     // 1BR avg ~$1,624/mo
          quietResidential: 7,
        },
        rentRange: "$1,400–$2,000/mo (1BR)",
        walkScore: 75,
        highlights: [
          "19th Street — walkable strip of local restaurants, boutiques, and coffee",
          "White Oak Bayou Trail — excellent hike and bike path",
          "Weekend farmers market and strong community events",
          "Historic bungalows and townhomes with neighborhood character",
          "One of Houston's safest and most community-oriented neighborhoods",
        ],
        gaps: [
          "Car needed for most major errands",
          "Traffic on 19th Street can be frustrating",
          "Fewer transit options than Midtown or Montrose",
        ],
        bestFor: ["Families", "Community-focused movers", "Dog owners", "Those wanting calm + access"],
        coords: { lat: 29.7990, lng: -95.3985 },
      },
    ],
  },

  seattle: {
    cityName: "Seattle, WA",
    cityNote: "9th most walkable large US city. Tech hub — Amazon, Microsoft, Google nearby. Mountains, water, and outdoor culture define the lifestyle.",
    neighborhoods: [
      {
        id: "capitol-hill-seattle",
        name: "Capitol Hill",
        tagline: "Seattle's most vibrant neighborhood — walkable, diverse, endlessly interesting",
        scores: {
          walkability: 9,       // Walk Score 93
          transitAccess: 9,     // Light rail station, multiple bus routes
          foodScene: 9,         // One of Seattle's densest dining scenes
          coffeeShops: 10,      // Coffee capital of America — indie and chain
          outdoorSpaces: 8,     // Cal Anderson Park, Volunteer Park, Interlaken Park
          nightlife: 9,         // Best bar and club scene in Seattle
          familyFriendly: 5,
          culturalDiversity: 8, // Strong LGBTQ+ community, diverse residents
          affordability: 4,     // 1BR avg ~$2,200–$2,600/mo — expensive
          quietResidential: 3,
        },
        rentRange: "$2,000–$2,700/mo (1BR)",
        walkScore: 93,
        highlights: [
          "Walk Score 93 — everything within a mile radius",
          "Cal Anderson Park — neighborhood hub for community and recreation",
          "Light rail Capitol Hill Station — direct to downtown and airport",
          "Pike/Pine corridor — bars, coffee, bookstores, music venues",
          "Strong LGBTQ+ culture and inclusive community",
          "Volunteer Park — 48 acres with Seattle Asian Art Museum",
        ],
        gaps: [
          "Among Seattle's most expensive neighborhoods",
          "Very active nightlife — noise on weekends unavoidable",
          "Finding parking is nearly impossible",
        ],
        bestFor: ["Young professionals", "LGBTQ+ movers", "Nightlife seekers", "Culture lovers", "No-car lifestyle"],
        coords: { lat: 47.6254, lng: -122.3197 },
      },
      {
        id: "ballard",
        name: "Ballard",
        tagline: "Scandinavian roots, craft breweries, waterfront charm — Seattle's laid-back best",
        scores: {
          walkability: 7,       // Walk Score 74
          transitAccess: 6,
          foodScene: 9,         // Excellent restaurant and brewery scene
          coffeeShops: 8,
          outdoorSpaces: 9,     // Ballard Locks, Golden Gardens beach, Burke-Gilman Trail
          nightlife: 7,         // Solid brewery and bar scene
          familyFriendly: 7,
          culturalDiversity: 6,
          affordability: 5,     // 1BR avg ~$1,800–$2,200/mo — mid-range Seattle
          quietResidential: 6,
        },
        rentRange: "$1,700–$2,300/mo (1BR)",
        walkScore: 74,
        highlights: [
          "Ballard Locks — salmon runs, boats, waterfront walks",
          "Golden Gardens Park — beach access and mountain views",
          "Burke-Gilman Trail — excellent cycling connecting to UW and beyond",
          "Ballard Avenue — excellent local dining, breweries, weekend market",
          "More affordable than Capitol Hill or South Lake Union",
        ],
        gaps: [
          "No light rail yet — bus dependent for transit",
          "Car still needed for some errands",
          "Can feel isolated from rest of city without direct rail",
        ],
        bestFor: ["Outdoor enthusiasts", "Families", "Brewery lovers", "Those wanting character and calm"],
        coords: { lat: 47.6681, lng: -122.3836 },
      },
      {
        id: "fremont-seattle",
        name: "Fremont",
        tagline: "Quirky, creative, community-driven — the center of the universe",
        scores: {
          walkability: 8,       // Walk Score 88
          transitAccess: 7,
          foodScene: 8,         // Diverse local dining scene
          coffeeShops: 9,       // Excellent indie coffee culture
          outdoorSpaces: 8,     // Burke-Gilman Trail, Gas Works Park nearby
          nightlife: 7,
          familyFriendly: 7,
          culturalDiversity: 7,
          affordability: 5,
          quietResidential: 6,
        },
        rentRange: "$1,800–$2,400/mo (1BR)",
        walkScore: 88,
        highlights: [
          "Burke-Gilman Trail — directly accessible for cycling and walking",
          "Gas Works Park — iconic Seattle park with lake and skyline views",
          "Fremont Sunday Market — beloved weekly outdoor market",
          "Fremont Troll and public art — quirky neighborhood identity",
          "Close to Amazon and South Lake Union tech corridor",
        ],
        gaps: [
          "Pricier than Ballard for similar vibe",
          "Traffic can be significant on the main bridge",
          "Less direct transit to downtown than Capitol Hill",
        ],
        bestFor: ["Tech workers", "Creatives", "Outdoor enthusiasts", "Community seekers"],
        coords: { lat: 47.6508, lng: -122.3499 },
      },
    ],
  },

  phoenix: {
    cityName: "Phoenix, AZ",
    cityNote: "Sun Belt growth city. Car-dependent overall but downtown and Midtown are increasingly walkable. Year-round sunshine and desert outdoor culture.",
    neighborhoods: [
      {
        id: "downtown-phoenix",
        name: "Downtown Phoenix",
        tagline: "Phoenix's urban core — walkable, growing fast, connected by light rail",
        scores: {
          walkability: 9,       // Walk Score 82-97 depending on exact location
          transitAccess: 8,     // Valley Metro light rail hub
          foodScene: 8,         // Growing restaurant and food hall scene
          coffeeShops: 7,       // Cactus Cloud Cafe, local options
          outdoorSpaces: 6,     // Desert Botanical Garden nearby, some parks
          nightlife: 8,         // Valley Bar, live music, growing scene
          familyFriendly: 5,
          culturalDiversity: 8, // Downtown Phoenix is diverse
          affordability: 6,     // 1BR avg ~$1,500–$1,825/mo
          quietResidential: 4,
        },
        rentRange: "$1,400–$1,900/mo (1BR)",
        walkScore: 82,
        highlights: [
          "Valley Metro light rail — connects to Tempe, Mesa, and airport",
          "Roosevelt Row arts district — galleries, murals, First Fridays",
          "Chase Field and PHX Arena — sports and concerts walkable",
          "CityScape complex — dining, entertainment, and office hub",
          "Phoenix Art Museum within walking distance",
        ],
        gaps: [
          "Summers are extremely hot — walkability drops June through September",
          "Street-level activity still developing compared to mature urban cores",
          "Car still needed for most suburban errands",
        ],
        bestFor: ["Young professionals", "Urban pioneers", "Sports fans", "Those comfortable with heat"],
        coords: { lat: 33.4484, lng: -112.0740 },
      },
      {
        id: "roosevelt-row",
        name: "Roosevelt Row",
        tagline: "Phoenix's arts district — creative, walkable, culturally alive",
        scores: {
          walkability: 8,
          transitAccess: 8,     // Light rail accessible
          foodScene: 8,         // Matt's Big Breakfast, LeDu Thai, diverse options
          coffeeShops: 8,
          outdoorSpaces: 5,
          nightlife: 8,         // Arizona Wilderness Brewery, Valley Bar, live music
          familyFriendly: 5,
          culturalDiversity: 8,
          affordability: 6,     // 1BR avg ~$1,400–$1,600/mo
          quietResidential: 4,
        },
        rentRange: "$1,300–$1,700/mo (1BR)",
        walkScore: 78,
        highlights: [
          "First Friday Art Walk — monthly open-air festival with thousands of visitors",
          "Colorful street murals and gallery scene throughout the district",
          "Matt's Big Breakfast, Taco Chelo, LeDu Thai — acclaimed local dining",
          "Arizona Wilderness Brewery — celebrated craft beer destination",
          "More affordable than comparable arts districts in other cities",
        ],
        gaps: [
          "Extremely hot summers limit outdoor enjoyment May through October",
          "Crime rates higher than suburban Phoenix areas",
          "Neighborhood still developing — some areas feel transitional",
        ],
        bestFor: ["Creatives", "Artists", "Budget-conscious movers", "Art and culture seekers"],
        coords: { lat: 33.4580, lng: -112.0716 },
      },
      {
        id: "midtown-phoenix",
        name: "Midtown Phoenix",
        tagline: "Phoenix's most transit-connected neighborhood — urban, affordable, growing",
        scores: {
          walkability: 7,
          transitAccess: 8,     // Central Avenue light rail corridor
          foodScene: 7,
          coffeeShops: 6,
          outdoorSpaces: 6,
          nightlife: 7,
          familyFriendly: 6,
          culturalDiversity: 7,
          affordability: 7,     // 1BR avg ~$1,183–$1,450/mo — most affordable
          quietResidential: 5,
        },
        rentRange: "$1,100–$1,500/mo (1BR)",
        walkScore: 72,
        highlights: [
          "Central Avenue Corridor light rail — easy access to downtown and ASU",
          "Most affordable walkable neighborhood in Phoenix",
          "Phoenix Art Museum and Heard Museum within easy reach",
          "Growing restaurant and bar scene on Central Avenue",
          "Good mix of residential and cultural amenities",
        ],
        gaps: [
          "Less polished than Downtown or Roosevelt Row",
          "Hot summers make walking uncomfortable for months",
          "Nightlife is developing but not yet dense",
        ],
        bestFor: ["Budget-conscious movers", "Students", "Those prioritizing transit", "Value seekers"],
        coords: { lat: 33.4878, lng: -112.0740 },
      },
    ],
  },

  atlanta: {
    cityName: "Atlanta, GA",
    cityNote: "The South's capital city. The BeltLine trail is transforming walkability across 45 neighborhoods. MARTA rail serves key corridors. Strong Black cultural identity and growing tech scene.",
    neighborhoods: [
      {
        id: "midtown-atlanta",
        name: "Midtown Atlanta",
        tagline: "Atlanta's cultural heart — walkable, MARTA-connected, arts-rich",
        scores: {
          walkability: 9,       // Walk Score 87
          transitAccess: 8,     // MARTA rail, multiple stations
          foodScene: 9,         // Dense and acclaimed restaurant scene
          coffeeShops: 8,
          outdoorSpaces: 9,     // Piedmont Park — Atlanta's Central Park
          nightlife: 8,
          familyFriendly: 6,
          culturalDiversity: 8,
          affordability: 4,     // 1BR avg ~$2,200–$2,800/mo — premium
          quietResidential: 4,
        },
        rentRange: "$2,000–$2,800/mo (1BR)",
        walkScore: 87,
        highlights: [
          "Piedmont Park — 189 acres, Atlanta's signature green space",
          "MARTA rail — multiple stations connecting to entire city",
          "Fox Theatre, Atlanta Symphony, SCAD Atlanta — world-class arts",
          "Atlantic Station — shopping, dining, entertainment complex",
          "Peachtree Street — walkable main artery with everything nearby",
          "West Egg Cafe, South City Kitchen — beloved local dining",
        ],
        gaps: [
          "Among Atlanta's most expensive neighborhoods",
          "High-rise dominated — less neighborhood character than Inman Park",
          "Traffic on Peachtree Street can be significant",
        ],
        bestFor: ["Urban professionals", "Arts and culture lovers", "MARTA commuters", "Outdoor enthusiasts"],
        coords: { lat: 33.7813, lng: -84.3831 },
      },
      {
        id: "old-fourth-ward",
        name: "Old Fourth Ward",
        tagline: "BeltLine's anchor neighborhood — historic, transformed, endlessly walkable",
        scores: {
          walkability: 8,       // Walk Score 82
          transitAccess: 7,
          foodScene: 9,         // Ponce City Market, diverse local dining
          coffeeShops: 8,
          outdoorSpaces: 9,     // BeltLine Eastside Trail, Historic Fourth Ward Park
          nightlife: 7,
          familyFriendly: 6,
          culturalDiversity: 8, // Historic Black neighborhood with diverse new residents
          affordability: 5,     // 1BR avg ~$1,339–$1,800/mo
          quietResidential: 5,
        },
        rentRange: "$1,400–$2,000/mo (1BR)",
        walkScore: 82,
        highlights: [
          "BeltLine Eastside Trail — direct walking and cycling to Ponce City Market",
          "Ponce City Market — Atlanta's premier food and shopping destination",
          "Historic Fourth Ward Park — beautiful urban green space with splash pad",
          "Martin Luther King Jr. National Historical Park nearby",
          "Loft apartments and converted spaces with strong neighborhood character",
          "More affordable than Midtown with similar BeltLine access",
        ],
        gaps: [
          "Rapid gentrification creating community tension",
          "Some streets feel transitional — uneven development",
          "Car helpful for errands outside the BeltLine corridor",
        ],
        bestFor: ["BeltLine enthusiasts", "Foodies", "History buffs", "Those wanting urban + green access"],
        coords: { lat: 33.7588, lng: -84.3680 },
      },
      {
        id: "inman-park",
        name: "Inman Park",
        tagline: "Atlanta's first planned suburb — Victorian charm meets BeltLine access",
        scores: {
          walkability: 8,       // Walk Score 87
          transitAccess: 7,     // MARTA Inman Park/Reynoldstown station
          foodScene: 9,         // Krog Street Market, acclaimed local restaurants
          coffeeShops: 8,       // Condesa Coffee, local cafes
          outdoorSpaces: 9,     // BeltLine directly through neighborhood
          nightlife: 7,
          familyFriendly: 8,    // Victorian homes, community events, safe streets
          culturalDiversity: 7,
          affordability: 5,     // 1BR avg ~$1,700–$2,200/mo
          quietResidential: 6,
        },
        rentRange: "$1,600–$2,200/mo (1BR)",
        walkScore: 87,
        highlights: [
          "BeltLine Eastside Trail runs directly through neighborhood",
          "Krog Street Market — beloved food hall with local vendors",
          "Historic Victorian homes and tree-canopied streets",
          "Inman Park Festival — one of Atlanta's most beloved annual events",
          "MARTA station for easy downtown commute",
          "Condesa Coffee, Muchacho — neighborhood cafe staples",
        ],
        gaps: [
          "Home prices high — ownership expensive for first-time buyers",
          "Very popular — can feel crowded on BeltLine weekends",
          "Car needed for some suburban errands",
        ],
        bestFor: ["Families", "Community seekers", "BeltLine lovers", "Victorian architecture fans"],
        coords: { lat: 33.7538, lng: -84.3562 },
      },
    ],
  },

};

// Lifestyle category definitions — used by scoring.js to match user priorities
const LIFESTYLE_CATEGORIES = [
  { id: "walkability",       label: "Walkability",          description: "Get errands done on foot" },
  { id: "transitAccess",     label: "Public transit",       description: "Buses, trains, light rail" },
  { id: "foodScene",         label: "Food scene",           description: "Restaurants, variety, quality" },
  { id: "coffeeShops",       label: "Coffee shops",         description: "Cafes to work from or meet" },
  { id: "outdoorSpaces",     label: "Outdoor spaces",       description: "Parks, trails, green space" },
  { id: "nightlife",         label: "Nightlife",            description: "Bars, music, evening energy" },
  { id: "familyFriendly",    label: "Family-friendly",      description: "Schools, safety, community" },
  { id: "culturalDiversity", label: "Cultural diversity",   description: "International food, community" },
  { id: "affordability",     label: "Affordability",        description: "Lower rent relative to city" },
  { id: "quietResidential",  label: "Quiet & residential",  description: "Calm streets, less noise" },
];

// Priority weight multipliers — set by user in Step 2
const PRIORITY_WEIGHTS = {
  "must-have":    3,
  "important":    2,
  "nice-to-have": 1,
};

export { NEIGHBORHOODS, LIFESTYLE_CATEGORIES, PRIORITY_WEIGHTS };
