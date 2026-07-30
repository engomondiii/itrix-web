/**
 * THE FOUR LEGAL INSTRUMENTS — routes, metadata and body copy.
 *
 * Source: itriX Legal Instruments v1.0 (the counsel-review bundle). This module
 * is the WEB rendering of those instruments; the bundle remains the document of
 * record and counsel edits it there.
 *
 * Playbook v1.7 Part XVII · Architecture v2.7 §19.10 · Surface 1 v6.0 §1.1
 *
 * ── THIS IS A DRAFT, AND THE PAGES SAY SO ───────────────────────────────────
 * These instruments have NOT been reviewed by a qualified lawyer. Until they are,
 * every route renders `LEGAL_DRAFT_NOTICE` at the top and is `noindex`.
 * `NEXT_PUBLIC_LEGAL_PUBLISHED=true` removes the banner and makes them
 * indexable — flip it only after Schedule A of the bundle is answered in writing
 * and every bracketed placeholder below is filled.
 *
 * That is a deliberate deviation from Surface 1 v6.0 §1.1, which specifies the
 * routes as indexable. Publishing an unreviewed contract as the authoritative
 * terms of a commercial platform is a worse failure than a delayed index, and the
 * requirement the specification actually cares about — that the four instruments
 * EXIST, are reachable at every state and every width, and are linked from the
 * arrival screen — is met in full.
 *
 * ── PLACEHOLDERS ────────────────────────────────────────────────────────────
 * Square brackets mark a value counsel must supply. They render visibly, which is
 * intentional while the draft banner is up: an unfilled placeholder should be
 * impossible to miss on the page itself, not only in a checklist.
 */

export const LEGAL_PUBLISHED = (process.env.NEXT_PUBLIC_LEGAL_PUBLISHED ?? '').toLowerCase() === 'true';

export const LEGAL_DRAFT_NOTICE =
  'This is a draft pending review by qualified counsel. It is not yet in force and should not be relied on. ' +
  'For anything you need to act on today, please ask us and we will put you in touch with a named person.';

/**
 * PHASE 3. The strings around the assent checkbox (Playbook v1.7 §17B).
 *
 * NOTHING ABOUT THIS APPEARS ON THE ARRIVAL SCREEN. Asking a visitor to agree to a
 * contract before we have given them anything would break the one rule the whole
 * surface is built on, so assent is taken at workspace creation and nowhere else
 * (Architecture v2.7 §19.10).
 */
export const ASSENT_COPY = {
  sectionTitle: 'Before we create your workspace',
  checkboxPrefix: 'I agree to the',
  termsName: 'Terms of Service',
  privacyName: 'Privacy Policy',
  and: 'and the',
  blocked: 'Please accept the Terms and the Privacy Policy to continue.',

  keepTitle: 'What we keep',
  keepBody:
    'Creating a workspace keeps this conversation, anything itriX has prepared for you, and any files you attached. You can delete a conversation or a file at any time, and none of it is used to train, fine-tune or evaluate any model.',

  /** Shown at the next sign-in after a material version change. */
  reprompt: 'We have updated our Terms of Service. Please review and accept the new version to continue.',
  repromptSummary: 'What changed:',
} as const;

export interface LegalSection {
  heading: string;
  /** Paragraphs. A string starting with "· " renders as a list item. */
  body: string[];
}

export interface LegalInstrument {
  slug: 'terms' | 'privacy' | 'security' | 'disclosure-policy';
  /** The strip and nav label. Short. */
  navLabel: string;
  /** The page title and h1. */
  title: string;
  /** One sentence under the h1 — what this document is for. */
  standfirst: string;
  version: string;
  effective: string;
  sections: LegalSection[];
}

/** Strip labels, in order. Terms first because it is the operative agreement. */
export const LEGAL_STRIP_LABELS = ['Terms', 'Privacy', 'Security', 'Disclosure policy'] as const;

const VERSION = '1.0';
const EFFECTIVE = '[effective date]';

