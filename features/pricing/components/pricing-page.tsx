import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GetPremiumButton } from "./get-premium-button";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/ mo",
      description: "Per user",
      buttonText: "Get Started",
      buttonVariant: "outline",
      features: [
        "Basic Analytics Dashboard",
        "5GB Cloud Storage",
        "Email Support",
      ],
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/ mo",
      description: "Per user",
      buttonText: "Get Premium",
      buttonVariant: "default",
      featured: true,
      plan: "PREMIUM",
      features: [
        "Everything in Free plus:",
        "25GB Cloud Storage",
        "Priority Email and Chat Support",
        "Access to Community Forum",
        "Single User Access",
        "Access to Basic Templates",
        "Mobile App Access",
        "1 Custom Report Per Month",
      ],
    },
    {
      name: "Organization",
      price: "$19.99",
      period: "/ mo",
      description: "Per user",
      buttonText: "Get Premium",
      buttonVariant: "default",
      plan: "ORGANIZATION",
      features: [
        "Everything in Pro plus:",
        "100GB Cloud Storage",
        "24/7 Priority Support",
        "Advanced Community Access",
        "Unlimited Team Members",
        "Custom Template Builder",
        "Admin Dashboard",
        "Unlimited Custom Reports",
        "API Access",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Flexible Plans to Grow with Your Pack
          </h1>
          <p>
            <strong>Korra</strong> isn&rsquo;t just a platform&mdash;it&rsquo;s
            a thriving community for pet lovers and professionals. Whether
            you&rsquo;re just starting out or scaling up, our features and tools
            adapt to your needs, making it easier to connect, share, and grow.
          </p>
        </div>

        <div className="mt-8 flex gap-6 md:mt-20">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-md flex flex-col justify-between space-y-6 border p-6 lg:p-8 flex-1 ${
                plan.featured
                  ? "dark:bg-muted shadow-lg shadow-gray-950/5 dark:[--color-muted:var(--color-zinc-900)]"
                  : ""
              }`}
            >
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">{plan.name}</h2>
                  <span className="my-3 block text-2xl font-semibold">
                    {plan.price}
                    {plan.period}
                  </span>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>

                {plan.buttonVariant === "outline" ? (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth">{plan.buttonText}</Link>
                  </Button>
                ) : (
                  <GetPremiumButton
                    key={index}
                    plan={
                      plan.plan
                        ? (plan.plan as "PREMIUM" | "ORGANIZATION")
                        : "PREMIUM"
                    }
                  />
                )}

                <hr className="border-dashed" />

                <ul className="list-outside space-y-3 text-sm">
                  {plan.features.map((item, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="size-3 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
