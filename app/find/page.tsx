'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CTLogo from '@/components/CTLogo';
// @ts-ignore — JS module with no type declarations
import { LIFESTYLE_CATEGORIES } from '@/neighborhoods';
// @ts-ignore
import { getTopMatches } from '@/scoring';

const CITIES = [
  { key: 'charlotte',  name: 'Charlotte, NC',        state: 'North Carolina', note: 'Fast-growing Sun Belt city with walkable pockets near the light rail' },
  { key: 'montgomery', name: 'Montgomery County, MD', state: 'Maryland',       note: 'DC suburb corridor - Rockville, Kentlands & Germantown' },
  { key: 'chicago',    name: 'Chicago, IL',           state: 'Illinois',       note: 'World-class walkability, food, and distinct neighborhood character' },
  { key: 'dallas',     name: 'Dallas, TX',            state: 'Texas',          note: 'Booming finance and tech hub with walkable urban pockets' },
  { key: 'houston',    name: 'Houston, TX',           state: 'Texas',          note: "America's most diverse city - Montrose, Midtown, The Heights" },
  { key: 'seattle',    name: 'Seattle, WA',           state: 'Washington',     note: 'Tech hub surrounded by mountains and water - highly walkable' },
  { key: 'phoenix',    name: 'Phoenix, AZ',           state: 'Arizona',        note: 'Sun Belt growth city with year-round sunshine and desert culture' },
  { key: 'atlanta',    name: 'Atlanta, GA',           state: 'Georgia',        note: "The South's capital - BeltLine trail, MARTA, strong cultural identity" },
];

const CATEGORIES = [
  { id: 'walkability',       label: 'Walkability',         icon: '🚶', desc: 'Get errands done on foot' },
  { id: 'transitAccess',     label: 'Public transit',      icon: '🚇', desc: 'Buses, trains, light rail' },
  { id: 'foodScene',         label: 'Food scene',          icon: '🍜', desc: 'Restaurants, variety, quality' },
  { id: 'coffeeShops',       label: 'Coffee shops',        icon: '☕', desc: 'Cafes to work or meet' },
  { id: 'outdoorSpaces',     label: 'Outdoor spaces',      icon: '🌳', desc: 'Parks, trails, green space' },
  { id: 'nightlife',         label: 'Nightlife',           icon: '🎵', desc: 'Bars, music, evening energy' },
  { id: 'familyFriendly',    label: 'Family-friendly',     icon: '👨‍👩‍👧', desc: 'Schools, safety, community' },
  { id: 'culturalDiversity', label: 'Cultural diversity',  icon: '🌍', desc: 'International food & community' },
  { id: 'affordability',     label: 'Affordability',       icon: '💰', desc: 'Lower rent relative to city' },
  { id: 'quietResidential',  label: 'Quiet & residential', icon: '🏡', desc: 'Calm streets, less noise' },
];

type PriorityLabel = 'must-have' | 'important' | 'nice-to-have';
type PriorityMap   = Record<string, PriorityLabel>;
type StepNum       = 1 | 2 | 3;

const PRIORITY_BTN_CLASS: Record<PriorityLabel, string> = {
  'must-have':    'must',
  'important':    'important',
  'nice-to-have': 'nice',
};

