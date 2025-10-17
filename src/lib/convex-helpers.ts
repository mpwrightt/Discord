import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api.js';

export interface DiscordIdentity {
  id: string;
  username: string;
}

export async function getOrCreateUserOrThrow(
  convex: ConvexHttpClient,
  identity: DiscordIdentity
) {
  const user = await convex.mutation(api.users.getOrCreateUser, {
    discordId: identity.id,
    username: identity.username,
  });

  if (!user) {
    throw new Error('Failed to load user record');
  }

  return user;
}
