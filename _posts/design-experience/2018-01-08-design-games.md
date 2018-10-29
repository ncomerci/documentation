---
date: 2018-01-08
title: Design constraints for games
description: What you need to keep in mind when designing a game for Decentraland.
categories:
  - design-experience
type: Document
set: design-experience
set_order: 8
---

This document covers some key points to consider when designing a game for Decentraland. Considerations such as the adjacency of other scenes and the distributed ownership of the LAND make Decentraland a unique place that requires you to reconsider assumptions you may have from previous games.

For instance, you must understand that, unlike in other game platforms, Decentraland games don’t exist in a vacuum. You don’t have control over what’s in adjacent scenes, and you don’t have control over certain details like the player’s avatars or items they could bring in from other games. This opens the door to exciting possibilities, and requires you to think about game mechanics differently.

The closest thing in mainstream games right now is Roblox, where content that’s generated by users in the community can then be a meeting place for others to explore, play, and interact. Unlike Roblox, you navigate scenes not by browsing a menu of unrelated experiences but by physically exploring a terrain where all scenes are adjacent to each other. Decentraland also makes use of the blockchain as a way to manage ownership of land, avatars, assets, etc.

We're continually improving the SDK, so some of the following limitations will be removed with future updates before Decentraland is opened to end users.

## Scene boundaries

**Your game must fit entirely in the _LAND_ that your scene is built upon.** For small scenes, think of games like soccer where the rules of the game keep the relevant interaction within a confined space, even though players are able to step outside of the playing field. Users can walk outside of a scene’s boundaries, but any asset or entities that belong to the scene must stay within the scene.

Users that step outside your scene keep rendering it as long as it’s at a visible range. If they walk away too far, they will stop rendering it entirely.

You could also build a game that spreads out throughout several disconnected plots of land that are unknown to players, and where the exploration of the rest of the world becomes part of the gameplay.

#### User inventory

**There currently isn’t an inventory where users can store game items as they walk between scenes.** The following alternatives are available today:

- You can store inventory information in the scene itself and link it to each user’s Ethereum address (this can be used as a persistent id). This information would only be readable from your scene.
- You can use an external custom storage and sync all of your scenes to it. This is a more robust solution that can deal with larger volumes of users. It can also extend the access to this inventory to multiple separate scenes that you or others own.
- Use tokens in the blockchain to handle the ownership of items.

  When earning a game item, it could be stored as a special token in a user’s Ethereum wallet. When a user that possesses the token walks into your scene, your scene could grant the user certain characteristics within the game.

  Other scenes could potentially also respond to the same token in different ways, which can make for interesting interplay between games.

  The downside of using the blockchain to store inventory items is that all transactions have a cost for the user and aren’t immediate. Read more about the blockchain in a specialized section further below.

In future releases, users will have an inventory they carry everywhere which will include both on-chain and off-chain assets.

#### Portable experiences

In future releases, we plan to add the ability to develop what we call _portable experiences_ with our SDK. These will be parts of the gameplay that users take with them when they leave your scene and move through the rest of the metaverse. For example, a user could take a snowball from your scene, walk away to another scene, and throw the snowball to another user who’s also playing the same game.

Users will have a way to turn these portable experiences on or off as they please.

Keep in mind that users might be using someone else’s portable experience while on your scene, this adds an element of unpredictability to how they might interact.

## Game Persistence

**Decentraland is a persistent world, your scene can be visited by users at any time.** Your scene has no startup phase and no ending, so you should design the game mechanics in a way that allows players that walk in or out at any time to also participate.

Your scene could have a reset mechanism that sets it to an initial state, but you should be careful not to disrupt the game for players who are already playing.

#### Sync scene state

**Currently, scene states aren't shared between players unless manually implemented.** This is the simplest way to build a scene, but it’s not ideal for social experiences.

In future versions of the SDK, default scenes will share state information between users in a peer to peer manner, at least for part of the scene data. Peer to peer has the advantage of needing no servers, but it can lead to significant latency, as users could have poor internet connections or be geographically far away. If no users are currently near the scene and loading it, the scene will reset to a default state the next time it’s loaded.

**You can host your own server to store information about your scene and keep all players in sync with it.** This ensures good connection speeds and keeps the scene running continuously even when no users are near. If you do this, your latency limitations would be no different to any other massively played online games.

Hosting your own server is also a recommended safety measure for games that involve transactions with valuable game items, as peer to peer connections place trust in the user that assumes the role of server.

> Note: In future releases, we will provide code examples for how to implement your own server.

#### Game timing

**Games that use peer to peer connections should take into account that there could be lag between users** and shouldn’t rely on fast reactions between the actions of different users. We recommend games that are turn based, or that are mostly based on player versus environment interactions.

For games where the timing of actions between players is critical, like a first person shooter, you should implement your own server as a real-time authoritative source of truth between all players in your scene.

## Players in the scene

**Players are identified in Decentraland using their Ethereum wallet address.** This wallet is used as a persistent ID that’s already associated with all of the tokens that the user owns.

**There is no way to limit how many players can be present in Decentraland at the same time.** Unlike a lot of other games where there may be different game sessions hosted in separate servers, there’s only one instance of Decentraland shared between all players.

You need to keep in mind that there may be several players walking around your scene at any given time. Some of them might be walking through and not participating in the game. Make sure that the game mechanics can’t be easily disrupted by this.

**The game loop of your scene can’t affect users directly**, the scene has a reactive approach to the user’s actions. There will be exceptions to this, such as elevators or cars that can move the user.