export default function FindPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep]   = useState<StepNum>(1);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [priorities, setPriorities]     = useState<PriorityMap>({});
  const [errors, setErrors]             = useState<Partial<Record<StepNum, boolean>>>({});

  function showError(step: StepNum) {
    setErrors((e) => ({ ...e, [step]: true }));
  }
  function hideError(step: StepNum) {
    setErrors((e) => ({ ...e, [step]: false }));
  }

  function handleSelectCity(key: string) {
    setSelectedCity(key);
    hideError(1);
  }

  function handleToggleCat(id: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setPriorities((p) => { const np = { ...p }; delete np[id]; return np; });
      } else {
        next.add(id);
      }
      return next;
    });
    hideError(2);
  }

  function handleSetPriority(catId: string, val: PriorityLabel) {
    setPriorities((p) => ({ ...p, [catId]: val }));
    hideError(3);
  }

  function goToStep(n: StepNum) {
    if (n > currentStep) {
      if (currentStep === 1 && !selectedCity)         { showError(1); return; }
      if (currentStep === 2 && selectedCats.size < 3) { showError(2); return; }
    }
    setCurrentStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSubmit() {
    const unset = [...selectedCats].filter((c) => !priorities[c]);
    if (unset.length > 0) { showError(3); return; }

    const results = getTopMatches(selectedCity!, priorities, LIFESTYLE_CATEGORIES);
    sessionStorage.setItem('citytwin_results',    JSON.stringify(results));
    sessionStorage.setItem('citytwin_city',       selectedCity!);
    sessionStorage.setItem('citytwin_priorities', JSON.stringify(priorities));
    router.push('/results');
  }

  const stepDone   = (n: number) => n < currentStep;
  const stepActive = (n: number) => n === currentStep;

  return (
    <div className="find-body">
      {/* NAV */}
      <nav style={{ background: 'var(--white)', borderBottom: '1px solid var(--blue-pale)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 62 }}>
        <Link href="/" className="nav-brand">
          <CTLogo size={32} />
          <span className="nav-brand-name">CityTwin</span>
        </Link>
        <Link href="/" className="nav-back">← Home</Link>
      </nav>

      {/* PROGRESS BAR */}
      <div className="progress-wrap">
        <div className="progress-steps">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`progress-step${stepActive(n) ? ' active' : ''}${stepDone(n) ? ' done' : ''}`}
            >
              <div className={`step-dot${stepActive(n) ? ' active' : ''}${stepDone(n) ? ' done' : ''}`}>
                {stepDone(n) ? '✓' : n}
              </div>
              <span className="step-label">{['City', 'Lifestyle', 'Priorities'][n - 1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="find-page">

        {/* ── STEP 1: CITY ── */}
        <div className={`step-panel${currentStep === 1 ? ' active' : ''}`}>
          <div className="step-eyebrow">Step 1 of 3</div>
          <h1 className="step-heading">Where are you<br/><em>moving to?</em></h1>
          <p className="step-sub">Pick your destination city. We&apos;ll match you to the neighborhoods most likely to feel like home.</p>

          <div className="city-grid">
            {CITIES.map((city) => (
              <div
                key={city.key}
                className={`city-card${selectedCity === city.key ? ' selected' : ''}`}
                onClick={() => handleSelectCity(city.key)}
              >
                <div>
                  <div className="city-name">{city.name}</div>
                  <div className="city-state">{city.state}</div>
                  <div className="city-note">{city.note}</div>
                </div>
                <div className="city-check">✓</div>
              </div>
            ))}
          </div>

          <div className={`val-msg${errors[1] ? ' show' : ''}`}>Please select a city to continue.</div>
          <div className="find-btn-row">
            <button className="find-btn-primary" onClick={() => goToStep(2)}>Continue →</button>
          </div>
        </div>

        {/* ── STEP 2: LIFESTYLE ── */}
        <div className={`step-panel${currentStep === 2 ? ' active' : ''}`}>
          <div className="step-eyebrow">Step 2 of 3</div>
          <h1 className="step-heading">What shapes your<br/><em>daily life?</em></h1>
          <p className="step-sub">Select everything that matters to you in a neighborhood. Pick at least 3 - more gives better results.</p>
          <p className="sel-hint">Selected: <strong>{selectedCats.size}</strong> of 10</p>

          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`category-card${selectedCats.has(cat.id) ? ' selected' : ''}`}
                onClick={() => handleToggleCat(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <div className="cat-label">{cat.label}</div>
                <div className="cat-desc">{cat.desc}</div>
              </div>
            ))}
          </div>

          <div className={`val-msg${errors[2] ? ' show' : ''}`}>Please select at least 3 things that matter to you.</div>
          <div className="find-btn-row">
            <button className="find-btn-ghost" onClick={() => goToStep(1)}>← Back</button>
            <button className="find-btn-primary" onClick={() => goToStep(3)}>Continue →</button>
          </div>
        </div>

        {/* ── STEP 3: PRIORITIES ── */}
        <div className={`step-panel${currentStep === 3 ? ' active' : ''}`}>
          <div className="step-eyebrow">Step 3 of 3</div>
          <h1 className="step-heading">How much does<br/><em>each one matter?</em></h1>
          <p className="step-sub">Be honest - this is what makes your match accurate. A &ldquo;must have&rdquo; carries three times the weight of &ldquo;nice to have.&rdquo;</p>

          <div className="priority-list">
            {[...selectedCats].map((catId) => {
              const cat = CATEGORIES.find((c) => c.id === catId);
              if (!cat) return null;
              return (
                <div key={catId} className="priority-row">
                  <div className="priority-name">
                    <span>{cat.icon}</span> {cat.label}
                  </div>
                  <div className="priority-options">
                    {(['must-have', 'important', 'nice-to-have'] as PriorityLabel[]).map((val) => {
                      const active = priorities[catId] === val;
                      return (
                        <button
                          key={val}
                          className="priority-btn"
                          style={active ? {
                            background: '#FFFFFF',
                            border: '2px solid #162F4A',
                            color: '#162F4A',
                            fontWeight: 600,
                            borderRadius: '100px',
                          } : {}}
                          data-cat={catId}
                          data-val={val}
                          onClick={() => handleSetPriority(catId, val)}
                        >
                          {val === 'must-have' ? 'Must have' : val === 'important' ? 'Important' : 'Nice to have'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`val-msg${errors[3] ? ' show' : ''}`}>Please set a priority level for every item before continuing.</div>
          <div className="find-btn-row">
            <button className="find-btn-ghost" onClick={() => goToStep(2)}>← Back</button>
            <button className="find-btn-primary" onClick={handleSubmit}>Find my neighborhoods →</button>
          </div>
        </div>

      </div>
    </div>
  );
}
