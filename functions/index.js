/**
 * Discord OAuth → Firebase custom token
 *
 * Secrets (set before deploy):
 *   firebase functions:config:set discord.client_id="..." discord.client_secret="..."
 *
 * Or with params / Secret Manager later.
 *
 * Deploy:
 *   cd functions && npm install
 *   firebase deploy --only functions:exchangeDiscordCode
 */

const cors = require("cors")({ origin: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

function getDiscordConfig() {
  const cfg = functions.config().discord || {};
  return {
    clientId: cfg.client_id || process.env.DISCORD_CLIENT_ID || "",
    clientSecret: cfg.client_secret || process.env.DISCORD_CLIENT_SECRET || ""
  };
}

function discordAvatarUrl(user) {
  if (!user || !user.id) {
    return "";
  }

  if (user.avatar) {
    const ext = String(user.avatar).startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
  }

  const index =
    user.discriminator && user.discriminator !== "0"
      ? Number(user.discriminator) % 5
      : Number(BigInt(user.id) >> 22n) % 6;

  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

exports.exchangeDiscordCode = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Use POST" });
      return;
    }

    try {
      const { clientId, clientSecret } = getDiscordConfig();

      if (!clientId || !clientSecret) {
        res.status(500).json({
          error:
            "Discord secrets are not configured on the Cloud Function."
        });
        return;
      }

      const code = req.body && req.body.code;
      const redirectUri = req.body && req.body.redirectUri;

      if (!code || !redirectUri) {
        res.status(400).json({
          error: "Missing code or redirectUri"
        });
        return;
      }

      const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: String(code),
        redirect_uri: String(redirectUri)
      });

      const tokenRes = await fetch(
        "https://discord.com/api/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body
        }
      );

      const tokenJson = await tokenRes.json();

      if (!tokenRes.ok) {
        console.error("Discord token error:", tokenJson);
        res.status(401).json({
          error: "Discord token exchange failed",
          details: tokenJson
        });
        return;
      }

      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${tokenJson.access_token}`
        }
      });

      const discordUser = await userRes.json();

      if (!userRes.ok || !discordUser.id) {
        console.error("Discord user error:", discordUser);
        res.status(401).json({
          error: "Could not load Discord profile"
        });
        return;
      }

      const uid = `discord:${discordUser.id}`;
      const displayName =
        discordUser.global_name ||
        discordUser.username ||
        "Discord user";
      const photoURL = discordAvatarUrl(discordUser);
      const email = discordUser.email || undefined;

      try {
        await admin.auth().getUser(uid);
        await admin.auth().updateUser(uid, {
          displayName,
          photoURL: photoURL || undefined,
          email
        });
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          await admin.auth().createUser({
            uid,
            displayName,
            photoURL: photoURL || undefined,
            email,
            emailVerified: Boolean(discordUser.verified && email)
          });
        } else {
          throw error;
        }
      }

      const firebaseToken = await admin.auth().createCustomToken(uid, {
        provider: "discord",
        discordId: discordUser.id,
        username: discordUser.username || ""
      });

      res.status(200).json({
        token: firebaseToken,
        profile: {
          uid,
          displayName,
          photoURL,
          email: email || null
        }
      });
    } catch (error) {
      console.error("exchangeDiscordCode failed:", error);
      res.status(500).json({
        error: error.message || "Discord sign-in failed"
      });
    }
  });
});