As the owner of a scene, you can’t forcefully push or teleport an offending user out of your scene. However, you will be able to blacklist users in the signaling server. You can also implement a blacklist in your scene’s code and deny certain services to blacklisted users.

## Scene content limitations

**Please build your scene being extra careful with the efficiency of your code.** Decentraland needs to run on web browsers and mobile devices, and users will be rendering multiple scenes at the same time as they walk through the metaverse.

**You should also try to keep the scene lightweight.** Unlike other online games where the same textures and assets are conveniently repeated throughout a large open world, in Decentraland every scene could have its own completely different set of assets. As users walk through multiple scenes, they should be able to download the entirety of the scene content, including textures, sound files, etc at a reasonable speed.

Because of this, we’ve imposed some limits to prevent excessive use of computational resources. See [scene limitations]({{ site.baseurl }}{% post_url /development-guide/2018-01-06-scene-limitations %}) for details on what these limits are.

## Access to scenes

**The map of Decentraland is designed so that there are roads and public plazas,** these guarantee easy access to various parts of the map, regardless of what other people build. Plots of land that are not adjacent to any road or plaza run the risk of being walled out by neighbouring scenes, although we expect most scenes to be walkable and not block others out.

New users will start their experience in Genesis Plaza, in the center of the map, where they will be encouraged to follow some tutorial activities and then to explore the world.

Users can also manually type a URL for a specific coordinate in the Decentraland map to spawn to that location. You can also share links to URLs that have hard-coded initial coordinates.

Keep in mind that if a user starts at a location that is walled out or below the level of the terrain, it won’t be a pleasant experience. To avoid this, there’s a way you can define a specific location in your scene that is safe to spawn into.

In future releases, users will also be able to navigate the world rapidly using maps with spawn points, lists of popular locations, and friend locations. The SDK will also make it possible to add teleports in your scene that can transport to other parts of the world.

## User UI

**The default overlaid UI that users see when entering Decentraland is minimal.** You can add extra elements to that UI while a user is on your scene.

Currently, UI elements must be composed using in-world objects like planes and sprites, requiring custom implementations.

Future versions of the SDK will support toolkits and easier ways to implement UI widgets.

## Controller Inputs

**Your game controls should be limited to basic movements, and point and click.** We support mobile and Virtual Reality controllers, so we can't assume that everyone has a keyboard.

The current version of the SDK supports only one type of click, but future versions will soon support two types of clicks, one of which might be treated as jump.

## Avatars

**Currently, users can only choose from a set of default avatars.** These avatars remain consistent as they walk through any part of the world.

In future versions of Decentraland, customizable avatars will be possible. Users will be able to purchase custom avatars that will be traded as Ethereum tokens in the marketplace.

Users will also be able to craft and sell their own avatars. The same will eventually also apply to wearable items and avatar emote expressions.

## Communication between users

**Users are able to chat with each other. Avatars currently have no way to convey body language beyond the use of basic movement controls.**

In future releases they will also be able to do voice chat and to perform gestures like dancing or frowning with their avatars. They will also be able to display a temporary emoji above their avatar to express themselves. Users will also be able to display tokens they own so that other users can see them.

## Game notifications

**There currently is no cross-scene notification system.** Any game requiring notifications displayed outside of the current scene is going to have to implement them using an external service.

In future releases of the SDK, notifications outside a scene could be handled by the scripts in portable experiences.

## Using the blockchain

**In Decentraland, the blockchain is used to store information about ownership.** Today this mostly refers to LAND ownership, but it can also be used ownership of game items, wearables, special avatars, emotes, and tokens that can ensure certain game privileges or access to games.

The blockchain isn’t used to store the game state, user position or anything that needs to change in real time.

#### LAND and MANA

**Users don’t need to own any parcels of land to participate in the metaverse.** In fact, the vast majority of users won’t. User avatars and the LAND tokens that they own aren’t connected in any direct way.

**Users don’t need to previously own an Ethereum wallet or MANA tokens to enter Decentraland.** If your gameplay relies heavily on owning tokens, you would be excluding most players. A freemium game model could be an ideal way to tailor to both user bases.

#### Other NFTs

**You can use special non-fungible tokens (NFTs) to represent game items, custom avatars or wearables.** If a user owns one of these tokens, your scene could respond to it in different ways.

Read about what NFTs are in [this blogpost](https://decentraland.org/blog/technology/what-are-nfts).

#### In-game transactions

**Your scene can support blockchain transactions for users to buy or earn tokens.**

Blockchain transactions aren’t immediate, they require verification times and have a cost in Ether, both the time and cost vary depending on the current usage of the network.

Decentraland is working on creating a side-chain that will be able to handle transactions faster and cheaper than the Ethereum network. This side-chain will be ideal for in-game transactions, as changes can occur closer to real time and at a very low cost. The main Ethereum chain will still be recommended for transactions that require higher security and that can afford to be more expensive and take longer.

The user must always approve these transactions explicitly on their Ethereum client. For example when using Metamask, Metamask prompts the user to accept each transaction before it’s processed.

Users could also sign a contract that automatically approves all transactions requested by a specific address or within certain constraints, so as to avoid interruptions to approve transactions.

You can also use smart contracts to condition transactions based on custom conditions. For example, users could stake a bet on the outcome of a game, and the corresponding payments would occur automatically as soon as the outcome is known.

As a safety measure, we don’t recommend carrying out in-game transactions in scenes that are hosted peer to peer. Peer to peer connections place trust in the user that assumes the role of server.

To implement blockchain interactions in your scene’s code, you must use external libraries that interface with the Ethereum network. Future releases of the SDK will provide a custom API to expose these functionalities in a simpler way.