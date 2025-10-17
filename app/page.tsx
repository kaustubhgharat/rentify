import Link from "next/link";
import { Search, ShieldCheck, User, Home as HomeIcon, ArrowRight } from "lucide-react";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export const dynamic = "force-dynamic";

const getUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: string; username: string; role: 'student' | 'owner' };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) => (
  <div className="p-6 text-center bg-white rounded-2xl shadow-lg border border-neutral-200/60 transform hover:-translate-y-2 transition-transform duration-300 group">
    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
    <h3 className="mt-4 text-lg font-bold text-neutral-800">{title}</h3>
    <p className="mt-2 text-sm text-neutral-600">{description}</p>
  </div>
);

const features = [
  { icon: <User className="h-8 w-8 text-teal-600" />, title: "For Students, By Students", description: "Focused on the real needs of college students in Pune." },
  { icon: <ShieldCheck className="h-8 w-8 text-teal-600" />, title: "Safe & Verified", description: "We encourage verified landlords and provide safety tips for newcomers." },
  { icon: <Search className="h-8 w-8 text-teal-600" />, title: "Smart Search", description: "Filter by PGs, hostels, or shared flats—find exactly what suits your budget." },
  { icon: <HomeIcon className="h-8 w-8 text-teal-600" />, title: "Hyperlocal Focus", description: "All listings are from Katraj, Dhankawadi, and nearby student hubs." },
];

export default async function Home() {
  const user = await getUser();

  return (
    <main className="bg-neutral-50 text-neutral-800">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-white to-white -z-10" />
        <div className="max-w-4xl w-full mx-auto text-center px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-neutral-900">
            Find Your Perfect
            <span className="block mt-2 bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Student Home in Pune
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10">
            Rentify helps college students around PICT & BVCOE find verified PGs, flats, and roommates in the Katraj & Dhankawadi area.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {user ? (
              <Link href="/listings" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-white bg-teal-600 hover:bg-teal-700 transform hover:scale-105 shadow-lg transition-all duration-300">
                Browse Listings <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-white bg-teal-600 hover:bg-teal-700 transform hover:scale-105 shadow-lg transition-all duration-300">
                  Get Started
                </Link>
                <Link href="/signin" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-teal-700 bg-white hover:bg-teal-50 ring-2 ring-inset ring-teal-200 shadow-md transform hover:scale-105 transition-all duration-300">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Why Choose Us?</h2>
            <p className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">Your Student Housing Search, Simplified</p>
            <p className="mt-4 max-w-2xl text-lg text-neutral-600 mx-auto">We are built by local students, for local students. We know what you need because we have been there.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (<FeatureCard key={feature.title} {...feature} />))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-4">How It Works</h2>
          <p className="text-lg text-neutral-600 mb-16">Find your perfect place in three simple steps.</p>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hidden md:block absolute top-12 left-0 w-full h-px"><svg width="100%" height="2"><line x1="0" y1="1" x2="100%" y2="1" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" /></svg></div>
            {[{ label: "Search & Filter", desc: "Use our smart filters to narrow down properties by price, location, and type." },
              { label: "Connect & Visit", desc: "Directly contact owners or find potential roommates to schedule viewings." },
              { label: "Secure Your Place", desc: "Finalize your choice and move into your new student home with confidence." }
            ].map((step, idx) => (
              <div key={step.label} className="relative bg-white rounded-xl p-6 border border-neutral-200 shadow-md z-10 transform hover:-translate-y-1 transition duration-300">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-800 rounded-full border-4 border-white font-bold text-2xl shadow-sm">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-xl mb-2 text-neutral-800">{step.label}</h3>
                <p className="text-neutral-600 text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center px-4">
           <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900">Ready to Find Your Place?</h2>
           <p className="mt-4 text-lg text-neutral-600">Create an account or start browsing listings today. Your next home is just a few clicks away.</p>
           <div className="mt-8 flex justify-center gap-4">
             {user ? (
                 <Link href="/listings" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-white bg-teal-600 hover:bg-teal-700 transform hover:scale-105 shadow-lg transition-all duration-300">
                    Browse Listings <ArrowRight className="ml-2 h-5 w-5" />
                 </Link>
             ) : (
                <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full text-white bg-teal-600 hover:bg-teal-700 transform hover:scale-105 shadow-lg transition-all duration-300">
                    Create Your Account
                </Link>
             )}
           </div>
        </div>
      </section>
    </main>
  );
}