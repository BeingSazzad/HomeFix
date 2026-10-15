import { BadgeDollarSign, CalendarDays, CreditCard } from "lucide-react";

const facts = [
  { value: "$0", label: "Homeowner fee", icon: BadgeDollarSign },
  { value: "$19.99", label: "Pro membership / mo", icon: CreditCard },
  { value: "3 mo", label: "Free after clearance", icon: CalendarDays },
];

export function HomeFacts() {
  return (
    <section className="bg-primary py-10 md:py-12">
      <div className="container-site">
        <ul className="grid gap-8 text-center sm:grid-cols-3 sm:gap-6">
          {facts.map((item) => (
            <li key={item.label} className="flex flex-col items-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white">
                <item.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-display text-[36px] font-bold leading-none text-white md:text-[40px]">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-white/80">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
