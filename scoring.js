// CityTwin — scoring.js
// The matching engine. Takes user selections → returns ranked neighborhoods.
// No APIs, no AI. Pure weighted arithmetic — transparent and explainable.

import { NEIGHBORHOODS, PRIORITY_WEIGHTS } from "./neighborhoods.js";

// ─────────────────────────────────────────────
// CORE SCORING
// ─────────────────────────────────────────────

/**
 * scoreNeighborhood
 * Scores a single neighborhood against a user's weighted priorities.
 *
 * @param {object} neighborhood  - one neighborhood object from neighborhoods.js
 * @param {object} userWeights   - e.g. { walkability: 3, foodScene: 2, nightlife: 1 }
 * @returns {number}             - raw weighted score
 */
function scoreNeighborhood(neighborhood, userWeights) {
  let total = 0;

  for (const [category, weight] of Object.entries(userWeights)) {
    const neighborhoodScore = neighborhood.scores[category] ?? 0;
    total += neighborhoodScore * weight;
  }

  return total;
}

// ─────────────────────────────────────────────
// MAX POSSIBLE SCORE
// Used to convert raw score → percentage match
// ─────────────────────────────────────────────

/**
 * maxPossibleScore
 * Calculates the highest score any perfect neighborhood could achieve
 * given the user's weights. A perfect neighborhood scores 10 in every category.
 *
 * @param {object} userWeights
 * @returns {number}
 */
function maxPossibleScore(userWeights) {
  let max = 0;
  for (const weight of Object.values(userWeights)) {
    max += 10 * weight;
  }
  return max;
}

// ─────────────────────────────────────────────
// GAP DETECTION
// Surfaces honest mismatches on "must have" categories
// ─────────────────────────────────────────────

/**
 * detectGaps
 * Finds categories where the user said "must have" (weight 3)
 * but the neighborhood scores 5 or below.
 *
 * @param {object} neighborhood
 * @param {object} userWeights
 * @param {object} userPriorityLabels  - e.g. { walkability: "must-have", foodScene: "important" }
 * @param {Array}  categoryDefs        - LIFESTYLE_CATEGORIES from neighborhoods.js
 * @returns {Array} - array of gap strings ready to display
 */
function detectGaps(neighborhood, userWeights, userPriorityLabels, categoryDefs) {
  const gaps = [];
  const GAP_THRESHOLD = 5;

  for (const [category, priorityLabel] of Object.entries(userPriorityLabels)) {
    if (priorityLabel !== "must-have") continue;

    const score = neighborhood.scores[category] ?? 0;
    if (score <= GAP_THRESHOLD) {
      const def = categoryDefs.find((c) => c.id === category);
      const label = def ? def.label : category;
      gaps.push(
        `${label} scores low here (${score}/10) — and you marked this as a must-have.`
      );
    }
  }

  // Also surface pre-written gaps from the neighborhood data
  if (neighborhood.gaps && neighborhood.gaps.length > 0) {
    neighborhood.gaps.forEach((gap) => gaps.push(gap));
  }

  return gaps;
}

// ─────────────────────────────────────────────
// MATCH EXPLANATION GENERATOR
// Creates a plain-language "why this fits you" for each result
// ─────────────────────────────────────────────

/**
 * buildExplanation
 * Finds the top 3 categories where the neighborhood scores best
 * AND the user weighted them highly. Returns plain-language sentences.
 *
 * @param {object} neighborhood
 * @param {object} userWeights
 * @param {Array}  categoryDefs
 * @returns {string}
 */
function buildExplanation(neighborhood, userWeights, categoryDefs) {
  // Score each weighted category: neighborhood score × user weight
  const contributions = Object.entries(userWeights)
    .map(([category, weight]) => ({
      category,
      contribution: (neighborhood.scores[category] ?? 0) * weight,
      score: neighborhood.scores[category] ?? 0,
      weight,
    }))
    .filter((c) => c.score >= 7)           // Only mention things the neighborhood is actually good at
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3);                           // Top 3 strengths relevant to this user

  if (contributions.length === 0) {
    return "This neighborhood covers your priorities at a moderate level across the board.";
  }

  const sentences = contributions.map(({ category, score }) => {
    const def = categoryDefs.find((c) => c.id === category);
    const label = def ? def.label.toLowerCase() : category;

    const qualifier =
      score >= 9 ? "exceptional" :
      score >= 8 ? "strong" :
      "solid";

    return `${qualifier} ${label} (${score}/10)`;
  });

  // Build natural language from the array
  if (sentences.length === 1) {
    return `Stands out for its ${sentences[0]}.`;
  } else if (sentences.length === 2) {
    return `Stands out for its ${sentences[0]} and ${sentences[1]}.`;
  } else {
    return `Stands out for its ${sentences[0]}, ${sentences[1]}, and ${sentences[2]}.`;
  }
}

// ─────────────────────────────────────────────
// MAIN FUNCTION — getTopMatches
// This is the one you call from the app
// ─────────────────────────────────────────────

/**
 * getTopMatches
 * The single function the app needs to call.
 * Takes user input → returns top 3 neighborhood matches with scores,
 * explanations, gap warnings, and display-ready data.
 *
 * @param {string} cityKey             - "charlotte" | "montgomery" | "chicago"
 * @param {object} userPriorityLabels  - { walkability: "must-have", foodScene: "important", ... }
 * @param {Array}  categoryDefs        - LIFESTYLE_CATEGORIES from neighborhoods.js
 * @returns {Array} top 3 match objects
 *
 * Example input:
 *   cityKey = "charlotte"
 *   userPriorityLabels = {
 *     walkability: "must-have",
 *     foodScene: "must-have",
 *     outdoorSpaces: "important",
 *     nightlife: "nice-to-have"
 *   }
 */
function getTopMatches(cityKey, userPriorityLabels, categoryDefs) {

  // 1. Validate city
  const cityData = NEIGHBORHOODS[cityKey];
  if (!cityData) {
    console.error(`City "${cityKey}" not found in neighborhoods data.`);
    return [];
  }

  // 2. Convert priority labels to numeric weights
  const userWeights = {};
  for (const [category, label] of Object.entries(userPriorityLabels)) {
    userWeights[category] = PRIORITY_WEIGHTS[label] ?? 1;
  }

  // 3. Guard: if no priorities selected, return empty
  if (Object.keys(userWeights).length === 0) {
    return [];
  }

  // 4. Score every neighborhood in the city
  const maxScore = maxPossibleScore(userWeights);

  const scored = cityData.neighborhoods.map((neighborhood) => {
    const rawScore = scoreNeighborhood(neighborhood, userWeights);
    const matchPercent = Math.round((rawScore / maxScore) * 100);
    const explanation = buildExplanation(neighborhood, userWeights, categoryDefs);
    const gaps = detectGaps(neighborhood, userWeights, userPriorityLabels, categoryDefs);

    return {
      // Identity
      id: neighborhood.id,
      name: neighborhood.name,
      tagline: neighborhood.tagline,
      cityName: cityData.cityName,

      // Match data
      matchPercent,
      rawScore,
      explanation,
      gaps,

      // Display data — passed straight to results page
      rentRange: neighborhood.rentRange,
      walkScore: neighborhood.walkScore,
      highlights: neighborhood.highlights,
      bestFor: neighborhood.bestFor,
      coords: neighborhood.coords,

      // Full scores — used for category breakdown on results page
      scores: neighborhood.scores,
    };
  });

  // 5. Sort by match percentage descending, return top 3
  return scored
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 3);
}

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────

export { getTopMatches, scoreNeighborhood, detectGaps, buildExplanation };
