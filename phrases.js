// CityTwin — phrases.js
// Phrase template library + selector functions for the results page chips.
// Phase 1: hardcoded templates. Phase 2: migrates to Supabase alongside neighborhoods.

// ─────────────────────────────────────────────
// SCORE BANDS
// Maps a 1-10 category score to a band used to select a phrase.
// ─────────────────────────────────────────────

/**
 * scoreBand
 * @param {number} score - 1 to 10
 * @returns {'exceptional'|'strong'|'good'|'mixed'|'limited'}
 */
function scoreBand(score) {
  if (score >= 9) return 'exceptional';
  if (score >= 8) return 'strong';
  if (score >= 7) return 'good';
  if (score >= 5) return 'mixed';
  return 'limited';
}

// ─────────────────────────────────────────────
// PHRASE LIBRARY
// 90 phrases: 10 categories x 3 surfaced bands x 3 variants.
// Bands "mixed" and "limited" are intentionally absent — those scores
// don't earn a chip; they feed Real talk via the gaps system instead.
//
// Voice rules:
//   - Conversational, like a friend describing the neighborhood.
//   - No em dashes. Use commas or hyphens.
//   - {neighborhood} and {city} placeholders substitute at runtime.
//   - No corporate hedging ("you might find that...", "consider that...").
// ─────────────────────────────────────────────

const PHRASES = {
  walkability: {
    exceptional: [
      "Walkable enough you'll only drive for big grocery runs.",
      "Most of what you need is within a ten-minute walk.",
      "Some weeks here, you won't touch the car keys.",
    ],
    strong: [
      "Walkable for the daily things, driving for the bigger ones.",
      "Coffee, gym, food, all reachable on foot.",
      "Most weekdays end up car-free without trying.",
    ],
    good: [
      "Walkable for the basics; drive for the rest.",
      "Daily errands work on foot, weekends call for a car.",
      "Some days walking, some days driving. Manageable either way.",
    ],
  },

  transitAccess: {
    exceptional: [
      "Train downtown in under fifteen minutes.",
      "Public transit here actually works for daily life.",
      "Skip the car commute, skip the parking ticket.",
    ],
    strong: [
      "Train or bus downtown in twenty to thirty minutes.",
      "Transit covers the weekday commute reliably.",
      "Most weekdays you can leave the car parked.",
    ],
    good: [
      "Workable transit during peak hours.",
      "Buses run reliably during the workweek.",
      "Transit handles the commute, less so the late nights.",
    ],
  },

  foodScene: {
    exceptional: [
      "Restaurant density beats most of {city}.",
      "You'll need a list just to keep track of what to try.",
      "Eat out for a year here and barely repeat yourself.",
    ],
    strong: [
      "Strong restaurant mix, from quick bites to weekend reservations.",
      "Plenty of go-to dinner spots within a short walk.",
      "Food options run from casual to occasion.",
    ],
    good: [
      "Solid food scene for the basics, a few standouts.",
      "Reliable mix of casual restaurants and a few destinations.",
      "Enough variety to keep weekly rotation interesting.",
    ],
  },

  coffeeShops: {
    exceptional: [
      "Independent coffee shops outnumber the chains here.",
      "You'll have your regular spot within a week.",
      "More than five independent cafés within a half-mile.",
    ],
    strong: [
      "A handful of independent coffee shops, plus the usual chains.",
      "Solid mix of indie cafés and reliable chains.",
      "Three or four real coffee spots within walking distance.",
    ],
    good: [
      "A few good independents, more chains than not.",
      "Coffee culture is here, just less dense than the destination neighborhoods.",
      "Workable for a coffee routine; not a coffee destination.",
    ],
  },

  outdoorSpaces: {
    exceptional: [
      "Direct access to a park or trail for runs and weekends.",
      "Parks and green space are a daily feature, not a Sunday outing.",
      "You can be on a real path in under ten minutes.",
    ],
    strong: [
      "Multiple parks within walking distance for daily outdoor time.",
      "Green space is built into the routine here.",
      "A short walk to grass and trees, most days of the year.",
    ],
    good: [
      "A few decent parks; you'll know them well.",
      "Outdoor access works, though it takes a little effort.",
      "Some green space within walking distance, more by car.",
    ],
  },

  nightlife: {
    exceptional: [
      "Bars, music venues, and late-night food without leaving the neighborhood.",
      "Friday nights run long here, in a good way.",
      "Late-night life is part of the {neighborhood} identity.",
    ],
    strong: [
      "Plenty of bars and a handful of music venues nearby.",
      "Solid nightlife without needing to commute for it.",
      "A few favorite bars, a couple of venues, no long rides home.",
    ],
    good: [
      "Enough bars for a Friday, not enough for every weekend.",
      "Nightlife exists, but the destinations are elsewhere.",
      "A modest after-dark scene that fills out on weekends.",
    ],
  },

  familyFriendly: {
    exceptional: [
      "Strollers, playgrounds, schools, all built into daily life here.",
      "Family-friendly without sacrificing the parts that make a neighborhood interesting.",
      "Strong schools, walkable parks, and other families on the block.",
    ],
    strong: [
      "Solid mix of families and singles, with the basics covered.",
      "Family resources work without taking over the whole neighborhood.",
      "Parks, schools, and pediatricians within reach.",
    ],
    good: [
      "Family-workable, though not specifically a family neighborhood.",
      "Some families here, more singles and couples.",
      "Workable for kids; you'll travel for the best of everything.",
    ],
  },

  culturalDiversity: {
    exceptional: [
      "International grocery stores, restaurants, and community events as a baseline.",
      "Languages on the street, food from anywhere, every weekend.",
      "Cultural variety is the neighborhood, not a section of it.",
    ],
    strong: [
      "Diverse mix of people, food, and community events.",
      "Multiple cultures represented in the daily fabric here.",
      "Strong international food scene and active community groups.",
    ],
    good: [
      "Some cultural variety, more in food than in community.",
      "International food is here; broader diversity is moderate.",
      "Workable variety, though the neighborhood skews one direction.",
    ],
  },

  affordability: {
    exceptional: [
      "Rent runs well below the {city} average for this kind of access.",
      "More apartment, less rent than the neighborhoods nearby.",
      "Affordability is the strongest reason to land here.",
    ],
    strong: [
      "Rent runs a bit under the city average.",
      "Reasonable rent for what you get on amenities.",
      "More space per dollar than the destination neighborhoods.",
    ],
    good: [
      "Rent is fair for the location, not a bargain.",
      "Affordability is workable; you'll pay for the address.",
      "On par with the city average for what's offered.",
    ],
  },

  quietResidential: {
    exceptional: [
      "Quiet enough that you'll hear birds in the morning.",
      "Residential first, with the urban stuff close by.",
      "The kind of street where neighbors say hi.",
    ],
    strong: [
      "Mostly residential with pockets of activity.",
      "Quiet on weeknights, active on weekends.",
      "Residential feel without being isolated from the city.",
    ],
    good: [
      "Mixed in character; some blocks are quiet, others aren't.",
      "Residential-leaning, with steady but not loud city noise.",
      "Quieter than the urban core, livelier than the suburbs.",
    ],
  },
};

