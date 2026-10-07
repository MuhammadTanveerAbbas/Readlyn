import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Readlyn collects, uses, plus protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 6, 2026">
      <section>
        <h2 className="font-sans text-lg font-semibold text-white mb-2">
          What we collect
        </h2>
        <p>
          When you create an account, we store your email address plus
          authentication credentials through Supabase Auth. When you use
          Readlyn, we store your projects, canvas data, generation history,
          plus any images you upload to Parallax Studio in our Supabase
          database plus storage.
        </p>
      </section>

      <section>
        <h2 className="font-sans text-lg font-semibold text-white mb-2">
          How we use your data
        </h2>
        <p>
          Your data is used solely to operate the product: saving your work,
          authenticating your session, plus sending prompts to Groq AI to
          generate infographics. We do not sell your personal data.
        </p>
      </section>

      <section>
        <h2 className="font-sans text-lg font-semibold text-white mb-2">
          Third-party services
        </h2>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>
            <strong className="text-[var(--text-secondary)]">Supabase</strong>{" "}
            for authentication, database, plus file storage
          </li>
          <li>
            <strong className="text-[var(--text-secondary)]">Groq</strong> for
            AI text generation from your prompts (prompt content is sent to
            Groq&apos;s API)
          </li>
          <li>
            <strong className="text-[var(--text-secondary)]">Upstash Redis</strong>{" "}
            for rate limiting (user IDs are used as rate-limit keys, not stored
            permanently)
          </li>
          <li>
            <strong className="text-[var(--text-secondary)]">Vercel</strong> for
            application hosting
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-sans text-lg font-semibold text-white mb-2">
          Data retention plus deletion
        </h2>
        <p>
          Your projects plus account data are kept until you delete them or
          delete your account from Settings. Account deletion permanently
          removes your user record plus associated data from our systems.
        </p>
      </section>

      <section>
        <h2 className="font-sans text-lg font-semibold text-white mb-2">
          Contact
        </h2>
        <p>
          Questions about privacy? Open an issue on{" "}
          <a
            href="https://github.com/MuhammadTanveerAbbas/Readlyn/issues"
            className="text-[var(--accent)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
