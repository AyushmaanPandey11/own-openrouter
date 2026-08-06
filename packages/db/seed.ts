import { prisma } from "./index";

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Companies ----
  const openai = await prisma.company.create({
    data: { name: "OpenAI", website: "https://openai.com" },
  });
  const anthropic = await prisma.company.create({
    data: { name: "Anthropic", website: "https://anthropic.com" },
  });
  const google = await prisma.company.create({
    data: { name: "Google DeepMind", website: "https://deepmind.google" },
  });

  // ---- Providers ----
  const togetherAi = await prisma.provider.create({
    data: { name: "Together AI", website: "https://together.ai" },
  });
  const fireworks = await prisma.provider.create({
    data: { name: "Fireworks AI", website: "https://fireworks.ai" },
  });
  const anthropicProvider = await prisma.provider.create({
    data: { name: "Anthropic Direct", website: "https://anthropic.com" },
  });

  // ---- Models ----
  const gpt4o = await prisma.model.create({
    data: { name: "GPT-4o", slug: "gpt-4o", companyId: openai.id },
  });
  const gpt4oMini = await prisma.model.create({
    data: { name: "GPT-4o Mini", slug: "gpt-4o-mini", companyId: openai.id },
  });
  const claudeSonnet = await prisma.model.create({
    data: {
      name: "Claude Sonnet 5",
      slug: "claude-sonnet-5",
      companyId: anthropic.id,
    },
  });
  const claudeHaiku = await prisma.model.create({
    data: {
      name: "Claude Haiku 4.5",
      slug: "claude-haiku-4-5",
      companyId: anthropic.id,
    },
  });
  const gemini = await prisma.model.create({
    data: {
      name: "Gemini 2.5 Pro",
      slug: "gemini-2-5-pro",
      companyId: google.id,
    },
  });
  const gemini3Flash = await prisma.model.create({
    data: {
      name: "Gemini 3 Flash Preview",
      slug: "gemini-3-flash-preview",
      companyId: google.id,
    },
  });

  // ---- ModelProviderMappings ----
  const mapping1 = await prisma.modelProviderMapping.create({
    data: {
      modelId: gpt4o.id,
      providerId: togetherAi.id,
      inputTokenCost: 5,
      outputTokenCost: 15,
    },
  });
  const mapping2 = await prisma.modelProviderMapping.create({
    data: {
      modelId: gpt4oMini.id,
      providerId: fireworks.id,
      inputTokenCost: 1,
      outputTokenCost: 4,
    },
  });
  const mapping3 = await prisma.modelProviderMapping.create({
    data: {
      modelId: claudeSonnet.id,
      providerId: anthropicProvider.id,
      inputTokenCost: 3,
      outputTokenCost: 15,
    },
  });
  const mapping4 = await prisma.modelProviderMapping.create({
    data: {
      modelId: claudeHaiku.id,
      providerId: anthropicProvider.id,
      inputTokenCost: 1,
      outputTokenCost: 5,
    },
  });
  const mapping5 = await prisma.modelProviderMapping.create({
    data: {
      modelId: gemini.id,
      providerId: togetherAi.id,
      inputTokenCost: 2,
      outputTokenCost: 8,
    },
  });
  const mapping6 = await prisma.modelProviderMapping.create({
    data: {
      modelId: gemini3Flash.id,
      providerId: togetherAi.id,
      inputTokenCost: 1,
      outputTokenCost: 3,
    },
  });

  // ---- Users ----
  // NOTE: passwords are plain dummy strings here for seed purposes only.
  // In real signup flow these should be hashed (e.g. with bcrypt) before storage.
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      username: "alice",
      password: "dummy-hashed-password-1",
      credits: 500,
    },
  });
  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      username: "bob",
      password: "dummy-hashed-password-2",
      credits: 100,
    },
  });

  // ---- ApiKeys ----
  const aliceKey = await prisma.apiKey.create({
    data: {
      userId: alice.id,
      name: "Alice's default key",
      apikey: "sk-dummy-alice-key-abc123",
      creditsConsumed: 25,
    },
  });
  const bobKey = await prisma.apiKey.create({
    data: {
      userId: bob.id,
      name: "Bob's default key",
      apikey: "sk-dummy-bob-key-xyz789",
      creditsConsumed: 5,
    },
  });

  // ---- OnRampTransactions ----
  await prisma.onRampTransaction.createMany({
    data: [
      { userId: alice.id, amount: 1000, status: "SUCCESS" },
      { userId: alice.id, amount: 200, status: "FAILED" },
      { userId: bob.id, amount: 500, status: "PROCESSING" },
    ],
  });

  // ---- Conversations ----
  await prisma.conversation.createMany({
    data: [
      {
        userId: alice.id,
        apiKeyId: aliceKey.id,
        modelProviderMappingId: mapping1.id,
        input: "What's the capital of France?",
        output: "The capital of France is Paris.",
        inputTokenCount: 8,
        outputTokenCount: 7,
      },
      {
        userId: alice.id,
        apiKeyId: aliceKey.id,
        modelProviderMappingId: mapping3.id,
        input: "Summarize the plot of Hamlet in one sentence.",
        output:
          "A Danish prince seeks revenge against his uncle for murdering his father and usurping the throne.",
        inputTokenCount: 11,
        outputTokenCount: 18,
      },
      {
        userId: bob.id,
        apiKeyId: bobKey.id,
        modelProviderMappingId: mapping2.id,
        input: "Write a haiku about autumn.",
        output:
          "Leaves drift silently / Crimson blankets cover ground / Cold winds whisper near",
        inputTokenCount: 6,
        outputTokenCount: 20,
      },
      {
        userId: bob.id,
        apiKeyId: bobKey.id,
        modelProviderMappingId: mapping6.id,
        input: "Give me a quick fact about octopuses.",
        output: "Octopuses have three hearts and blue, copper-based blood.",
        inputTokenCount: 7,
        outputTokenCount: 10,
      },
    ],
  });

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