// ─────────────────────────────────────────────
// CATEGORY LABELS (human-readable for insight line)
// Lowercase intentionally — insight line uses these mid-sentence.
// ─────────────────────────────────────────────

const CATEGORY_LABELS = {
  walkability:       'walkability',
  transitAccess:     'transit',
  foodScene:         'food',
  coffeeShops:       'coffee',
  outdoorSpaces:     'outdoor space',
  nightlife:         'nightlife',
  familyFriendly:    'family-friendliness',
  culturalDiversity: 'cultural diversity',
  affordability:     'affordability',
  quietResidential:  'quiet streets',
};

// ─────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────

/**
 * stableHash — deterministic positive integer from a string.
 * Used to pick a variant index so the same neighborhood+category always
 * gets the same phrase, but different neighborhoods can get different variants.
 */
function stableHash(input) {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h);
}

/**
 * substitute — fills {neighborhood} and {city} placeholders.
 */
function substitute(phrase, neighborhoodName, cityName) {
  return phrase
    .replace(/\{neighborhood\}/g, neighborhoodName)
    .replace(/\{city\}/g, cityName);
}

/**
 * joinNatural — "a", "a and b", "a, b, and c"
 */
function joinNatural(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

// ─────────────────────────────────────────────
// PUBLIC: getPhrasesForMatch
// Produces 3-6 phrase chips ordered by user weight (must-haves first).
// ─────────────────────────────────────────────

/**
 * getPhrasesForMatch
 * @param {object} neighborhood - full neighborhood object from neighborhoods.js
 *                                (must include id, name, scores, optionally categoryPhrases)
 * @param {string} cityName     - display name e.g. "Chicago, IL"
 * @param {object} userPriorityLabels - { walkability: "must-have", ... }
 * @returns {Array<{ category, phrase, score, weight }>}
 */
function getPhrasesForMatch(neighborhood, cityName, userPriorityLabels) {
  const MIN_SCORE = 7;       // below this, no chip — feeds Real talk instead
  const MAX_PHRASES = 6;

  // Build sortable list of categories the user cares about that the neighborhood scores well on
  const eligible = Object.entries(userPriorityLabels)
    .map(([category, weight]) => ({
      category,
      weight,
      score: neighborhood.scores[category] ?? 0,
    }))
    .filter((row) => row.score >= MIN_SCORE)
    .sort((a, b) => {
      // must-have first, then important, then nice-to-have
      const rank = (w) => (w === 'must-have' ? 0 : w === 'important' ? 1 : 2);
      const wDiff = rank(a.weight) - rank(b.weight);
      return wDiff !== 0 ? wDiff : b.score - a.score;
    })
    .slice(0, MAX_PHRASES);

  return eligible.map(({ category, weight, score }) => {
    let raw;

    // 1. Check for per-neighborhood override
    const overrides = neighborhood.categoryPhrases || {};
    if (overrides[category]) {
      raw = overrides[category];
    } else {
      // 2. Fall back to generic library
      const band = scoreBand(score);
      const bank = (PHRASES[category] && PHRASES[category][band]) || [];

      if (bank.length === 0) {
        raw = `Strong fit on ${CATEGORY_LABELS[category] || category} here.`;
      } else {
        // Deterministic variant pick: same neighborhood + category = same phrase every time
        const idx = stableHash(neighborhood.id + ':' + category) % bank.length;
        raw = bank[idx];
      }
    }

    return {
      category,
      phrase: substitute(raw, neighborhood.name, cityName),
      score,
      weight,
    };
  });
}

// ─────────────────────────────────────────────
// PUBLIC: buildInsight
// Replaces the old buildExplanation. Produces 1-2 sentence warm payoff.
// ─────────────────────────────────────────────

/**
 * buildInsight
 * @param {object} neighborhood
 * @param {string} cityName
 * @param {object} userPriorityLabels
 * @returns {string}
 */
function buildInsight(neighborhood, cityName, userPriorityLabels) {
  const mustHaves = Object.entries(userPriorityLabels)
    .filter(([, weight]) => weight === 'must-have')
    .map(([category]) => ({
      category,
      score: neighborhood.scores[category] ?? 0,
    }));

  // Case A: no must-haves at all (user marked everything as important/nice)
  if (mustHaves.length === 0) {
    const topThree = Object.entries(userPriorityLabels)
      .map(([category]) => ({
        category,
        score: neighborhood.scores[category] ?? 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const labels = topThree.map((t) => CATEGORY_LABELS[t.category] || t.category);
    return `${neighborhood.name} matches how you live across ${joinNatural(labels)}.`;
  }

  const minMustHave = Math.min(...mustHaves.map((m) => m.score));
  const labels = mustHaves.map((m) => CATEGORY_LABELS[m.category] || m.category);

  // Case B: all must-haves score 9+ (genuinely rare alignment)
  if (minMustHave >= 9) {
    if (mustHaves.length === 1) {
      const label = CATEGORY_LABELS[mustHaves[0].category] || mustHaves[0].category;
      const score = mustHaves[0].score;
      return `${capitalize(label)} is the thing you said had to fit, and it ranks ${score}/10 here. ${neighborhood.name} nails the part that matters most to you.`;
    }
    return `Your ${mustHaves.length} must-haves, ${joinNatural(labels)}, all rank top-quartile for ${cityName} here. This kind of alignment is rare.`;
  }

  // Case C: all must-haves score 8+ (strong fit)
  if (minMustHave >= 8) {
    if (mustHaves.length === 1) {
      const label = CATEGORY_LABELS[mustHaves[0].category] || mustHaves[0].category;
      return `${capitalize(label)} is your must-have, and it scores strong here. ${neighborhood.name} delivers on what matters most.`;
    }
    return `${capitalize(joinNatural(labels))} all score strong here. ${neighborhood.name} is a clean fit on the things you said matter most.`;
  }

  // Case D: must-haves score 7+ (decent fit, no superlatives)
  if (minMustHave >= 7) {
    if (mustHaves.length === 1) {
      const label = CATEGORY_LABELS[mustHaves[0].category] || mustHaves[0].category;
      return `Your must-have, ${label}, lands solid for ${cityName} here.`;
    }
    return `Most of your must-haves land well here, with ${joinNatural(labels)} all scoring solid for ${cityName}.`;
  }

  // Case E: at least one must-have scores below 7 (real trade-off)
  if (mustHaves.length === 1) {
    return `${neighborhood.name} fits the broader shape of how you live, though your must-have isn't a top score here. Worth weighing against the trade-offs below.`;
  }
  return `${neighborhood.name} fits the broader shape of how you live, though not every must-have is a top score. Worth weighing against the trade-offs below.`;
}

function capitalize(s) {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

export {
  getPhrasesForMatch,
  buildInsight,
  scoreBand,
  CATEGORY_LABELS,
  PHRASES,
};
