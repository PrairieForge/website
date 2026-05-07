/**
 * Webhook Handler for Resend Event: Email Received
 *
 * POST /api/resend-inbound
 *
 * Handles incoming webhook events from Resend including:
 * - email.received: New inbound email arrived
 *
 * IMPORTANT: Always verify webhook signatures to prevent spoofed events!
 *
 * @see https://resend.com/docs/dashboard/webhooks/introduction
 */

import type { APIRoute } from "astro";
import {
  type GetReceivingEmailResponseSuccess,
  type WebhookEventPayload,
} from "resend";

import { resend } from "#/lib/resend";

// Enable on-demand rendering: https://docs.astro.build/en/guides/on-demand-rendering/#enabling-on-demand-rendering
export const prerender = false;

// Get constants from .env file. Must set .env variables on deployment servers as well.
// JSON.parse to handle string to object conversion
const RESEND_FROM = import.meta.env.RESEND_FROM;
const RESEND_WEBHOOK_SECRET = import.meta.env.DEV
  ? import.meta.env.RESEND_WEBHOOK_SECRET_DEV
  : import.meta.env.RESEND_WEBHOOK_SECRET_PROD;
const RESEND_TOPICS = JSON.parse(import.meta.env.RESEND_TOPICS);
const RESEND_SEGMENTS = JSON.parse(import.meta.env.RESEND_SEGMENTS);

const buildName = (email: GetReceivingEmailResponseSuccess) => {
  const suffix = `(${email.from})`;
  const ellipsis = "...";
  const max = 70;
  const words = email.subject.split(" ");

  let fit = fitWords(words, max - suffix.length);
  const truncated = fit !== email.subject.trim();

  const from = `${truncated ? ellipsis : ""}${suffix.trimStart()}`;
  if (truncated) {
    fit = fitWords(words, max - from.length);
  }

  return `${fit}${from}`.trim();
};

const fitWords = (words: string[], available: number) => {
  if (available <= 0) return "";

  let subject = "";
  for (const word of words) {
    const next = subject ? `${subject} ${word}` : word;
    if (next.length > available) break;
    subject = next;
  }

  if (!subject && words[0]) {
    subject = words[0].slice(0, available);
  }

  return subject;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the raw payload for signature verification
    const payload = await request.text();

    // Extract Svix headers for verification
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    // Verify webhook signature (CRITICAL for security!)
    // Without this, attackers could send fake events to your endpoint
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.warn("Missing Svix headers - rejecting webhook");
      return new Response(
        JSON.stringify({ error: "Missing webhook signature headers" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Get the webhook secret from environment
    if (!RESEND_WEBHOOK_SECRET) {
      console.error("RESEND_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Verify the webhook signature
    let result: WebhookEventPayload;
    try {
      result = resend.webhooks.verify({
        payload,
        headers: {
          id: svixId,
          timestamp: svixTimestamp,
          signature: svixSignature,
        },
        webhookSecret: RESEND_WEBHOOK_SECRET,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid webhook signature" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // 1. Add a guard clause to ensure the event type is `email.received`.
    if (result.type !== "email.received") {
      console.warn("Unhandled event type:", result.type);
      return new Response(
        JSON.stringify({
          received: true,
          type: result.type,
          message: "This endpoint is for `email.received` only.",
        }),
        {
          status: 200,
        },
      );
    }

    // 2. Check that contact is authorized sender. Must have property authorized_sender set to 'true'
    const { data: contact, error: contactError } = await resend.contacts.get({
      email: result.data.from,
    });

    if (contactError) {
      console.error("Failed to fetch contacts:", contactError);
      throw new Error(`Failed to fetch email: ${contactError.message}`);
    }

    if (!contact || contact.properties?.authorized_sender?.value !== "true") {
      console.warn(`Unauthorized sender: "${result.data.from}"`);
      return new Response(
        JSON.stringify({
          received: true,
          type: result.type,
          message: `Unauthorized sender: "${result.data.from}"`,
        }),
        {
          status: 200,
        },
      );
    }

    // 3. Get the incoming email's content
    const { data: email, error: emailError } =
      await resend.emails.receiving.get(result.data.email_id);

    if (emailError || !email) {
      console.error("Failed to fetch email content:", emailError);
      throw new Error(
        `Failed to fetch email: ${emailError?.message ?? "No email returned"}`,
      );
    }

    // 4. Create & Send broadcast
    // Get segmentId and topicId
    const recipient = email.to?.[0];
    if (!recipient) {
      console.error("Missing recipient");
      throw new Error("Missing recipient");
    }

    const localPart = recipient.split("@")[0];
    const [segment, topic] = localPart.split("+");

    const segmentId = RESEND_SEGMENTS[segment] ?? null;
    const topicId = topic ? (RESEND_TOPICS[topic] ?? null) : null;

    if (!segmentId) {
      console.error(`Invalid segmentId: "${segment}"`);
      return new Response(
        JSON.stringify({
          received: true,
          type: result.type,
          message: `Invalid segmentId: "${segment}"`,
        }),
        {
          status: 200,
        },
      );
    }

    const name = buildName(email);

    // Create broadcast
    const { data: broadcast, error: createBroadcastError } =
      await resend.broadcasts.create({
        segmentId,
        topicId,
        from: RESEND_FROM,
        subject: email.subject,
        html: email.html ?? "",
        text: email.text ?? "",
        replyTo: email.from,
        name,
      });

    if (createBroadcastError) {
      console.error("Failed to create broadcast:", createBroadcastError);
      throw new Error(
        `Failed to create broadcast: ${createBroadcastError.message}`,
      );
    }

    // Send broadcast
    const { error: sendBroadcastError } = await resend.broadcasts.send(
      broadcast.id,
    );

    if (sendBroadcastError) {
      console.error("Failed to send broadcast:", sendBroadcastError);
      throw new Error(
        `Failed to send broadcast: ${sendBroadcastError.message}`,
      );
    }

    // Always return 200 to acknowledge receipt
    // Non-200 responses will cause Resend to retry
    return new Response(JSON.stringify({ received: true, type: result.type }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response(
      JSON.stringify({ error: `Internal server error: ${err}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
