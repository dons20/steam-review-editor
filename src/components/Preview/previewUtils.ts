import type { PreviewSettings } from "./PreviewSettingsModal";

const randomize = (max = 1) => Math.random() * max;

export function randomizeSettings(): PreviewSettings {
  const hoursOnRecord = parseFloat((randomize(900) + 0.1).toFixed(1));
  const hoursAtReview = parseFloat(randomize(hoursOnRecord).toFixed(1));
  const today = new Date();
  // Randomize date within the past 2 years
  const daysAgo = Math.floor(randomize(730));
  const randomDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const dateStr = randomDate.toISOString().split("T")[0];

  const usernames = [
    "SteamUser",
    "GamingPro",
    "ReviewMaster",
    "GameHunter",
    "PixelWarrior",
    "NightOwlGamer",
    "CriticalThinker",
  ];
  const username = usernames[Math.floor(randomize(usernames.length))];

  return {
    username,
    productsInAccount: Math.floor(randomize(2000)),
    numReviews: Math.floor(randomize(100)),
    isRecommended: Math.random() > 0.5,
    hoursOnRecord,
    hoursAtReview,
    datePosted: dateStr,
  };
}
