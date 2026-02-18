import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Scissors, 
  ExternalLink,
  ArrowRight,
  Trash2,
  RotateCcw,
  Check,
  Save,
  Database,
  Info,
  X,
  Github,
  ChevronRight,
  AlertTriangle,
  Download
} from 'lucide-react';

import { Appointment, UserSettings, AppointmentStatus } from './types';
import * as StorageService from './services/storage';

export default function App() {
  // State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ frequencyDays: 28 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // Form State
  const [newDate, setNewDate] = useState<string>("");

  // 1. Load initial data on mount
  useEffect(() => {
    const storedAppts = StorageService.getStoredAppointments();
    const storedSettings = StorageService.getStoredSettings();
    
    setAppointments(storedAppts);
    setSettings(storedSettings);
    setIsLoaded(true);
  }, []);

  // 2. Save appointments whenever they change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      setIsSaving(true);
      StorageService.saveAppointments(appointments);
      const timer = setTimeout(() => setIsSaving(false), 500);
      return () => clearTimeout(timer);
    }
  }, [appointments, isLoaded]);

  // 3. Save settings whenever they change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      StorageService.saveSettings(settings);
    }
  }, [settings, isLoaded]);

  // Handlers
  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;

    const lastAppt = appointments.length > 0 ? appointments[appointments.length - 1] : null;
    const defaultFreq = lastAppt?.frequencyDays || 28;

    const newAppt: Appointment = {
      id: Date.now().toString(),
      date: newDate,
      status: AppointmentStatus.PLANNED,
      frequencyDays: defaultFreq
    };

    setAppointments(prev => [...prev, newAppt].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewDate("");
  };

  const toggleStatus = (id: string) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === id 
        ? { ...appt, status: appt.status === AppointmentStatus.PLANNED ? AppointmentStatus.COMPLETED : AppointmentStatus.PLANNED }
        : appt
    ));
  };

  const updateFrequency = (id: string, newFreq: number) => {
    setAppointments(prev => prev.map(appt => 
      appt.id === id ? { ...appt, frequencyDays: newFreq } : appt
    ));
  };

  const deleteAppointment = (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo appuntamento?")) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-[#5170ff] p-2 rounded-lg shadow-sm">
              <Scissors className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">Appuntamenti Barbiere</h1>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight sm:hidden">Barbiere</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowGuide(true)}
              className="p-2 text-slate-400 hover:text-[#5170ff] hover:bg-slate-50 rounded-lg transition-colors"
              title="Guida alla pubblicazione"
            >
              <Info className="w-6 h-6" />
            </button>

            <a 
              href="https://bullcutcasteldazzano.setmore.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#5170ff] hover:bg-[#405cdb] text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center space-x-2 shadow-md"
            >
              <span className="hidden xs:inline">Prenota</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-8">

        {/* Add Appointment */}
        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#5170ff]" />
              Nuovo Appuntamento
            </h2>
            {isLoaded && (
              <div className="flex items-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                <Database className="w-3 h-3 mr-1" />
                {isSaving ? "Salvataggio..." : "Sincronizzato"}
              </div>
            )}
          </div>
          <form onSubmit={handleAddAppointment} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full flex-grow">
              <label className="block text-sm text-slate-500 mb-1 font-medium">Data e Ora</label>
              <input 
                type="datetime-local" 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 h-11 text-slate-900 focus:ring-2 focus:ring-[#5170ff] focus:outline-none transition-shadow"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={!newDate}
              title="Salva Appuntamento"
              className="h-11 w-full sm:w-11 flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-md flex-shrink-0"
            >
              <Save className="w-5 h-5" />
            </button>
          </form>
        </section>

        {/* List */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 pl-1">Lista Appuntamenti</h2>
          
          {appointments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-slate-50 rounded-full">
                <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium">Nessun appuntamento in memoria.</p>
              <p className="text-xs text-slate-300 max-w-xs">I tuoi dati verranno salvati automaticamente in questo browser.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => {
                const date = new Date(appt.date);
                const isPast = date < new Date();
                const isCompleted = appt.status === AppointmentStatus.COMPLETED;
                
                const freq = appt.frequencyDays || 28;
                const projectedDate = new Date(date.getTime() + freq * 24 * 60 * 60 * 1000);

                return (
                  <div 
                    key={appt.id} 
                    className={`relative overflow-hidden group flex flex-col p-4 bg-white rounded-xl border transition-all ${
                      isCompleted ? 'border-emerald-100 opacity-75' : 'border-slate-200 hover:border-[#5170ff]/30 hover:shadow-md'
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCompleted ? 'bg-emerald-500' : 'bg-[#5170ff]'}`} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-3">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 pt-1">
                          <div className={`p-2 rounded-full ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-[#5170ff]'}`}>
                              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                        </div>
                        <div>
                          <p className={`font-semibold text-lg ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </p>
                          <p className="text-slate-500 text-sm flex items-center">
                            {date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                            {isPast && !isCompleted && <span className="ml-2 text-red-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-50 rounded border border-red-100">Scaduto</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0 justify-end">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                            <input 
                              type="number" 
                              min="1"
                              value={appt.frequencyDays || 28}
                              onChange={(e) => updateFrequency(appt.id, parseInt(e.target.value) || 28)}
                              className="w-10 bg-transparent text-center text-sm text-slate-900 focus:outline-none border-b border-slate-300 focus:border-[#5170ff] px-0 py-0.5"
                            />
                            <span className="text-xs text-slate-500 ml-1">gg</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] uppercase text-slate-400 font-semibold text-right">Prox:</span>
                            <span className="text-xs font-bold text-[#5170ff] whitespace-nowrap">
                              {projectedDate.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                            onClick={() => toggleStatus(appt.id)}
                            className={`p-2 rounded-lg text-white transition-all shadow-sm ${
                                isCompleted ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500' 
                            }`}
                            >
                            {isCompleted ? <RotateCcw className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                            </button>
                            <button onClick={() => deleteAppointment(appt.id)} className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all shadow-sm">
                            <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="bg-[#5170ff] p-2 rounded-lg">
                  <Github className="text-white w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Guida alla Pubblicazione</h3>
              </div>
              <button onClick={() => setShowGuide(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* GitHub Pages standard steps */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#5170ff] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-semibold text-slate-900">Crea il Repository</p>
                    <p className="text-sm text-slate-500">Crea un repo pubblico chiamato <code>appuntamenti-barbiere</code> su GitHub.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-[#5170ff] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-semibold text-slate-900">Pubblica i File</p>
                    <p className="text-sm text-slate-500">Usa il tasto "Stage and commit" dell'ambiente di sviluppo per inviare i file.</p>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Section */}
              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                <h4 className="text-amber-800 font-bold flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  "Something went wrong" durante il commit?
                </h4>
                <p className="text-sm text-amber-700 mb-3">
                  Se il tasto dà errore, è un problema di connessione temporaneo. Prova così:
                </p>
                <ol className="text-xs text-amber-700 space-y-2 list-decimal ml-4 font-medium">
                  <li>Ricarica la pagina del browser e riprova.</li>
                  <li>Assicurati di aver dato i permessi a GitHub nelle impostazioni dell'IDE.</li>
                  <li><b>Metodo Manuale:</b> Scarica il progetto come ZIP, vai sul tuo repo GitHub e clicca su "Add file" &gt; "Upload files" trascinando tutto dentro.</li>
                </ol>
                <div className="mt-4 flex gap-2">
                    <div className="bg-amber-100 text-amber-900 px-3 py-2 rounded flex items-center text-[10px] font-bold uppercase tracking-wider">
                        <Download className="w-3 h-3 mr-2" /> 
                        Scarica ZIP e carica a mano
                    </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Link Finale
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  https://[tuo-utente].github.io/appuntamenti-barbiere/
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-900 mb-2">Come installarla sul telefono:</p>
                <ul className="text-sm text-slate-500 space-y-2">
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-[#5170ff]" /> Apri il link dal browser dello smartphone.</li>
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-[#5170ff]" /> "Aggiungi a Schermata Home".</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button onClick={() => setShowGuide(false)} className="w-full py-3 bg-[#5170ff] text-white font-bold rounded-xl hover:bg-[#405cdb] transition-colors shadow-lg">
                Chiudi Guida
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <footer className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-400 text-xs flex items-center justify-center">
          <Database className="w-3 h-3 mr-1" />
          Dati salvati automaticamente in locale sul tuo browser.
        </p>
      </footer>
    </div>
  );
}