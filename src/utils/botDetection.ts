// Zoznam známych bot User Agent stringov
const BOT_PATTERNS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /googlebot/i,
  /bingbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegram/i,
  /slackbot/i,
  /discordbot/i,
  /yandexbot/i,
  /baiduspider/i,
  /duckduckbot/i,
  /applebot/i,
  /amazonbot/i,
  /archive\.org_bot/i,
  /ia_archiver/i,
  /semrushbot/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i
];

export const isBot = (userAgent: string | null): boolean => {
  if (!userAgent) return false;
  
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
};

export const getVisitorType = (userAgent: string | null, isAdmin: boolean): 'admin' | 'bot' | 'human' => {
  if (isAdmin) return 'admin';
  if (isBot(userAgent)) return 'bot';
  return 'human';
};

export const getBotType = (userAgent: string | null): string | null => {
  if (!userAgent) return null;
  
  const lowerAgent = userAgent.toLowerCase();
  
  if (lowerAgent.includes('googlebot')) return 'Google Bot';
  if (lowerAgent.includes('bingbot')) return 'Bing Bot';
  if (lowerAgent.includes('facebookexternalhit')) return 'Facebook Bot';
  if (lowerAgent.includes('twitterbot')) return 'Twitter Bot';
  if (lowerAgent.includes('linkedinbot')) return 'LinkedIn Bot';
  if (lowerAgent.includes('whatsapp')) return 'WhatsApp Bot';
  if (lowerAgent.includes('telegram')) return 'Telegram Bot';
  if (lowerAgent.includes('slackbot')) return 'Slack Bot';
  if (lowerAgent.includes('discordbot')) return 'Discord Bot';
  if (lowerAgent.includes('yandexbot')) return 'Yandex Bot';
  if (lowerAgent.includes('baiduspider')) return 'Baidu Bot';
  if (lowerAgent.includes('duckduckbot')) return 'DuckDuckGo Bot';
  if (lowerAgent.includes('applebot')) return 'Apple Bot';
  if (lowerAgent.includes('amazonbot')) return 'Amazon Bot';
  if (lowerAgent.includes('archive.org_bot')) return 'Archive.org Bot';
  if (lowerAgent.includes('semrushbot')) return 'SEMrush Bot';
  if (lowerAgent.includes('ahrefsbot')) return 'Ahrefs Bot';
  
  if (isBot(userAgent)) return 'Neznámy Bot';
  
  return null;
};
