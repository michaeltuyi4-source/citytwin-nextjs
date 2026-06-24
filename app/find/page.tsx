'use client';

import { useState, useEffect } from 'react';
import type { PriorityLabel } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CTLogo from '@/components/CTLogo';
import NavAuth from '@/components/NavAuth';
// @ts-ignore - JS module with no type declarations
import { LIFESTYLE_CATEGORIES } from '@/neighborhoods';
// @ts-ignore
import { getTopMatches } from '@/scoring';

const CITIES = [
  { key: 'charlotte',  name: 'Charlotte, NC',        state: 'North Carolina', abbr: 'NC', note: 'Fast-growing Sun Belt city with walkable pockets near the light rail',       region: 'South' },
  { key: 'montgomery', name: 'Montgomery County, MD', state: 'Maryland',       abbr: 'MD', note: 'DC suburb corridor - Rockville, Kentlands & Germantown',                      region: 'Mid-Atlantic' },
  { key: 'chicago',    name: 'Chicago, IL',           state: 'Illinois',       abbr: 'IL', note: 'World-class walkability, food, and distinct neighborhood character',            region: 'Midwest' },
  { key: 'dallas',     name: 'Dallas, TX',            state: 'Texas',          abbr: 'TX', note: 'Booming finance and tech hub with walkable urban pockets',                     region: 'South' },
  { key: 'houston',    name: 'Houston, TX',           state: 'Texas',          abbr: 'TX', note: "America's most diverse city - Montrose, Midtown, The Heights",                region: 'South' },
  { key: 'seattle',    name: 'Seattle, WA',           state: 'Washington',     abbr: 'WA', note: 'Tech hub surrounded by mountains and water - highly walkable',                 region: 'West' },
  { key: 'phoenix',    name: 'Phoenix, AZ',           state: 'Arizona',        abbr: 'AZ', note: 'Sun Belt growth city with year-round sunshine and desert culture',             region: 'West' },
  { key: 'atlanta',    name: 'Atlanta, GA',           state: 'Georgia',        abbr: 'GA', note: "The South's capital - BeltLine trail, MARTA, strong cultural identity",       region: 'South' },
];

const CITY_REGIONS = ['Midwest', 'South', 'West', 'Mid-Atlantic'] as const;
const POPULAR_CITY_KEYS = ['chicago', 'charlotte', 'atlanta', 'seattle', 'phoenix'] as const;


function getCategoryIcon(id: string, selected: boolean) {
  const c = selected ? '#C47B2B' : '#162F4A';
  const p = { stroke: c, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

  switch (id) {
    case 'walkability':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="7" r="3" fill={c}/>
          <path d="M16 10 L13 18 L10 24" {...p}/>
          <path d="M16 10 L19 18 L22 24" {...p}/>
          <path d="M13 15 L19 15" {...p}/>
        </svg>
      );
    case 'transitAccess':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <rect x="7" y="6" width="18" height="16" rx="4" {...p}/>
          <path d="M7 14 L25 14" {...p}/>
          <circle cx="11" cy="26" r="2" fill={c}/>
          <circle cx="21" cy="26" r="2" fill={c}/>
          <path d="M11 22 L11 24M21 22 L21 24" {...p}/>
          <path d="M11 10 L21 10" {...p} strokeWidth={1.5}/>
        </svg>
      );
    case 'foodScene':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M10 6 L10 14 C10 16.2 11.8 18 14 18 L14 26" {...p}/>
          <path d="M7 6 L7 11 C7 12.7 8.3 14 10 14" {...p}/>
          <path d="M13 6 L13 11 C13 12.7 11.7 14 10 14" {...p}/>
          <path d="M20 6 C20 6 23 8 23 12 C23 14.2 21.2 16 19 16 L19 26" {...p}/>
          <path d="M21 6 L21 26" {...p}/>
        </svg>
      );
    case 'coffeeShops':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M8 12 L8 22 C8 23.1 8.9 24 10 24 L20 24 C21.1 24 22 23.1 22 22 L22 12 Z" {...p}/>
          <path d="M22 14 L24 14 C25.7 14 27 15.3 27 17 C27 18.7 25.7 20 24 20 L22 20" {...p}/>
          <path d="M10 8 C10 8 11 6 12 8 C13 10 14 8 14 8" {...p} strokeWidth={1.5}/>
          <path d="M16 7 C16 7 17 5 18 7 C19 9 20 7 20 7" {...p} strokeWidth={1.5}/>
        </svg>
      );
    case 'outdoorSpaces':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 6 L16 26" {...p}/>
          <path d="M16 6 C16 6 8 12 8 17 C8 17 12 16 16 18 C20 16 24 17 24 17 C24 12 16 6 16 6Z" {...p}/>
          <path d="M10 26 L22 26" {...p}/>
        </svg>
      );
    case 'nightlife':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M8 6 L24 6 L17 16 L17 24 L21 24 L21 26 L11 26 L11 24 L15 24 L15 16 Z" {...p}/>
          <path d="M9 10 L23 10" {...p} strokeWidth={1.5}/>
          <circle cx="20" cy="8" r="1.5" fill={c}/>
        </svg>
      );
    case 'familyFriendly':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <circle cx="12" cy="8" r="3" {...p}/>
          <circle cx="20" cy="8" r="3" {...p}/>
          <circle cx="16" cy="20" r="2.5" {...p} strokeWidth={1.5}/>
          <path d="M6 20 C6 16 9 14 12 14 L20 14 C23 14 26 16 26 20 L26 24 L6 24 Z" {...p}/>
        </svg>
      );
    case 'culturalDiversity':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="10" {...p}/>
          <path d="M16 6 C16 6 12 10 12 16 C12 22 16 26 16 26" {...p} strokeWidth={1.5}/>
          <path d="M16 6 C16 6 20 10 20 16 C20 22 16 26 16 26" {...p} strokeWidth={1.5}/>
          <path d="M6 16 L26 16" {...p} strokeWidth={1.5}/>
          <path d="M7 11 L25 11M7 21 L25 21" {...p} strokeWidth={1}/>
        </svg>
      );
    case 'affordability':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="10" {...p}/>
          <path d="M16 8 L16 10M16 22 L16 24" {...p}/>
          <path d="M12 12 C12 10.9 13.8 10 16 10 C18.2 10 20 10.9 20 12 C20 13.1 18.2 14 16 14 C13.8 14 12 14.9 12 16 C12 17.1 13.8 18 16 18 C18.2 18 20 17.1 20 16" {...p}/>
        </svg>
      );
    case 'quietResidential':
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M6 16 L16 7 L26 16" {...p}/>
          <path d="M9 14 L9 25 L23 25 L23 14" {...p}/>
          <rect x="13" y="18" width="6" height="7" rx="1" {...p} strokeWidth={1.5}/>
        </svg>
      );
    default:
      return <svg width="24" height="24" viewBox="0 0 32 32"/>;
  }
}