export const LEGAL_INSTRUMENTS: readonly LegalInstrument[] = [
  {
    slug: 'terms',
    navLabel: 'Terms',
    title: 'Terms of Service',
    standfirst: 'The agreement that governs your use of the itriX platform.',
    version: VERSION,
    effective: EFFECTIVE,
    sections: [
      {
        heading: 'Who we are, and what this covers',
        body: [
          'These Terms are a binding agreement between you and iTrix Co., Ltd (주식회사 아이트릭스), a company incorporated in the Republic of Korea, business registration number [registration number], registered office [registered address].',
          'They govern the itriX website, the conversational assessment surface, any workspace we make available to you, and anything we prepare and deliver to you through those surfaces.',
          'They do not govern a signed non-disclosure, evaluation, proof-of-concept or licence agreement between us. Those govern themselves, and where they conflict with these Terms, they prevail.',
          'If you are using the platform for an organisation, you confirm you have authority to bind it, and "you" means both you and that organisation.',
        ],
      },
      {
        heading: 'Confidentiality before an NDA',
        body: [
          'The platform is a pre-contractual surface. Please do not send us confidential information before a non-disclosure agreement is in place. We say so wherever you can describe a problem, and we say it here as a term:',
          'Please do not submit confidential technical information before an NDA. The initial assessment is based on non-confidential workload descriptions only.',
          'Unless and until a signed NDA covers the disclosure, you should treat anything you send as disclosed without confidentiality obligations on our part, other than the handling, security and retention commitments we make in the Privacy Policy and the Security Statement.',
          'If you send confidential material anyway, we apply restricted pre-NDA handling: shortened retention, encryption at rest, access limited to the owning conversation and the internal roles that require it, and deletion on your request. That is our practice, not a contractual undertaking of confidence, and it is not a substitute for an NDA.',
          'You may delete any file, or an entire conversation, at any time. Deletion removes the stored file, anything we extracted from it, and any excerpt derived from it.',
        ],
      },
      {
        heading: 'Your content',
        body: [
          'You own what you submit. Nothing here transfers ownership of it to us.',
          'You grant us a non-exclusive, worldwide, royalty-free licence to host, store, copy, transmit, display, scan, extract text from and analyse it, solely in order to operate the platform, respond to you in the conversation you submitted it to, prepare your output, comply with law, and protect the platform. That licence ends when the content is deleted or its retention period expires.',
          'Three limits on it, which we state as commitments rather than practice:',
          '· We do not use your content to train, fine-tune or evaluate any model.',
          '· We do not add it to the knowledge base the platform answers from, and we do not use it to answer any question other than yours.',
          '· We do not sell it, and we do not disclose it other than as described in the Privacy Policy.',
        ],
      },
      {
        heading: 'What we deliver, and what it is not',
        body: [
          'You may use, copy and share what we prepare for you within your organisation, for the purpose of evaluating whether to engage us further. Please do not publish it or disclose it outside your organisation without our written consent, because it may contain material disclosed to you under a controlled boundary.',
          'We retain all intellectual property in it, in the platform, in our methods, and in the technologies behind them — including those we refer to as AXIOM, CRE and FQNM, and the products we refer to as ALPHA Compute and ALPHA Core. Nothing here grants you a licence to any of them. A licence is granted only by a separate signed agreement.',
          'It is not a guarantee of performance. Before a proof of concept, our output contains no performance figures, and any statement about possible benefit is a hypothesis to be tested. Whether a transformation produces a measurable benefit in your environment depends on your workload, hardware, software stack, baseline and integration, and can only be established by measurement.',
          'It is not professional advice, and it does not replace domain validation or safety certification for anything you deploy. You remain responsible for the decisions you take.',
        ],
      },
      {
        heading: 'Personal data in what you send',
        body: [
          'The platform is built for workload descriptions, not personal data. Please do not attach files containing personal data, special-category data, health data, payment card data, government identifiers, or the personal data of anyone who has not been told you are sharing it, unless it is genuinely necessary and a data-processing agreement is in place.',
          'Where you do submit personal data, you are its controller and we process it on your behalf. We may ask you to enter a data-processing agreement, and may decline to process material until you do.',
        ],
      },
      {
        heading: 'Acceptable use',
        body: [
          'You must not, and must not permit anyone to:',
          '· use the platform unlawfully, or in breach of an export control, sanctions or trade regime;',
          '· attempt to obtain material you are not authorised to receive, including by manipulating a URL, a token, a file, a message, or an instruction embedded in a document;',
          '· attempt to derive or reverse-engineer our methods, models, prompts or knowledge base from our output or from the platform\u2019s behaviour;',
          '· probe or test the platform\u2019s security, except as permitted under the Security Statement;',
          '· upload malware, or content designed to disrupt or degrade the platform;',
          '· extract content at scale by automated means, or misrepresent who you act for;',
          '· resell or provide the platform to a third party as a service.',
          'We may rate-limit, suspend or terminate access where we reasonably believe any of the above is happening, and we may quarantine or refuse a file our scanning flags.',
        ],
      },
      {
        heading: 'Automated and AI-assisted responses',
        body: [
          'Parts of the platform generate responses automatically. You should know the following, and we would rather you heard it from us.',
          'Responses are prepared from approved material and are checked against our governance rules before they reach you. A response may be replaced by a notice while a specialist reviews it, or stopped part-way through. That is the system working as intended.',
          'Responses may still be incomplete or wrong. Please do not rely on one for a decision of consequence without confirming it with a named person, whom you can reach at any time from the conversation header.',
          'No automated response is an offer, a quotation, a commitment, a warranty or a legal interpretation, and none can vary these Terms, agree a price, grant a licence, waive a right, or create a confidentiality obligation. Only a signed writing from an authorised itriX signatory can do those things.',
          'An automated response may quote and cite these instruments. It will not interpret them for you. If you need an interpretation, ask for a person.',
        ],
      },
      {
        heading: 'Fees',
        body: [
          'Use of the public platform, including a Compute Bottleneck Review, is free. Paid engagements are governed by a separate written agreement or order form stating scope, fees, taxes, payment terms and deliverables. Fees exclude VAT and withholding taxes unless stated.',
        ],
      },
      {
        heading: 'Disclaimers and liability',
        body: [
          'The platform and our output are provided "as is" and "as available". To the fullest extent permitted by law we exclude all implied warranties, including merchantability, fitness for a particular purpose and non-infringement.',
          'We do not warrant that the platform will be uninterrupted or error-free, that a response will be accurate or complete, that a hypothesis will be borne out by measurement, or that any particular runtime, memory, energy, accuracy, conservation, reproducibility or cost result will be achieved.',
          'Neither party is liable for indirect, special, incidental, consequential or punitive loss, or for loss of profit, revenue, anticipated saving, business, goodwill or data.',
          'Our total aggregate liability is limited to the greater of [liability cap] and the fees you paid us in the twelve months before the event giving rise to the claim. Where you use the platform without paying a fee, it is limited to [free-tier cap].',
          'Nothing here excludes liability that cannot lawfully be excluded, including for death or personal injury caused by negligence, or for fraud.',
        ],
      },
      {
        heading: 'Changes, law and disputes',
        body: [
          'We may change these Terms. Each version carries a version number and an effective date. For a change that materially affects your rights we will give at least [notice period] days\u2019 notice on the platform and, where you hold a workspace, by email — and we will ask you to accept the new version at your next sign-in.',
          'These Terms are governed by the laws of the Republic of Korea. Where you are established in Korea, the Korean courts have exclusive jurisdiction and the Seoul Central District Court is the court of first instance.',
          'Where you are established outside Korea, the parties will first attempt to resolve the dispute in good faith for [escalation period] days; failing that it is finally settled by arbitration under the [arbitration rules] administered by [arbitration body], seated in [seat], before [number] arbitrator(s), in [language]. Either party may seek interim relief from a court to protect its intellectual property or confidential information.',
          'Nothing in this section deprives you of a mandatory protection or forum available under the law of your place of establishment.',
          'These Terms are prepared in English and Korean. [Controlling language] governs in the event of conflict. Notices to us: [legal email].',
        ],
      },
    ],
  },

  {
    slug: 'privacy',
    navLabel: 'Privacy',
    title: 'Privacy Policy',
    standfirst: 'What we collect, why, for how long, and how you exercise your rights.',
    version: VERSION,
    effective: EFFECTIVE,
    sections: [
      {
        heading: 'Our position, in one paragraph',
        body: [
          'We collect what we need to answer you, and we do not use what you tell us to train anything or to answer anybody else. A conversation you start without an account is kept against your browser session for a limited period and then deleted. Files you attach are scanned, read for text, kept for a short window if you send them before an NDA, and deleted whenever you ask.',
          'iTrix Co., Ltd (주식회사 아이트릭스), [registered address], is the controller. Privacy contact: [privacy email].',
        ],
      },
      {
        heading: 'What we collect',
        body: [
          '· Conversation content — the text of your messages, the prompts you select, your conversation titles.',
          '· Attachments — files you attach, and the text we extract from them.',
          '· Workspace data — name, business email, organisation, role, credentials, invitation records.',
          '· Assent records — which version of these instruments you accepted, and when.',
          '· Support and relationship data — support requests, meeting notes, feedback, agreed outcomes.',
          '· Technical and usage data — IP address, browser and device information, timestamps, which sections you opened, error and performance logs.',
          '· Session identifiers — a signed session cookie, and capability tokens in links we send you.',
          'We do not knowingly collect special-category data, and we ask you not to send it.',
        ],
      },
      {
        heading: 'Why, and on what basis',
        body: [
          'To respond to you and prepare your output (contract, and our legitimate interest in answering an enquiry). To create and operate a workspace (contract). To scan attachments for malware and abuse (legitimate interest in security; legal obligation). To keep audit logs of access and disclosure (legal obligation; accountability). To improve the platform using aggregate, non-identifying signals (legitimate interest). To send you material you asked for (contract; consent where marketing). To comply with law and to establish or defend claims (legal obligation).',
          'Where we rely on legitimate interests we have considered your interests and rights, and you may object.',
          'Three things we do not do: we do not use your conversation content or attachments to train, fine-tune or evaluate any model; we do not use your content to answer anyone else\u2019s question; and we do not sell personal data or share it for cross-context behavioural advertising.',
        ],
      },
      {
        heading: 'Automated processing',
        body: [
          'The platform classifies what you describe in order to route it internally and to decide what material may be shown to you. It also generates text automatically.',
          'This does not produce a legal or similarly significant effect on you: it decides what we show you and who follows up, not whether you receive a right, a credit, employment, or a service you are entitled to. No decision about you is taken by a model — the decisions that matter are taken by fixed rules, and a person is accountable for every commercial step. You can ask for a human at any point, and you can ask what happened by writing to [privacy email].',
        ],
      },
      {
        heading: 'Anonymous conversations',
        body: [
          'If you use the platform without an account, your conversation is held against a signed session identifier in a cookie and is visible only to that session. It is retained for [anonymous retention] days and then deleted, unless you create a workspace, in which case it is transferred to that workspace.',
          'We do not link separate anonymous sessions to each other, and we do not attempt to identify you from them.',
        ],
      },
      {
        heading: 'Attachments, and the pre-NDA window',
        body: [
          'Files you attach are stored outside any publicly reachable path and served only through a short-lived, authorisation-checked link. They are scanned for malware and archive abuse before any attempt to read them, and read for text in an isolated environment with no outbound network access.',
          'They are available only within the conversation you attached them to, never added to the knowledge base, and never used for training or evaluation. Deleting one removes the file, the extracted text and any derived excerpt.',
          'A file attached before an NDA is flagged for restricted handling and deleted after [pre-NDA retention] days unless a signed agreement requires otherwise.',
        ],
      },
      {
        heading: 'How long we keep things',
        body: [
          '· Anonymous conversation and its attachments — [anonymous retention] days from last activity.',
          '· Pre-NDA attachments — [pre-NDA retention] days, then purged with a verifiable record.',
          '· Workspace conversations and attachments — the life of the workspace, then [workspace deletion window].',
          '· Workspace account data — the life of the relationship, then [account retention].',
          '· Assent records — [assent retention], because we must be able to show what you agreed to.',
          '· Audit and security logs — [audit retention].',
          '· Accounting and tax records — as required by Korean law.',
          '· Aggregate, non-identifying analytics — indefinitely, in a form that does not identify you.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'Depending on where you are, you may have the right to know what we hold and get a copy, to correct it, to delete it, to restrict or object to processing, to withdraw consent, to receive it in a portable form, and not to be discriminated against for exercising a right. Under Korea\u2019s Personal Information Protection Act you may also request suspension of processing.',
          'Write to [privacy email]. We aim to respond within [response period] days and may need to verify your identity first. You can also delete a conversation, an attachment or your workspace yourself, at any time, from within the platform.',
          'If you are unhappy with our response you may complain to your supervisory authority — in Korea, the Personal Information Protection Commission.',
        ],
      },
      {
        heading: 'Sharing, transfers and cookies',
        body: [
          'We share with service providers who host, secure, scan, email or monitor the platform on our behalf, under written terms restricting them to our instructions; with our partner IWL Partners, which operates the sales and customer-success process, under written terms; with professional advisers and authorities where legally required; and with an acquirer in a merger or sale of assets, under equivalent protection.',
          'We never share your conversation content with another customer.',
          'We are in the Republic of Korea and our providers may be elsewhere. Where we transfer personal data out of the EEA, the UK or Korea we rely on an adequacy decision where one applies — including the European Commission\u2019s adequacy decision for Korea — and otherwise on Standard Contractual Clauses, the UK Addendum, or the route Korean law requires, with a transfer risk assessment.',
          'We use a strictly necessary signed session cookie and a small number of first-party preference and analytics cookies. Where consent is required we ask before setting anything non-essential. We use no advertising cookies.',
        ],
      },
    ],
  },

  {
    slug: 'security',
    navLabel: 'Security',
    title: 'Security',
    standfirst: 'The controls you are entitled to rely on. Written so it can be relied on.',
    version: VERSION,
    effective: EFFECTIVE,
    sections: [
      {
        heading: 'Separation of access',
        body: [
          'The platform maintains three separate access planes — anonymous visitor, authenticated client, and internal team — each with its own authentication, audience and ceiling on what material can be reached. A credential issued for one plane is rejected on another.',
          'What you may see is derived from your plane and your contractual position. It is never taken from something you, or a document you upload, asks for.',
        ],
      },
      {
        heading: 'Links carry reach, not data',
        body: [
          'Links we email you carry a signed, scope-limited, time-limited token. A token grants the ability to reach one address; it does not itself carry content, and every request behind it is re-checked against your position at the moment you make it.',
        ],
      },
      {
        heading: 'Encryption',
        body: [
          'Data is encrypted in transit using TLS [minimum version] or above, and at rest using [at-rest encryption]. Pre-NDA attachments are additionally encrypted at rest under restricted handling.',
        ],
      },
      {
        heading: 'Uploads',
        body: [
          'Every uploaded file is stored as an opaque object outside any publicly reachable path. Before we attempt to read it, it is scanned for malware and checked for archive abuse. Reading happens in an isolated worker with no outbound network access, a memory and CPU ceiling, and a wall-clock timeout.',
          'No uploaded file is ever executed, interpreted, or rendered as active content in a browser. Downloads are served only through a short-lived, authorisation-checked link that forces download rather than display.',
          'A file we cannot read is accepted and represented by its name and type. We tell you that plainly rather than calling it a failure.',
        ],
      },
      {
        heading: 'Content you upload is not instruction',
        body: [
          'Text extracted from your files is supplied to our automated components as data to be analysed, never as instructions to be followed.',
          'That is a structural property rather than a matter of wording. The decisions worth attacking — what may be disclosed, who you are, what you are charged, whether a step is approved — are all taken by fixed rules outside the automated component\u2019s reach. An instruction hidden in a document cannot raise what we will tell you, cannot identify you, and cannot approve anything.',
        ],
      },
      {
        heading: 'Isolation, internal access and governance',
        body: [
          'Your conversations and attachments are scoped to you. They are not added to the knowledge base the platform answers from, not retrievable by another customer\u2019s session, and not used to train, fine-tune or evaluate any model.',
          'Internal access is role-based and least-privilege. Reading an attachment, releasing a quarantined file, intervening in a live conversation and advancing a commercial step each require an elevated role, and each is logged with the person, the record and the purpose. Releasing a file our scanner flagged additionally requires a recorded reason.',
          'Every outbound message — automated or written by a person — passes an approval check before it reaches you. Material that would require senior approval is not shown to you provisionally at all. Where an automated response begins and then trips a rule, it is stopped and discarded rather than completed, and you are told plainly. We would rather appear slower than tell you something we cannot stand behind.',
        ],
      },
      {
        heading: 'Logging, deletion and continuity',
        body: [
          'We log authentication, access to your material, every disclosure-level change, and every upload, scan, read, download and approval decision. Logs are retained for [audit retention] and are access-controlled.',
          'You can delete a file or a whole conversation at any time; deletion removes the stored object, the extracted text and any derived excerpt. Scheduled deletion runs against the retention periods in the Privacy Policy and writes a verifiable record that it happened.',
          'Backups are taken [frequency], retained for [period], encrypted at rest, with restoration tested [frequency]. Our target recovery objectives are RPO [rpo] and RTO [rto].',
        ],
      },
      {
        heading: 'Incidents, assurance and responsible disclosure',
        body: [
          'We maintain an incident response process with defined severities and named owners. Where a personal-data breach occurs we notify the supervisory authority and, where required, affected individuals, within the period the applicable law requires. Contact: [security email].',
          'Certifications and third-party assessments we hold, and their scope, are listed at [assurance page]. We do not claim a certification we do not hold; where one is in progress it is described as in progress.',
          'If you believe you have found a vulnerability, write to [security email]. Give us enough to reproduce it. Please do not access another person\u2019s data, degrade the service, or disclose publicly until we have had a reasonable opportunity to fix it. We will not pursue legal action against research conducted in good faith within those limits, and we aim to acknowledge within [acknowledgement window] business days.',
        ],
      },
    ],
  },

  {
    slug: 'disclosure-policy',
    navLabel: 'Disclosure policy',
    title: 'Disclosure Policy',
    standfirst: 'What we will say, to whom, and when — stated to you rather than only enforced against you.',
    version: VERSION,
    effective: EFFECTIVE,
    sections: [
      {
        heading: 'Why there is a boundary at all',
        body: [
          'itriX works on the representation of computation. The value of that work sits in mathematics, in eligibility judgement and in implementation know-how, protected partly by patents and partly as trade secrets. If we explained the implementation to everyone who asked, there would be nothing left to license — and licensing is how the work reaches anyone.',
          'So the boundary is not there to make you feel excluded. It is there so that there is something real to give you.',
        ],
      },
      {
        heading: 'The four levels',
        body: [
          '· Public — anyone. What our technologies do and why it matters, our positioning, our products, the shape of the commercial path, and these instruments.',
          '· Controlled — a visitor who has described their situation. A reflection of your problem, a brief written for your role, and the route we would examine first.',
          '· Under NDA — a client with a signed NDA. Controlled technical explanation of how a method works, eligibility conditions, proof summaries, validation boundaries, benchmark methodology, and a scoped assessment of your workload.',
          '· Under contract — a contracted customer. Your assessment, your evidence, your deployment material, your success plan.',
          'And one that is not a level: implementation. Source code, the full transformation pipeline, kernel-level detail, our benchmark harness, unfiled invention detail and another customer\u2019s results are not disclosed at any level, to anyone, without a licence. If we would not show it to you, we are not showing it to your competitor either.',
        ],
      },
      {
        heading: 'What you can have before an NDA',
        body: [
          'A great deal. What our technologies address, which of them is likely relevant to you and why, where in your stack the pressure probably sits, what a proof would have to demonstrate, what an engagement would look like, and what an NDA would unlock.',
          'That is enough for a serious first conversation, and we would rather have that conversation than a vague one.',
        ],
      },
      {
        heading: 'What we will not do before an NDA',
        body: [
          '· Quote a performance figure, a benchmark result, or a saving.',
          '· Explain how a method works at implementation level.',
          '· Ask you for your confidential technical information — and if you send it anyway, we apply restricted handling and would still rather you had waited.',
          '· Give you a price, a term, or an exclusivity position.',
        ],
      },
      {
        heading: 'How we talk about evidence',
        body: [
          'We separate three things and never blur them. Proven — established mathematically, under stated assumptions. Measured — observed in a benchmark, under stated conditions, on stated hardware. Hypothesis — worth testing, not yet tested in your environment.',
          'A negative result is reported as a negative result. A partial result is reported as partial. Neither is re-described afterwards as a learning, a promising signal, or a partial success. The credibility of everything we tell you later depends on this one, and it is the commitment on this page we would least like to be caught breaking.',
        ],
      },
      {
        heading: 'Automated responses, and asking for more',
        body: [
          'The platform\u2019s automated responses answer only from material approved for your level. They cannot be argued, prompted or persuaded into a level you have not reached, and neither can a document you upload. If you ask something above your level, you will be told plainly what would unlock it — and offered a person.',
          'Material at controlled level or above is given for your organisation\u2019s evaluation. Please do not publish it or pass it outside your organisation without asking.',
          'If the boundary is in the way of a decision you are genuinely trying to make, say so. The fastest route through it is usually an NDA, and the person named in your conversation can start one the same day.',
        ],
      },
    ],
  },
];

export function legalInstrument(slug: LegalInstrument['slug']): LegalInstrument {
  const found = LEGAL_INSTRUMENTS.find((i) => i.slug === slug);
  /* A missing instrument is a build error, not a runtime fallback: every slug is
     a literal in this module and a route that asks for one that is not here has
     been added without its content. */
  if (!found) throw new Error(`[legal] No instrument for "${slug}".`);
  return found;
}
