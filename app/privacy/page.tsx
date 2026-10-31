import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Readlyn collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 31, 2026">
      <section>
        <h2 className="font-sans text-lg font-semibold text-[var(--text-primary)] mb-2">
          What we collect
        </h2>
        <p>
          When you create an account, we store your email address and
          authentication credentials through Supabase Auth. When you use
          Readlyn, we store your projects, canvas data, generation history,
          uploaded assets, and generated infographics in our Supabase database
          and storage.
        </p>
      </section>

      <section>
        <h2 className="font-sans text-lg font-semibold text-[var(--text-primary)] mb-2">
          How we use your data
        </h2>
        <p>
          Your data is used solely to operate the product: saving your work,
          authenticating your session, and sending prompts to Groq AI to
          generate infographics. We do not sell your personal data.
        </p>
      </section>

      <section>
        <h2 className="font-sans text-lg font-semibold text-[var(--text-primary)] mb-2">
          Third-party services
        </h2>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>
            <strong className="text-[var(--text-secondary)]">Supabase</strong>{" "}
            for authentication, database, and file storage
          </li>
          <li>
            <strong className="text-[var(--text-secondary)]">Groq</strong> for
            AI text generation from your prompts (prompt content is sent to
            Groq&apos;s API)
          </li>
          <li>
            <strong className="text-[var(--text-secondary)]">Vercel</strong> for
            application hosting
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-sans text-lg font-semibold text-[var(--text-primary)] mb-2">
          Data retention and deletion
        </h2>
        <p>
          Your projects and account data are kept until you delete them or
          delete your account from Settings. Account deletion permanently
          removes your user record and associated data from our systems.
        </p>
      </section>

      <section>
        <h2 className="font-sans text-lg font-semibold text-[var(--text-primary)] mb-2">
          Contact
        </h2>
        <p>
          Questions about privacy? Open an issue on{" "}
          <a
            href="https://github.com/MuhammadTanveerAbbas/Readlyn/issues"
            className="text-[var(--accent-text)] hover:underline"
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
