import { ArrowLeftRight, Clock, Scale, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: ArrowLeftRight,
    title: "Propose",
    text: "Move an amount from one natural account to another inside the same vote.",
  },
  {
    icon: Scale,
    title: "Review",
    text: "A reviewer checks that the source line still has enough appropriation to give up.",
  },
  {
    icon: ShieldCheck,
    title: "Approve",
    text: "An approver releases the transfer before either line can spend the new figure.",
  },
];

export default function Virement() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
      <div className="bg-[#0f4231] px-6 py-8 text-white sm:px-8 dark:bg-[#0B132B]">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#89c05b]">
          <Clock className="h-3.5 w-3.5" />
          Coming soon
        </span>
        <h3 className="mt-4 text-2xl font-bold">Virement</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
          Transfers between budget lines will be prepared, reviewed, and
          approved here. The ledger is not connected yet, so this screen cannot
          save a record.
        </p>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            How a transfer will look
          </p>
          <div className="mt-3 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-xl border border-gray-200 bg-[#f8faf8] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                From
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-800">
                Goods and Services
              </p>
              <p className="mt-1 text-sm text-gray-500">
                2210101 · Printed material
              </p>
              <p className="mt-3 text-xs text-gray-400">Source balance</p>
            </div>

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f6ee] text-[#166534] dark:bg-[rgba(57,255,136,0.12)] dark:text-[#39FF88]">
              <ArrowLeftRight className="h-4 w-4" />
            </div>

            <div className="rounded-xl border border-dashed border-[#166534]/40 bg-[#f3faf6] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#166534]">
                To
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-800">
                Goods and Services
              </p>
              <p className="mt-1 text-sm text-gray-500">
                2210102 · Office facilities
              </p>
              <p className="mt-3 text-xs text-gray-400">Receiving line</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Sample only. Amounts and accounts are not live data.
          </p>
        </div>

        <ol className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f6ee] text-sm font-bold text-[#166534] dark:bg-[rgba(57,255,136,0.12)] dark:text-[#39FF88]">
                  {index + 1}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                    <Icon className="h-4 w-4 text-[#166534] dark:text-[#39FF88]" />
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    {step.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
