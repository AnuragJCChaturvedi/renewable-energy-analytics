// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import Header from "../components/layout/Header";
import { TrendsChart, TrendsData } from "../components/charts/TrendsChart";
import { StackedBarChart } from "../components/charts/StackedBarChart";
import { PieChart, SummaryData } from "../components/charts/PieChart";
import { ComposedChart, ComposedData } from "../components/charts/ComposedChart";

// Configuration options
const VIEW_OPTIONS = [
  { key: "trends", label: "Trends" },
  { key: "composition", label: "Composition" },
  { key: "summary", label: "Summary" },
  { key: "composed", label: "Comparison" },
] as const;
const TYPE_OPTIONS = ["Consumption", "Generation"] as const;
const HIGHLIGHT_SOURCES = ["Solar", "Tidal", "Grid", "Hydro", "Geothermal"] as const;

type ViewKey = typeof VIEW_OPTIONS[number]["key"];
type EnergyType = typeof TYPE_OPTIONS[number];
type Source = typeof HIGHLIGHT_SOURCES[number];

const Dashboard: React.FC = () => {
  const [view, setView] = useState<ViewKey>("trends");
  const [energyType, setEnergyType] = useState<EnergyType>("Consumption");
  const [highlight, setHighlight] = useState<Source>("Solar");
  const [loading, setLoading] = useState(false);

  const [trendsData, setTrendsData] = useState<TrendsData[]>([]);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [composedData, setComposedData] = useState<ComposedData[]>([]);

  // Fetch data on filter changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const typeParam = energyType.toLowerCase();
        if (view === "trends" || view === "composition") {
          const res = await axios.get<TrendsData[]>(
            `/energy/${view}?energy_type=${typeParam}`
          );
          setTrendsData(res.data);
        } else if (view === "summary") {
          const res = await axios.get<SummaryData[]>(
            `/energy/summary?energy_type=${typeParam}`
          );
          setSummaryData(res.data);
        } else {
          const res = await axios.get<ComposedData[]>(
            `/energy/composed?energy_type=${typeParam}&highlight=${highlight.toLowerCase()}`
          );
          setComposedData(res.data);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [view, energyType, highlight]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <Header />

      <div className="flex flex-1">
        {/* Sidebar Filters */}
        <aside className="w-64 bg-white border-r p-6 space-y-8 sticky top-0 h-screen">
          <h2 className="text-lg font-semibold">Filters</h2>

          {/* Energy Type */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Energy Type</h3>
            <div className="flex flex-col space-y-2">
              {TYPE_OPTIONS.map((type) => (
                <button
                  key={type}
                  onClick={() => setEnergyType(type)}
                  className={`text-left px-4 py-2 rounded-lg transition-colors duration-200 font-medium
                    ${energyType === type
                      ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* View Options */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">View</h3>
            <nav className="flex flex-col space-y-2">
              {VIEW_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={`text-left px-4 py-2 rounded-lg transition-colors duration-200 font-medium
                    ${view === key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Highlight Source (only in Comparison View) */}
          {view === 'composed' && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700">Highlight Source</h3>
              <div className="flex flex-wrap gap-2">
                {HIGHLIGHT_SOURCES.map((src) => (
                  <button
                    key={src}
                    onClick={() => setHighlight(src)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 font-medium
                      ${highlight === src
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-500">Loading data...</span>
            </div>
          ) : (
            <div className="space-y-8">
              {view === 'trends' && <TrendsChart data={trendsData} />}
              {view === 'composition' && <StackedBarChart data={trendsData} />}
              {view === 'summary' && <PieChart data={summaryData} />}
              {view === 'composed' && (
                <ComposedChart data={composedData} highlightLabel={highlight} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;