type PriorityMap = Record<string, PriorityLabel>;
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
  const [sheetOpen, setSheetOpen]       = useState(false);
  const [citySearch, setCitySearch]     = useState('');

  useEffect(() => {
    const returning = sessionStorage.getItem('citytwin_returning');
    sessionStorage.removeItem('citytwin_returning');

    if (returning !== 'true') return;

    const savedCity = localStorage.getItem('citytwin_city');
    if (savedCity) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[CityTwin] Restored city from localStorage:', savedCity);
      }
      setSelectedCity(savedCity);
    }

    const savedPriorities = localStorage.getItem('citytwin_priorities');
    if (savedPriorities) {
      const parsed: PriorityMap = JSON.parse(savedPriorities);
      setPriorities(parsed);
      setSelectedCats(new Set(Object.keys(parsed)));
    }
  }, []);

  function showError(step: StepNum) { setErrors((e) => ({ ...e, [step]: true })); }
  function hideError(step: StepNum) { setErrors((e) => ({ ...e, [step]: false })); }

  function handleSelectCity(key: string) {
    setSelectedCity(key);
    hideError(1);
  }

  function handleConfirmCity() {
    setSheetOpen(false);
    setCitySearch('');
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
    localStorage.setItem('citytwin_results',    JSON.stringify(results));
    localStorage.setItem('citytwin_city',       selectedCity!);
    localStorage.setItem('citytwin_priorities', JSON.stringify(priorities));
    router.push('/results');
  }

  const stepDone   = (n: number) => n < currentStep;
  const stepActive = (n: number) => n === currentStep;
  const progressWidth = currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '99%';
  const selectedCityData = CITIES.find(c => c.key === selectedCity);
  const filteredCities = citySearch
    ? CITIES.filter(c =>
        c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
        c.state.toLowerCase().includes(citySearch.toLowerCase())
      )
    : CITIES;

  return (
    <div className="find-body" data-step={currentStep}>

      <nav className="find-nav">
        <Link href="/" className="nav-brand">
          <CTLogo size={32} />
          <span className="nav-brand-name">CityTwin</span>
        </Link>
        <div className="nav-end">
          <Link href="/" className="nav-back">← Home</Link>
          <NavAuth />
        </div>
      </nav>

      <div className="progress-wrap">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: progressWidth }} />
        </div>
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

        {/* STEP 1: CITY */}
        <div className={`step-panel${currentStep === 1 ? ' active' : ''}`}>
          <div className="step-eyebrow">Step 1 of 3</div>
          <h1 className="step-heading">Where are you moving to?</h1>
          <p className="step-sub">Pick your destination city. We will match you to the neighborhoods most likely to feel like home.</p>

          <button
            className={`city-trigger${selectedCity ? ' has-value' : ''}`}
            onClick={() => setSheetOpen(true)}
          >
            <svg className="city-trigger-icon" width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C4.477 0 0 4.477 0 10c0 7.5 10 14 10 14s10-6.5 10-14C20 4.477 15.523 0 10 0z" fill="#162F4A"/>
              <circle cx="10" cy="9" r="3" fill="white"/>
            </svg>
            <div className="city-trigger-text">
              <span className="label">Destination city</span>
              {selectedCity
                ? <span className="value">{selectedCityData?.name}</span>
                : <span className="placeholder">Choose your destination</span>
              }
            </div>
            <span className="city-trigger-arrow">›</span>
          </button>

          {selectedCityData && (
            <div className="city-confirm">
              <div className="city-confirm-name">{selectedCityData.name}</div>
              <div className="city-confirm-note">{selectedCityData.note}</div>
            </div>
          )}

          <div className={`val-msg${errors[1] ? ' show' : ''}`}>Please select a city to continue.</div>
          <div className="find-btn-row">
            <button
              className="find-btn-primary"
              onClick={() => goToStep(2)}
              disabled={!selectedCity}
            >
              Continue →
            </button>
          </div>
        </div>

        {/* STEP 2: LIFESTYLE */}
        <div className={`step-panel${currentStep === 2 ? ' active' : ''}`}>
          <div className="step-eyebrow">Step 2 of 3</div>
          <h1 className="step-heading">What shapes your daily life?</h1>
          <p className="step-sub">Select everything that matters to you in a neighborhood. Pick at least 3, more gives better results.</p>
          <p className="sel-hint">Selected: <strong>{selectedCats.size}</strong> of 10</p>

          <div className="category-grid">
            {LIFESTYLE_CATEGORIES.map((cat: any) => (
              <div
                key={cat.id}
                className={`category-card${selectedCats.has(cat.id) ? ' selected' : ''}`}
                onClick={() => handleToggleCat(cat.id)}
              >
                <div className="cat-check">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="cat-icon">{getCategoryIcon(cat.id, selectedCats.has(cat.id))}</span>
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

        {/* STEP 3: PRIORITIES */}
        <div className={`step-panel${currentStep === 3 ? ' active' : ''}`}>
          <div className="step-eyebrow">Step 3 of 3</div>
          <h1 className="step-heading">How much does each one matter?</h1>
          <p className="step-sub">Be honest. This is what makes your match accurate. A must have carries three times the weight of nice to have.</p>

          <div className="priority-list">
            {[...selectedCats].map((catId) => {
              const cat = LIFESTYLE_CATEGORIES.find((c: any) => c.id === catId);
              if (!cat) return null;
              return (
                <div key={catId} className="priority-row">
                  <div className="priority-name">
                    {getCategoryIcon(cat.id, false)} {cat.label}
                  </div>
                  <div className="priority-options">
                    {(['must-have', 'important', 'nice-to-have'] as PriorityLabel[]).map((val) => {
                      const active = priorities[catId] === val;
                      return (
                        <button
                          key={val}
                          className={`priority-btn${active ? ` ${PRIORITY_BTN_CLASS[val]}` : ''}`}
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

      {/* BOTTOM SHEET */}
      {sheetOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setSheetOpen(false)} />
          <div className="bottom-sheet">
            <div className="sheet-handle" />
            <div className="sheet-header">
              <input
                className="sheet-search"
                type="text"
                placeholder="Search cities..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
              />
            </div>
            <div className="sheet-body">
              {!citySearch && (
                <div>
                  <div className="sheet-region-label popular">POPULAR</div>
                  {POPULAR_CITY_KEYS.map((key) => {
                    const city = CITIES.find(c => c.key === key);
                    if (!city) return null;
                    return (
                      <div
                        key={`popular-${city.key}`}
                        className={`sheet-city-row${selectedCity === city.key ? ' selected' : ''}`}
                        onClick={() => handleSelectCity(city.key)}
                      >
                        <div className="sheet-city-avatar">{city.abbr}</div>
                        <div className="sheet-city-info">
                          <div className="sheet-city-name">{city.name}</div>
                          <div className="sheet-city-note">{city.note}</div>
                        </div>
                        {selectedCity === city.key && (
                          <span className="sheet-city-check">✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {CITY_REGIONS.map((region) => {
                const regionCities = filteredCities.filter(c => c.region === region);
                if (regionCities.length === 0) return null;
                return (
                  <div key={region}>
                    <div className="sheet-region-label">{region}</div>
                    {regionCities.map((city) => (
                      <div
                        key={city.key}
                        className={`sheet-city-row${selectedCity === city.key ? ' selected' : ''}`}
                        onClick={() => handleSelectCity(city.key)}
                      >
                        <div className="sheet-city-avatar">{city.abbr}</div>
                        <div className="sheet-city-info">
                          <div className="sheet-city-name">{city.name}</div>
                          <div className="sheet-city-note">{city.note}</div>
                        </div>
                        {selectedCity === city.key && (
                          <span className="sheet-city-check">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
              <div className="sheet-request-link">
                <a href="mailto:hello@citytwinapp.com?subject=City Request">
                  Don&apos;t see your city? Request it
                </a>
              </div>
            </div>
            <div className="sheet-footer">
              <button
                className="sheet-confirm-btn"
                disabled={!selectedCity}
                onClick={handleConfirmCity}
              >
                {selectedCity
                  ? `Confirm ${CITIES.find(c => c.key === selectedCity)?.name}`
                  : 'Select a city to continue'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
