// src/components/CTA.js
"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  const router = useRouter();

  return (
    <div className="bg-slate-blue">
      <div className="max-w-7xl mx-auto py-20 px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-charcoal/90 px-6 pt-16 shadow-2xl rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-soft-ivory sm:text-4xl">
              Ready to Begin Your Transformation?
            </h2>
            <p className="mt-6 text-lg leading-8 text-soft-ivory/80">
              Your journey toward clarity and control starts with a single step. Choose your plan and unlock the tools you need to thrive.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <button
                onClick={() => router.push('/pricing')}
                className="rounded-full bg-sage-green px-5 py-3.5 text-base font-semibold text-charcoal shadow-sm hover:bg-sage-green/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                View Plans & Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <a href="/features" className="text-sm font-semibold leading-6 text-soft-ivory hover:text-soft-ivory/80">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <img
              className="absolute left-0 top-0 w-[57rem] max-w-none rounded-3xl bg-soft-ivory/5 ring-1 ring-soft-ivory/10 object-cover h-full"
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2940&auto=format&fit=crop"
              alt="A person working calmly and successfully at an organized desk."
              width={1824}
              height={1080}
            />
          </div>
        </div>
      </div>
    </div>
  );
}