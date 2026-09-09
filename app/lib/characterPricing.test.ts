import test from 'node:test';
import assert from 'node:assert';
import { 
  CHARACTER_CLAN_MAP, 
  CHARACTER_POWER_RATINGS, 
  calculateCharacterPrice, 
  getCharacterPricingConfig,
  getAllCharacterPricingConfigs,
  CLAN_METADATA
} from './characterPricing.ts';
import type { BleachHeroId } from './characterPricing.ts';

test('Character Pricing & Clans - All 12 Heroes Mapped to Valid Clans', () => {
  const allHeroes: BleachHeroId[] = [
    'ichigo', 'rukia', 'kenpachi', 'byakuya', 'urahara', 'aizen',
    'toshiro', 'ulquiorra_hero', 'yoruichi', 'renji', 'shunsui', 'yamamoto'
  ];

  const validClans = new Set(['warrior', 'guardian', 'mage', 'healer', 'immortal']);

  for (const heroId of allHeroes) {
    const clan = CHARACTER_CLAN_MAP[heroId];
    assert.ok(clan, `Hero ${heroId} must have an assigned clan.`);
    assert.ok(validClans.has(clan), `Hero ${heroId} assigned clan '${clan}' must be one of the 5 canonical clans.`);
  }

  // Check specific lore assignments
  assert.strictEqual(CHARACTER_CLAN_MAP.ichigo, 'warrior');
  assert.strictEqual(CHARACTER_CLAN_MAP.kenpachi, 'warrior');
  assert.strictEqual(CHARACTER_CLAN_MAP.yoruichi, 'warrior');
  assert.strictEqual(CHARACTER_CLAN_MAP.shunsui, 'warrior');
  assert.strictEqual(CHARACTER_CLAN_MAP.renji, 'guardian');
  assert.strictEqual(CHARACTER_CLAN_MAP.byakuya, 'guardian');
  assert.strictEqual(CHARACTER_CLAN_MAP.rukia, 'mage');
  assert.strictEqual(CHARACTER_CLAN_MAP.toshiro, 'mage');
  assert.strictEqual(CHARACTER_CLAN_MAP.urahara, 'mage');
  assert.strictEqual(CHARACTER_CLAN_MAP.ulquiorra_hero, 'healer');
  assert.strictEqual(CHARACTER_CLAN_MAP.aizen, 'immortal');
  assert.strictEqual(CHARACTER_CLAN_MAP.yamamoto, 'immortal');
});

test('Character Pricing & Clans - Starter Hero Ichigo is Free (0 Geo)', () => {
  const ichigoPower = CHARACTER_POWER_RATINGS.ichigo;
  assert.strictEqual(ichigoPower, 500);

  const ichigoCost = calculateCharacterPrice(ichigoPower);
  assert.strictEqual(ichigoCost, 0, 'Starter Ichigo must cost 0 Geo.');

  const config = getCharacterPricingConfig('ichigo');
  assert.strictEqual(config.geoCost, 0);
  assert.strictEqual(config.clanId, 'warrior');
});

test('Character Pricing & Clans - Power Rating to Price Scaling is Monotonically Increasing', () => {
  const allHeroes: BleachHeroId[] = [
    'ichigo', 'rukia', 'renji', 'toshiro', 'kenpachi', 'byakuya',
    'ulquiorra_hero', 'yoruichi', 'urahara', 'shunsui', 'aizen', 'yamamoto'
  ];

  const configs = allHeroes.map(id => getCharacterPricingConfig(id));

  // Sort by power rating ascending
  configs.sort((a, b) => a.powerRating - b.powerRating);

  // Assert prices never decrease as power increases
  for (let i = 1; i < configs.length; i++) {
    const prev = configs[i - 1];
    const curr = configs[i];

    assert.ok(
      curr.powerRating >= prev.powerRating,
      `${curr.id} power (${curr.powerRating}) should be >= ${prev.id} (${prev.powerRating})`
    );

    assert.ok(
      curr.geoCost >= prev.geoCost,
      `${curr.id} price (${curr.geoCost} Geo) must be >= ${prev.id} price (${prev.geoCost} Geo)`
    );
  }

  // Check tier price ranges
  // Low tier (Rukia, Renji): <= 200 Geo
  assert.ok(getCharacterPricingConfig('rukia').geoCost <= 200);
  assert.ok(getCharacterPricingConfig('renji').geoCost <= 200);

  // Mid tier (Toshiro, Kenpachi, Byakuya, Ulquiorra, Yoruichi): 250 - 500 Geo
  assert.ok(getCharacterPricingConfig('toshiro').geoCost >= 250 && getCharacterPricingConfig('toshiro').geoCost <= 500);
  assert.ok(getCharacterPricingConfig('kenpachi').geoCost >= 250 && getCharacterPricingConfig('kenpachi').geoCost <= 500);

  // High tier (Urahara, Shunsui): 500 - 650 Geo
  assert.ok(getCharacterPricingConfig('urahara').geoCost >= 500 && getCharacterPricingConfig('urahara').geoCost <= 650);
  assert.ok(getCharacterPricingConfig('shunsui').geoCost >= 500 && getCharacterPricingConfig('shunsui').geoCost <= 650);

  // God tier (Aizen, Yamamoto): 750 - 900 Geo
  assert.ok(getCharacterPricingConfig('aizen').geoCost >= 750 && getCharacterPricingConfig('aizen').geoCost <= 900);
  assert.ok(getCharacterPricingConfig('yamamoto').geoCost >= 800 && getCharacterPricingConfig('yamamoto').geoCost <= 900);
});

test('Character Pricing & Clans - getAllCharacterPricingConfigs returns 12 complete records', () => {
  const allConfigs = getAllCharacterPricingConfigs();
  const keys = Object.keys(allConfigs);

  assert.strictEqual(keys.length, 12, 'Must contain exactly 12 heroes');

  for (const [id, cfg] of Object.entries(allConfigs)) {
    assert.strictEqual(cfg.id, id);
    assert.ok(cfg.powerRating >= 500 && cfg.powerRating <= 990);
    assert.ok(cfg.clan && cfg.clan.badgeLabel);
    assert.ok(typeof cfg.geoCost === 'number' && cfg.geoCost >= 0);
  }
});
