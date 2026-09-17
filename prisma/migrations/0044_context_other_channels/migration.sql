-- Context Pack: which other paid channels the client runs (Meta, TikTok,
-- influencers…). Frames blended MER and the Ads paid share as channel mix.
ALTER TABLE "ClientContext" ADD COLUMN IF NOT EXISTS "otherChannels" TEXT;
