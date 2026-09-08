import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import ExploreClassCard from "@/features/dashboard/components/ExploreClassCard.jsx";
import { getSharedClassCount } from "@/utils/sharedClasses.js";
import ExplorePersonCard from "../components/ExplorePersonCard.jsx";
import { useExploreData } from "../hooks/useExploreData.js";

const matches = (value, query) => value.toLowerCase().includes(query.toLowerCase());

export default function ExplorePage() {
  const { user } = useAuth();
  const { classes, users, status } = useExploreData(user?.id);
  const [tab, setTab] = useState("classes");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [personFilter, setPersonFilter] = useState("all");

  const subjectSet = useMemo(() => new Set(), []);
  const classSubjects = [...new Set(classes.map((item) => item.subject).filter(Boolean))];
  const departments = [...new Set(users.map((item) => item.department).filter(Boolean))];
  const batchYears = [...new Set(users.map((item) => item.batchYear).filter(Boolean))];
  const sharedPeople = useMemo(() => users.filter((person) => getSharedClassCount(user, person) > 0), [user, users]);
  const generalPeople = users;

  const filteredClasses = useMemo(() => classes
    .filter((item) => classFilter === "all" || classFilter === "popular" || classFilter === "recommended" ? (classFilter !== "recommended" || item.recommended) : item.subject === classFilter)
    .filter((item) => matches(`${item.title} ${item.subject} ${item.instructor?.name || ""}`, search))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0) || Number(subjectSet.has(b.subject)) - Number(subjectSet.has(a.subject)) || a.title.localeCompare(b.title)), [classes, classFilter, search, subjectSet]);

  const filteredPeople = useMemo(() => {
    const selfResult = search && matches(`${user?.name || ""} ${user?.handle || ""} ${user?.department || ""}`, search) ? [user] : [];
    return [...selfResult, ...generalPeople]
      .filter((person) => {
        if (personFilter === "all") return true;
        if (personFilter === "shared") return getSharedClassCount(user, person) > 0;
        return person.department === personFilter || String(person.batchYear) === personFilter;
      })
      .filter((person) => matches(`${person.name || ""} ${person.handle || ""} ${person.department || ""} ${person.batchYear || ""}`, search))
      .sort((a, b) => getSharedClassCount(user, b) - getSharedClassCount(user, a) || Number(b.department === user?.department) - Number(a.department === user?.department) || (a.name || "").localeCompare(b.name || ""));
  }, [generalPeople, personFilter, search, user]);

  if (status === "loading") return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (status === "error") return <div className="mx-auto max-w-7xl p-4"><EmptyState title="We could not load Explore" description="Please refresh and try again." /></div>;

  return <div className="mx-auto max-w-7xl p-3 sm:p-4 lg:p-6"><header><p className="text-sm font-semibold text-primary">CampusMind community</p><h1 className="mt-1 text-3xl font-bold text-text-heading">Explore</h1><p className="mt-2 text-text-muted">Find classes and people across CampusMind.</p></header>
    <div className="relative mt-6 max-w-xl"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search classes, teachers, or students" className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>
    <div className="mt-5 flex gap-2 border-b border-border" role="tablist"><Button role="tab" aria-selected={tab === "classes"} variant={tab === "classes" ? "default" : "ghost"} onClick={() => setTab("classes")}>Classes</Button><Button role="tab" aria-selected={tab === "people"} variant={tab === "people" ? "default" : "ghost"} onClick={() => setTab("people")}>People</Button></div>
    {tab === "classes" ? <><div className="mt-4 flex flex-wrap gap-2"><FilterButton active={classFilter === "all"} onClick={() => setClassFilter("all")}>All</FilterButton><FilterButton active={classFilter === "popular"} onClick={() => setClassFilter("popular")}>Popular</FilterButton><FilterButton active={classFilter === "recommended"} onClick={() => setClassFilter("recommended")}>Recommended</FilterButton>{classSubjects.map((subject) => <FilterButton key={subject} active={classFilter === subject} onClick={() => setClassFilter(subject)}>{subject}</FilterButton>)}</div>{filteredClasses.length ? <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{filteredClasses.map((classroom) => <ExploreClassCard key={classroom.id} classroom={classroom} />)}</div> : <div className="mt-6"><EmptyState title="No classes found" description="Try a different search or filter." /></div>}</> : <><div className="mt-4 flex flex-wrap gap-2"><FilterButton active={personFilter === "all"} onClick={() => setPersonFilter("all")}>All departments</FilterButton><FilterButton active={personFilter === "shared"} onClick={() => setPersonFilter("shared")}>Shares a class with you</FilterButton>{departments.map((department) => <FilterButton key={department} active={personFilter === department} onClick={() => setPersonFilter(department)}>{department}</FilterButton>)}{batchYears.map((batchYear) => <FilterButton key={batchYear} active={personFilter === String(batchYear)} onClick={() => setPersonFilter(String(batchYear))}>Batch {batchYear}</FilterButton>)}</div>{sharedPeople.length > 0 && <section className="mt-6"><h2 className="text-lg font-semibold text-text-heading">People in your classes</h2><div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{sharedPeople.map((person) => <ExplorePersonCard key={person.id} person={person} currentUser={user} />)}</div></section>}{sharedPeople.length === 0 && !search ? <div className="mt-6"><EmptyState title="Join a class to discover classmates" description="Classmates will appear here after you join a learning space." action={{ to: "/dashboard/class/join", label: "Join a class" }} /></div> : filteredPeople.length ? <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{filteredPeople.map((person) => <ExplorePersonCard key={person.id} person={person} currentUser={user} />)}</div> : <div className="mt-6"><EmptyState title="No people found" description="Try a different search or filter." /></div>}</>}
  </div>;
}

function FilterButton({ active, children, onClick }) { return <Button size="sm" variant={active ? "default" : "outline"} onClick={onClick}>{children}</Button>; }
