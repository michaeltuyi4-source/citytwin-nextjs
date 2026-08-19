// CityTwin — scoring.js
// The matching engine. Takes user selections → returns ranked neighborhoods.
// No APIs, no AI. Pure weighted arithmetic — transparent and explainable.

import { NEIGHBORHOODS, PRIORITY_WEIGHTS } from "./neighborhoods.js";
import { getPhrasesForMatch, buildInsight } from "./phrases.js";

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
// MUST-HAVE THRESHOLD + PENALTY
// A must-have "fails" when the neighborhood scores at or below this threshold.
// Shared by detectGaps (warning text) and mustHavePenalty (ranking) so the two
// never drift apart.
// ─────────────────────────────────────────────

const GAP_THRESHOLD = 5;

/**
 * mustHavePenalty
 * Aggressive graduated penalty for failing the user's must-have categories.
 * "Failed" is defined exactly as in detectGaps: score <= GAP_THRESHOLD.
 *
 * For each failed must-have:
 *   severity = (GAP_THRESHOLD - score) / GAP_THRESHOLD   // 5 => 0.0, 2 => 0.6, 0 => 1.0
 *   factor  *= (1 - 0.75 * severity)                     // aggressive per failure
 * Factors multiply across failures, so multiple misses compound. A neighborhood
 * that fails no must-haves returns factor 1.0 (unchanged).
 *
 * @param {object} neighborhood
 * @param {object} userPriorityLabels
 * @returns {{ factor: number, failedCount: number }}
 */
function mustHavePenalty(neighborhood, userPriorityLabels) {
  let factor = 1;
  let failedCount = 0;

  for (const [category, priorityLabel] of Object.entries(userPriorityLabels)) {
    if (priorityLabel !== 'must-have') continue;

    const score = neighborhood.scores[category] ?? 0;
    if (score <= GAP_THRESHOLD) {
      failedCount += 1;
      const severity = (GAP_THRESHOLD - score) / GAP_THRESHOLD;
      factor *= (1 - 0.75 * severity);
    }
  }

  return { factor, failedCount };
}

// ─────────────────────────────────────────────
// GAP DETECTION
// Surfaces honest mismatches on "must have" categories
// ─────────────────────────────────────────────

/**
 * detectGaps
 * Returns structured gap objects so the results page can style must-have
 * conflicts without scanning strings.
 *
 * @param {object} neighborhood
 * @param {object} userPriorityLabels  - e.g. { walkability: "must-have", foodScene: "important" }
 * @param {Array}  categoryDefs        - LIFESTYLE_CATEGORIES
 * @returns {Array<{ text: string, isMustHave: boolean }>}
 */
function detectGaps(neighborhood, userPriorityLabels, categoryDefs) {
  const gaps = [];

  // 1. Must-have conflicts: user said it matters most, neighborhood scores low
  for (const [category, priorityLabel] of Object.entries(userPriorityLabels)) {
    if (priorityLabel !== 'must-have') continue;

    const score = neighborhood.scores[category] ?? 0;
    if (score <= GAP_THRESHOLD) {
      const def = categoryDefs.find((c) => c.id === category);
      const label = def ? def.label : category;
      gaps.push({
        text: `${label} scores low here (${score}/10), and you marked this as a must-have.`,
        isMustHave: true,
      });
    }
  }

  // 2. Pre-written neighborhood trade-offs from the data file
  if (neighborhood.gaps && neighborhood.gaps.length > 0) {
    neighborhood.gaps.forEach((gap) => {
      gaps.push({ text: gap, isMustHave: false });
    });
  }

  return gaps;
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
 * @returns {{ matches: Array, noStrongMatch: boolean }} top 3 matches plus the honest-fallback flag
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
    return { matches: [], noStrongMatch: false };
  }

  // 2. Convert priority labels to numeric weights
  const userWeights = {};
  for (const [category, label] of Object.entries(userPriorityLabels)) {
    userWeights[category] = PRIORITY_WEIGHTS[label] ?? 1;
  }

  // 3. Guard: if no priorities selected, return empty
  if (Object.keys(userWeights).length === 0) {
    return { matches: [], noStrongMatch: false };
  }

  // 4. Score every neighborhood in the city
  const maxScore = maxPossibleScore(userWeights);

  const scored = cityData.neighborhoods.map((neighborhood) => {
    const rawScore     = scoreNeighborhood(neighborhood, userWeights);

    // Aggressive graduated must-have penalty, applied to the DISPLAYED percentage
    // so the shown number and the ranking stay consistent. scoreNeighborhood's
    // weighted-sum math and maxScore are unchanged; rawScore stays un-penalized.
    const { factor, failedCount } = mustHavePenalty(neighborhood, userPriorityLabels);
    const matchPercent = Math.round((rawScore / maxScore) * 100 * factor);
    const insightLine  = buildInsight(neighborhood, cityData.cityName, userPriorityLabels);
    const phraseChips  = getPhrasesForMatch(neighborhood, cityData.cityName, userPriorityLabels);
    const gaps         = detectGaps(neighborhood, userPriorityLabels, categoryDefs);

    return {
      // Identity
      id: neighborhood.id,
      name: neighborhood.name,
      tagline: neighborhood.tagline,
      cityName: cityData.cityName,

      // Match data
      matchPercent,
      rawScore,
      insightLine,    // replaces explanation
      phraseChips,    // NEW
      gaps,           // shape changed from string[] to { text, isMustHave }[]

      // Display data — passed straight to results page
      rentRange:  neighborhood.rentRange,
      walkScore:  neighborhood.walkScore,
      highlights: neighborhood.highlights,
      bestFor:    neighborhood.bestFor,
      coords:     neighborhood.coords,
      residentLinks: neighborhood.residentLinks ?? [],

      // Full scores — used for category breakdown on results page
      scores: neighborhood.scores,

      // Internal only: drives noStrongMatch below, stripped before return.
      _isStrongMatch: failedCount === 0,
    };
  });

  // 5. Sort by (penalized) match percentage descending, take top 3
  const top = scored
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 3);

  // 6. Honest fallback: a "strong match" fails zero must-haves. If none of the
  //    top matches is strong, the results page shows an honest banner.
  const noStrongMatch = !top.some((m) => m._isStrongMatch);

  // Strip the internal flag so each match keeps its existing shape.
  const matches = top.map(({ _isStrongMatch, ...match }) => match);

  return { matches, noStrongMatch };
}

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────

export { getTopMatches, scoreNeighborhood, detectGaps };
