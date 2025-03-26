// supabase/functions/dialogflow-proxy/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts"

const DIALOGFLOW_API_URL = Deno.env.get("DIALOGFLOW_API_URL")
const DIALOGFLOW_PROJECT_ID = Deno.env.get("DIALOGFLOW_PROJECT_ID")
const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS") || "{}")

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, x-client-info, apikey",
  "Access-Control-Max-Age": "86400",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  try {
    const { message, event, sessionId } = await req.json()

    // Create JWT token for Google auth
    const token = await createGoogleJWT(GOOGLE_APPLICATION_CREDENTIALS)

    // Get Google auth token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: token,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      throw new Error("Authentication failed")
    }

    // Prepare request body for Dialogflow
    const requestBody: any = {}

    // Add query input based on whether it's a text or event query
    if (message) {
      requestBody.queryInput = {
        text: {
          text: message,
          languageCode: "en-US",
        },
      }
    } else if (event) {
      requestBody.queryInput = {
        event: {
          name: event,
          parameters: {},
          languageCode: "en-US",
        },
      }
    }

    // Forward to Dialogflow with proper auth
    const dfResponse = await fetch(
      `${DIALOGFLOW_API_URL}/projects/${DIALOGFLOW_PROJECT_ID}/agent/sessions/${sessionId}:detectIntent`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    )

    const data = await dfResponse.json()

    // Return the raw Dialogflow response
    return new Response(
      JSON.stringify({
        fulfillmentText: data.queryResult.fulfillmentText,
        intent: {
          displayName: data.queryResult.intent?.displayName,
          name: data.queryResult.intent?.name,
        },
        parameters: data.queryResult.parameters,
        outputContexts: data.queryResult.outputContexts,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error in Dialogflow proxy:", error)

    // Return error response with CORS headers
    return new Response(
      JSON.stringify({
        fulfillmentText: "I'm having trouble connecting right now. Please try again later.",
        intent: { displayName: "Default Fallback Intent", name: "Default Fallback Intent" },
        parameters: {},
        outputContexts: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  }
})

/**
 * Creates a JWT token for Google API authentication
 * @param credentials Google service account credentials
 * @returns JWT token string
 */
async function createGoogleJWT(credentials) {
  if (!credentials.private_key || !credentials.client_email) {
    throw new Error("Invalid credentials: missing private_key or client_email")
  }

  const now = Math.floor(Date.now() / 1000)

  // Create JWT payload according to Google's requirements
  const payload = {
    iss: credentials.client_email,
    sub: credentials.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600, // Token valid for 1 hour
    scope: "https://www.googleapis.com/auth/dialogflow",
  }

  // Convert PEM private key to crypto key
  const pemHeader = "-----BEGIN PRIVATE KEY-----"
  const pemFooter = "-----END PRIVATE KEY-----"
  const pemContents = credentials.private_key.substring(
    pemHeader.length,
    credentials.private_key.length - pemFooter.length - 1,
  )

  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  )

  // Create and sign the JWT
  const jwt = await create({ alg: "RS256", typ: "JWT" }, payload, cryptoKey)

  return jwt
}

