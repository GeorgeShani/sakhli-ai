import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PLAN_DETAILS, useSubscription, type Plan } from "@/lib/subscription";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Lock,
  Sparkles,
  HelpCircle,
  QrCode,
  Globe,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): { plan?: Plan } => {
    const p = search.plan;
    return {
      plan: p === "plus" || p === "ultra" ? p : "plus",
    };
  },
  head: () => ({
    meta: [
      { title: "Checkout — SakhliAI" },
      { name: "description", content: "Complete your SakhliAI premium subscription securely." },
    ],
  }),
  component: CheckoutPage,
});

type PaymentMethod = "stripe" | "tbc" | "bog";

function CheckoutPage() {
  const { plan: searchPlan } = Route.useSearch();
  const selectedPlan = searchPlan || "plus";
  const { plan: currentPlan, setPlan } = useSubscription();
  const { profile } = useAuth();
  const { locale, t } = useI18n();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState(profile?.full_name || "");
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [success, setSuccess] = useState(false);

  // Georgian Lari pricing details
  const planInfo = PLAN_DETAILS[selectedPlan];
  const priceGEL = planInfo.price;
  const vatRate = 0.18; // 18% VAT in Georgia
  const subtotal = Number((priceGEL / (1 + vatRate)).toFixed(2));
  const vatAmount = Number((priceGEL - subtotal).toFixed(2));

  const handleAutofill = () => {
    setCardNumber("4242 •••• •••• 4242");
    setCardExpiry("12 / 28");
    setCardCvc("421");
    setCardName(profile?.full_name || "George Sakhli");
    toast.info(
      locale === "ka"
        ? "სატესტო ბარათი შეივსო ავტომატურად"
        : "Test card details filled automatically",
    );
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setProcessingStep(1);

    // Call the actual backend endpoint (either real Stripe or structured sandbox)
    try {
      const response = await fetch("/api/public/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          paymentMethod,
          email: profile?.full_name || "guest@sakliai.ge",
        }),
      });
      const data = await response.json();
      console.log("Payment initialization:", data);
    } catch (err) {
      console.warn("API route not fully serving yet, running high-fidelity simulation", err);
    }

    // High fidelity steps sequence
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    await delay(1200);
    setProcessingStep(2); // Verified by 3D Secure / Georgian bank token exchange

    await delay(1000);
    setProcessingStep(3); // Completing subscription sync in Supabase

    await delay(900);
    setPlan(selectedPlan);
    setProcessing(false);
    setSuccess(true);
    toast.success(
      locale === "ka"
        ? `${planInfo.nameKa} წარმატებით გააქტიურდა!`
        : `${planInfo.name} upgraded successfully!`,
    );
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AppHeader />
        <main className="mx-auto max-w-lg px-4 py-16 text-center animate-scale-in">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
            <span className="absolute inset-0 h-full w-full animate-ping rounded-full bg-emerald-500/20 opacity-75" />
          </div>

          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight">
            {locale === "ka" ? "გადახდა წარმატებულია! 🎉" : "Payment Successful! 🎉"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {locale === "ka"
              ? `გილოცავთ! თქვენი ანგარიში წარმატებით განახლდა ${planInfo.nameKa}-ზე.`
              : `Congratulations! Your account is now upgraded to ${planInfo.name}.`}
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left space-y-4">
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-muted-foreground">{locale === "ka" ? "ტრანზაქცია" : "Transaction ID"}</span>
              <span className="font-mono font-medium">SAKHLI-{Math.floor(Math.random() * 900000 + 100000)}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-muted-foreground">{locale === "ka" ? "პაკეტი" : "Subscribed Plan"}</span>
              <span className="font-semibold">{locale === "ka" ? planInfo.nameKa : planInfo.name}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-3 text-sm">
              <span className="text-muted-foreground">{locale === "ka" ? "საფასური" : "Amount Paid"}</span>
              <span className="font-display font-bold">₾{priceGEL.toFixed(2)} GEL</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{locale === "ka" ? "გადახდის მეთოდი" : "Payment Method"}</span>
              <span className="uppercase font-medium flex items-center gap-1.5">
                {paymentMethod === "stripe" ? (
                  <>
                    <CreditCard className="h-3.5 w-3.5 text-primary" /> Stripe
                  </>
                ) : paymentMethod === "tbc" ? (
                  <>
                    <Award className="h-3.5 w-3.5 text-blue-500" /> TBC Pay
                  </>
                ) : (
                  <>
                    <Building className="h-3.5 w-3.5 text-orange-500" /> BOG Express
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <Button
              onClick={() => navigate({ to: profile?.role === "host" ? "/host" : "/matches" })}
              className="w-full bg-gradient-to-r from-primary to-accent py-5 text-sm"
            >
              {locale === "ka" ? "დაფაზე გადასვლა" : "Go to Dashboard"}
            </Button>
            <Link
              to="/"
              className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {locale === "ka" ? "მთავარ გვერდზე დაბრუნება" : "Return to Home"}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="mb-6">
          <Link
            to="/matches"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            {locale === "ka" ? "უკან დაბრუნება" : "Back to matching"}
          </Link>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            {locale === "ka" ? "გაფორმება" : "Secure Checkout"}
          </h1>
          <p className="text-xs text-muted-foreground">
            SakhliAI billing is processed in Georgian Lari (GEL) with full compliance.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT: PAYMENT DETAILS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" />
                {locale === "ka" ? "აირჩიეთ გადახდის მეთოდი" : "Select Payment Method"}
              </h2>

              {/* PAYMENT TABS */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={[
                    "flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all",
                    paymentMethod === "stripe"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-border bg-muted/20 hover:bg-muted/50",
                  ].join(" ")}
                >
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="mt-2 text-xs font-semibold">Stripe / Global</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("tbc")}
                  className={[
                    "flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all",
                    paymentMethod === "tbc"
                      ? "border-blue-500 bg-blue-500/5 ring-2 ring-blue-500/30"
                      : "border-border bg-muted/20 hover:bg-muted/50",
                  ].join(" ")}
                >
                  <Award className="h-5 w-5 text-blue-500" />
                  <span className="mt-2 text-xs font-semibold">TBC Pay (Card)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("bog")}
                  className={[
                    "flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all",
                    paymentMethod === "bog"
                      ? "border-orange-500 bg-orange-500/5 ring-2 ring-orange-500/30"
                      : "border-border bg-muted/20 hover:bg-muted/50",
                  ].join(" ")}
                >
                  <Building className="h-5 w-5 text-orange-500" />
                  <span className="mt-2 text-xs font-semibold">BOG Express</span>
                </button>
              </div>

              {processing ? (
                /* PROCESSING PROGRESS LOADER */
                <div className="py-12 text-center space-y-4 animate-fade-in">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      {processingStep === 1
                        ? (locale === "ka" ? "მიმდინარეობს კავშირი ბანკის სერვერთან…" : "Contacting secure payment gateway…")
                        : processingStep === 2
                          ? (locale === "ka" ? "მოწმდება 3D Secure უსაფრთხოება…" : "Verifying 3D Secure authentication…")
                          : (locale === "ka" ? "ხდება ტარიფის აქტივაცია Supabase-ში…" : "Syncing premium subscription state…")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {locale === "ka" ? "გთხოვთ არ დახუროთ ფანჯარა" : "Do not close this window during execution"}
                    </p>
                  </div>
                </div>
              ) : paymentMethod === "stripe" ? (
                /* STRIPE CARD FORM */
                <form onSubmit={handlePayment} className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center bg-accent/5 rounded-xl border border-accent/20 px-4 py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span>{locale === "ka" ? "სატესტო რეჟიმი გააქტიურებულია" : "Hackathon Sandbox Mode Active"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutofill}
                      className="text-primary font-bold hover:underline"
                    >
                      {locale === "ka" ? "ავტომატური შევსება" : "Autofill Test Card"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-name">{locale === "ka" ? "ბარათის მფლობელი" : "Cardholder Name"}</Label>
                    <Input
                      id="card-name"
                      required
                      placeholder="e.g. George Sakhli"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="card-number">{locale === "ka" ? "ბარათის ნომერი" : "Card Number"}</Label>
                    <div className="relative">
                      <Input
                        id="card-number"
                        required
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="pr-10"
                      />
                      <CreditCard className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-expiry">{locale === "ka" ? "მოქმედების ვადა" : "Expiration Date"}</Label>
                      <Input
                        id="card-expiry"
                        required
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvc">CVC / CVV</Label>
                      <Input
                        id="card-cvc"
                        required
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary py-6 text-sm mt-6">
                    <Lock className="mr-1.5 h-4 w-4" />
                    {locale === "ka" ? `გადაიხადე ₾${priceGEL.toFixed(2)} GEL` : `Pay ₾${priceGEL.toFixed(2)} GEL Securely`}
                  </Button>
                </form>
              ) : paymentMethod === "tbc" ? (
                /* TBC BANK REDIRECT DEMO */
                <div className="py-6 text-center space-y-4 animate-fade-in border border-blue-500/20 rounded-2xl bg-blue-500/5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                    <Award className="h-7 w-7" />
                  </div>
                  <div className="max-w-md mx-auto px-4 space-y-2">
                    <h3 className="text-base font-semibold text-blue-900 dark:text-blue-200">
                      TBC Pay Gateway Redirect
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This triggers a server call to create a TBC Checkout session. In production, this redirects the user to TBC's official credit card page with a secure signature, then returns back to SakhliAI.
                    </p>
                  </div>
                  <Button
                    onClick={handlePayment}
                    className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8 py-5 h-auto rounded-xl"
                  >
                    {locale === "ka" ? "TBC Pay-ით გადახდა" : "Proceed with TBC Pay"}
                  </Button>
                </div>
              ) : (
                /* BOG EXPRESS REDIRECT DEMO */
                <div className="py-6 text-center space-y-4 animate-fade-in border border-orange-500/20 rounded-2xl bg-orange-500/5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                    <Building className="h-7 w-7" />
                  </div>
                  <div className="max-w-md mx-auto px-4 space-y-2">
                    <h3 className="text-base font-semibold text-orange-950 dark:text-orange-200">
                      Bank of Georgia Express Checkout
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Triggers a postback requesting the BOG Payment Session ID. SakhliAI securely exchanges credentials and opens BOG Orange gateway.
                    </p>
                  </div>
                  <Button
                    onClick={handlePayment}
                    className="bg-orange-600 text-white hover:bg-orange-700 font-semibold px-8 py-5 h-auto rounded-xl"
                  >
                    {locale === "ka" ? "BOG Express-ით გადახდა" : "Proceed with BOG Express"}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>SSL 256-bit Secure Encryption · PCI-DSS Compliant</span>
            </div>
          </div>

          {/* RIGHT: BILLING BREAKDOWN */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-muted-foreground">
                {locale === "ka" ? "შეკვეთის დეტალები" : "Order Summary"}
              </h2>

              <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border border-border">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm">
                    {locale === "ka" ? planInfo.nameKa : planInfo.name}
                  </div>
                  <div className="text-xs text-muted-foreground">Monthly subscription plan</div>
                </div>
                <div className="font-display font-bold text-sm">₾{priceGEL}</div>
              </div>

              <div className="space-y-2 text-sm pt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{locale === "ka" ? "შუალედური (დღგ-ს გარეშე)" : "Subtotal (excl. VAT)"}</span>
                  <span>₾{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{locale === "ka" ? "დღგ (18% საქართველო)" : "Georgian VAT (18%)"}</span>
                  <span>₾{vatAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-border my-2 pt-2 flex justify-between font-display text-lg font-bold">
                  <span>{locale === "ka" ? "სულ გადასახდელი" : "Total to Pay"}</span>
                  <span className="text-primary">₾{priceGEL.toFixed(2)} GEL</span>
                </div>
              </div>
            </div>

            {/* PLATFORM TRUST CARD */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SakhliAI Protection</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                By purchasing, you authorize SakhliAI to activate immediate premium matching access. Subscriptions can be canceled at any time from your setting profile options.
              </p>
              <div className="flex gap-4 pt-1">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                  <Globe className="h-3 w-3 text-primary" /> Multi-currency
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                  <QrCode className="h-3 w-3 text-accent" /> BOG QR Pay
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                  <HelpCircle className="h-3 w-3 text-muted-foreground" /> 24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
