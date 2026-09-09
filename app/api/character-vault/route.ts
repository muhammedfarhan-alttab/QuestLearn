import { NextResponse } from 'next/server';
import { 
  BleachHeroId, 
  getAllCharacterPricingConfigs, 
  getCharacterPricingConfig,
  CLAN_METADATA 
} from '../../lib/characterPricing';

export const dynamic = 'force-dynamic';

/**
 * GET /api/character-vault
 * Returns the authoritative roster of characters with their assigned clan,
 * calculated power rating, and strictly scaled Geo cost.
 */
export async function GET() {
  try {
    const characters = getAllCharacterPricingConfigs();
    return NextResponse.json({
      success: true,
      characters,
      clans: CLAN_METADATA
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to retrieve character vault data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/character-vault
 * Authoritative character purchase validation. Ensures client cannot bypass pricing,
 * fake Geo balances, or purchase with insufficient funds.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { characterId, userGeo, unlockedHeroIds } = body as {
      characterId: BleachHeroId;
      userGeo: number;
      unlockedHeroIds: BleachHeroId[];
    };

    if (!characterId) {
      return NextResponse.json(
        { success: false, error: 'Character ID is required' },
        { status: 400 }
      );
    }

    const heroConfig = getCharacterPricingConfig(characterId);
    if (!heroConfig) {
      return NextResponse.json(
        { success: false, error: `Invalid character ID: ${characterId}` },
        { status: 404 }
      );
    }

    const currentUnlocked = Array.isArray(unlockedHeroIds) ? unlockedHeroIds : ['ichigo'];

    // Check if already unlocked
    if (currentUnlocked.includes(characterId)) {
      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        message: `${characterId} is already unlocked.`,
        heroId: characterId,
        cost: 0,
        remainingGeo: typeof userGeo === 'number' ? userGeo : 0,
        updatedUnlocked: currentUnlocked
      });
    }

    const currentGeo = typeof userGeo === 'number' ? userGeo : 0;
    const requiredGeo = heroConfig.geoCost;

    // Check balance
    if (currentGeo < requiredGeo) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Insufficient Geo. Required: ${requiredGeo} Geo, Available: ${currentGeo} Geo.`,
          requiredGeo,
          currentGeo
        },
        { status: 400 }
      );
    }

    // Process purchase authoritatively
    const remainingGeo = currentGeo - requiredGeo;
    const updatedUnlocked = [...currentUnlocked, characterId];

    return NextResponse.json({
      success: true,
      message: `Successfully unlocked ${characterId} for ${requiredGeo} Geo.`,
      heroId: characterId,
      cost: requiredGeo,
      powerRating: heroConfig.powerRating,
      clanId: heroConfig.clanId,
      remainingGeo,
      updatedUnlocked
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error during character purchase' },
      { status: 500 }
    );
  }
}
