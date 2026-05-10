"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AppChrome from "@/components/AppChrome";
import { addStop, removeStop, addActivityToStop, removeActivityFromStop } from "@/actions/trips";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Plus, Trash2, Search, ArrowLeft, ChevronDown, ChevronUp, Sparkles, Navigation, Activity as ActivityIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface City { id: string; name: string; country: string; costIndex: number; }
interface Activity { id: string; name: string; type: string; cost: number; duration: number; description: string | null; }
interface StopActivity { id: string; activityId: string; activity: Activity; cost: number; }
interface Stop { id: string; cityId: string; city: City; startDate: string; endDate: string; order: number; activities: StopActivity[]; }
interface Trip { id: string; name: string; startDate: string; endDate: string; stops: Stop[]; }

export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [citySearch, setCitySearch] = useState("");
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [actSearch, setActSearch] = useState("");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/trips/${tripId}`),
      fetch("/api/cities"),
    ])
      .then(([tripRes, citiesRes]) => Promise.all([tripRes.json(), citiesRes.json()]))
      .then(([tripData, citiesData]) => {
        setTrip(tripData);
        setCities(citiesData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tripId]);

  const loadActivities = async (cityId: string) => {
    const res = await fetch(`/api/cities/${cityId}/activities`);
    if (res.ok) setActivities(await res.json());
  };

  const handleAddStop = async (cityId: string) => {
    if (!trip) return;
    const formData = new FormData();
    formData.set("cityId", cityId);
    formData.set("startDate", trip.startDate.split("T")[0]);
    formData.set("endDate", trip.endDate.split("T")[0]);
    await addStop(tripId, formData);
    setShowCityPicker(false);
    const tripRes = await fetch(`/api/trips/${tripId}`);
    if (tripRes.ok) setTrip(await tripRes.json());
  };

  const handleRemoveStop = async (stopId: string) => {
    await removeStop(stopId);
    setSelectedStop(null);
    const tripRes = await fetch(`/api/trips/${tripId}`);
    if (tripRes.ok) setTrip(await tripRes.json());
  };

  const handleAddActivity = async (activityId: string) => {
    if (!selectedStop) return;
    await addActivityToStop(selectedStop, activityId);
    const tripRes = await fetch(`/api/trips/${tripId}`);
    if (tripRes.ok) setTrip(await tripRes.json());
  };

  const handleRemoveActivity = async (saId: string) => {
    await removeActivityFromStop(saId);
    const tripRes = await fetch(`/api/trips/${tripId}`);
    if (tripRes.ok) setTrip(await tripRes.json());
  };

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredActivities = activities.filter(
    (a) =>
      a.name.toLowerCase().includes(actSearch.toLowerCase()) ||
      a.type.toLowerCase().includes(actSearch.toLowerCase())
  );

  if (loading || !trip) {
    return (
      <AppChrome>
        <div className="flex justify-center py-52">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Navigation className="text-accent-lime" size={40} />
          </motion.div>
        </div>
      </AppChrome>
    );
  }

  return (
    <AppChrome>
      <main className="page-shell py-12 lg:pb-28">
        <Link href={`/trips/${tripId}`} className="mb-10 inline-flex items-center gap-2 font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-muted hover:text-accent-cyan transition-colors no-underline hover:gap-3">
          <ArrowLeft size={18} strokeWidth={1.75} /> Trip overview
        </Link>

        <header className="mb-14 space-y-4">
          <div className="flex items-center gap-3 mb-5">
             <span className="text-editorial">Trip builder</span>
             <div className="h-px flex-1 bg-white/10" />
          </div>
          <h1 className="headline-dashboard leading-tight">
            Shape your <span className="text-accent-pink">itinerary</span>
          </h1>
          <p className="subhead-dashboard mt-2 max-w-2xl">
            {trip.name} · {trip.stops.length} stop{trip.stops.length !== 1 ? "s" : ""} routed
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Stops Sequence */}
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-white font-display tracking-tight uppercase">Movement Sequence ({trip.stops.length})</h2>
               <button 
                 onClick={() => setShowCityPicker(!showCityPicker)}
                 className="btn-pro-primary h-12 px-6 rounded-xl text-[0.6rem]"
               >
                 <Plus size={14} /> Add Node
               </button>
            </div>

            <AnimatePresence mode="wait">
              {showCityPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-pro p-6 space-y-6 bg-white/[0.04] will-change-[opacity,transform]"
                >
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={16} />
                    <input
                      className="input-pro pl-12 h-14 bg-white/[0.03] border-white/5"
                      placeholder="Search global registry for destination nodes..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                    {filteredCities.slice(0, 10).map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleAddStop(city.id)}
                        className="flex items-center justify-between p-4 glass-pro hover:bg-white/5 border-white/5 transition-all group text-left cursor-pointer"
                      >
                        <div>
                          <p className="text-sm font-black text-white uppercase group-hover:text-primary">{city.name}</p>
                          <p className="text-[0.6rem] font-medium text-muted uppercase tracking-widest">{city.country}</p>
                        </div>
                        <span className="text-[0.6rem] font-black text-primary opacity-40 group-hover:opacity-100">+{city.costIndex}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {trip.stops.length === 0 ? (
              <div className="glass-pro p-20 text-center space-y-6">
                <MapPin size={48} className="mx-auto text-muted/20 animate-bounce" />
                <p className="text-muted text-[0.7rem] font-black uppercase tracking-[0.2em]">Zero nodes in sequence. Initialize movement protocol.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trip.stops.map((stop, idx) => (
                  <motion.div
                    key={stop.id}
                    layout
                    className={`glass-pro p-8 transition-all duration-500 will-change-[opacity,transform,height] ${selectedStop === stop.id ? 'border-primary/50 bg-white/5' : 'hover:border-white/20'}`}
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        setSelectedStop(selectedStop === stop.id ? null : stop.id);
                        if (selectedStop !== stop.id) loadActivities(stop.cityId);
                      }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-surface-raised border border-white/10 flex items-center justify-center text-[0.8rem] font-black text-primary font-display">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-white font-display tracking-tight uppercase group-hover:text-primary transition-colors">
                            {stop.city.name}
                          </h4>
                          <p className="text-[0.65rem] font-black uppercase tracking-widest text-muted">
                            <MapPin size={10} className="inline mr-1 text-primary" /> {stop.city.country}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                          <p className="text-[0.6rem] font-black text-white/20 uppercase tracking-widest mb-1">Activities</p>
                          <p className="text-lg font-black text-white font-display">{stop.activities.length}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveStop(stop.id); }}
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all border-none bg-transparent cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                          {selectedStop === stop.id ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-white/20" />}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedStop === stop.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden will-change-[height,opacity]"
                        >
                          <div className="pt-8 space-y-3">
                            <div className="h-[1px] w-full bg-white/5 mb-6" />
                            {stop.activities.map((sa) => (
                              <div
                                key={sa.id}
                                className="flex items-center justify-between p-4 bg-white/2 rounded-xl border border-white/5 group hover:border-primary/20 transition-all"
                              >
                                <div className="flex items-center gap-4">
                                   <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                   <span className="text-sm font-bold text-white uppercase tracking-tight">{sa.activity.name}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                  <span className="text-sm font-black text-primary/80">{formatCurrency(sa.cost)}</span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRemoveActivity(sa.id); }}
                                    className="text-white/20 hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer p-0"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {stop.activities.length === 0 && (
                              <p className="text-center text-[0.65rem] font-black uppercase tracking-widest text-muted py-6">No specific activities allocated to this node.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Operations Registry (Activities) */}
          <div className="lg:col-span-5 space-y-10">
            <h2 className="text-2xl font-black text-white font-display tracking-tight uppercase flex items-center gap-3">
              <Sparkles size={24} className="text-primary" /> Operations Registry
            </h2>

            <div className="sticky top-32 space-y-6">
              {!selectedStop ? (
                <div className="glass-pro p-16 text-center space-y-6 border-dashed border-white/10">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                     <ActivityIcon size={32} className="text-muted/20" />
                  </div>
                  <p className="text-muted text-[0.7rem] font-black uppercase tracking-[0.2em] max-w-[240px] mx-auto">
                    Select a movement node in the sequence to browse operational activities.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={16} />
                    <input
                      className="input-pro pl-12 h-14 bg-white/[0.03] border-white/5"
                      placeholder={`Search activities in ${trip.stops.find(s => s.id === selectedStop)?.city.name}...`}
                      value={actSearch}
                      onChange={(e) => setActSearch(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-auto pr-4 custom-scrollbar">
                    {filteredActivities.length === 0 ? (
                      <p className="text-center text-[0.65rem] font-black uppercase tracking-widest text-muted py-12">No matching operations detected.</p>
                    ) : (
                      filteredActivities.map((act) => (
                        <div key={act.id} className="glass-pro p-6 hover:border-primary/30 transition-all group relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                             <Sparkles size={60} />
                          </div>
                          <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex-1">
                              <h4 className="text-lg font-black text-white font-display tracking-tight uppercase group-hover:text-primary transition-colors">{act.name}</h4>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[0.6rem] font-black uppercase tracking-widest">{act.type}</span>
                                <span className="text-[0.6rem] font-black text-white/40 uppercase tracking-widest">{act.duration} MINS</span>
                              </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xl font-black text-white font-display">{formatCurrency(act.cost)}</p>
                               <button 
                                 onClick={() => handleAddActivity(act.id)}
                                 className="mt-3 btn-pro-outline h-10 px-4 text-[0.6rem] rounded-lg group-hover:bg-primary group-hover:text-surface group-hover:border-primary"
                               >
                                 Allocate
                               </button>
                            </div>
                          </div>
                          {act.description && (
                            <p className="text-[0.7rem] text-muted leading-relaxed font-medium line-clamp-2 relative z-10">
                              {act.description}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Summary Stats */}
              <div className="glass-pro p-8 bg-primary/5 border-primary/20">
                 <div className="flex justify-between items-end mb-6">
                    <div>
                       <p className="text-editorial mb-1">Sequence Valuation</p>
                       <p className="text-4xl font-black text-white font-display">
                         {formatCurrency(trip.stops.reduce((sum, s) => sum + s.activities.reduce((ss, a) => ss + a.cost, 0), 0))}
                       </p>
                    </div>
                    <Navigation className="text-primary opacity-20" size={40} />
                 </div>
                 <p className="text-[0.65rem] text-primary font-black uppercase tracking-[0.2em] italic">
                   Trajectory Intelligence: Optimal movement protocol detected.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppChrome>
  );
}
