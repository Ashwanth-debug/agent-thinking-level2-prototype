import { useEffect, useState } from 'react';
import { pickLocalFallbackImage } from '../../../adapters/localImageFallback';

/* ─────────────────────────────────────────────────────────────────────────────
   LEVEL 2 — The shared image resolver.

   Extracted verbatim from Level2CandidateCard so the THINKING tile and the
   FINAL card resolve imagery through exactly the same integration. This is the
   image path the project already had; nothing new was written for it, and
   there is no second implementation to drift.

   Only two tiers, both zero-external-network:

     1. The harness's own photo_url from the trace, when the trace actually
        carries one.
     2. A local static image, keyword-matched against the item's real title —
        so a broken, relative, missing, or absent URL never leaves an empty
        frame or a broken glyph.

   No Google Places / Pexels tier: those hit external APIs and this resolver
   must never leave the online-env product's own trace + local assets.
   Tier 2 is never presented as the real venue's photo; it's relevant
   imagery, which is why the category keyword comes from the real title.
   ───────────────────────────────────────────────────────────────────────────── */

export default function EnrichedImage({
  itemId,
  itemTitle,
  fallbackSrc,
  className,
  onTierResolved,
}: {
  itemId: string;
  itemTitle: string;
  fallbackSrc?: string;
  className?: string;
  onTierResolved?: (tier: number) => void;
}) {
  const [tier, setTier] = useState(0);
  const localFallback = pickLocalFallbackImage(itemTitle, itemId);
  const candidates = [fallbackSrc, localFallback];

  let renderedIndex = candidates.length - 1;
  let src: string = localFallback;
  for (let i = tier; i < candidates.length; i++) {
    const candidate = candidates[i];
    if (candidate) {
      src = candidate;
      renderedIndex = i;
      break;
    }
  }

  useEffect(() => {
    onTierResolved?.(renderedIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderedIndex]);

  return (
    <img
      className={className}
      src={src}
      alt=""
      onError={() => setTier(Math.min(renderedIndex + 1, candidates.length - 1))}
    />
  );
}
