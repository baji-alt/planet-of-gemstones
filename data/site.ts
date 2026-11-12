/** Store facts in one place. Replace placeholders marked TODO with confirmed details. */
export const site = {
  instagram: 'https://www.instagram.com/planet_of_gemstones/',
  instagramHandle: 'planet_of_gemstones',
  threads: 'https://www.threads.net/@planet_of_gemstones',
  linktree: 'https://linktr.ee/planetofgemstones',
  followers: '108K',
  posts: '817',
  // TODO: confirm exact street address / pin
  mapQuery: 'Riad El Solh Square, Beirut, Lebanon',
  geo: { lat: 33.8959, lng: 35.5036 },
  // TODO: confirm real opening hours (placeholders shown on the site)
  openingHours: ['Mo-Sa 10:00-19:00'],
}

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`
export const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=16&output=embed`
