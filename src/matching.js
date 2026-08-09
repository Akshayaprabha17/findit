// matching.js — simple scoring to find possible matches

/**
 * Score how likely two items (opposite types) might match.
 * Returns a score 0-100 and a list of reasons.
 */
export function scoreMatch(newItem, candidate) {
  let score = 0;
  const reasons = [];

  // Category must match
  if (newItem.category !== candidate.category) return { score: 0, reasons: [] };
  score += 40;
  reasons.push(`Same category: ${newItem.category}`);

  // Name on it (for ID Card / Documents)
  if (
    newItem.nameOnIt &&
    candidate.nameOnIt &&
    newItem.nameOnIt.trim().toLowerCase() === candidate.nameOnIt.trim().toLowerCase()
  ) {
    score += 35;
    reasons.push('Name on item matches');
  }

  // Location keyword overlap
  const locWords = (s) =>
    s
      .toLowerCase()
      .split(/[\s,./\\-]+/)
      .filter((w) => w.length > 2);
  const newLoc = locWords(newItem.location || '');
  const candLoc = locWords(candidate.location || '');
  const locOverlap = newLoc.filter((w) => candLoc.includes(w)).length;
  if (locOverlap > 0) {
    const locScore = Math.min(20, locOverlap * 10);
    score += locScore;
    reasons.push('Nearby location');
  }

  // Date within 5 days
  try {
    const d1 = new Date(newItem.date);
    const d2 = new Date(candidate.date);
    const diff = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
    if (diff <= 5) {
      const dateScore = Math.round((1 - diff / 5) * 15);
      score += dateScore;
      reasons.push('Dates are close');
    }
  } catch {
    // ignore date parse errors
  }

  // Description keyword overlap (small bonus)
  const descWords = (s) =>
    s
      .toLowerCase()
      .split(/[\s,./\\-]+/)
      .filter((w) => w.length > 3);
  const newDesc = descWords(newItem.description || '');
  const candDesc = descWords(candidate.description || '');
  const descOverlap = newDesc.filter((w) => candDesc.includes(w)).length;
  if (descOverlap >= 2) {
    score += Math.min(10, descOverlap * 3);
    reasons.push('Similar description keywords');
  }

  return { score: Math.min(score, 100), reasons };
}

/**
 * Find matches for a new item among existing opposite-type items.
 * Returns matches sorted by score desc, filtered to score >= 55.
 */
export function findMatches(newItem, allItems) {
  const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
  const candidates = allItems.filter(
    (i) => i.type === oppositeType && i.id !== newItem.id && i.status === 'open'
  );

  const results = candidates
    .map((candidate) => {
      const { score, reasons } = scoreMatch(newItem, candidate);
      return { item: candidate, score, reasons };
    })
    .filter((r) => r.score >= 55)
    .sort((a, b) => b.score - a.score);

  return results;
}
