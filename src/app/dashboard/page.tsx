import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";


export default function DashboardHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 tracking-tight drop-shadow">
        Benvenuto in <span className="text-green-600">AgroScan</span>
      </h1>
      <p className="max-w-xl text-lg md:text-xl text-gray-600 mb-8">
        AgroScan è il tuo gestionale intelligente per la **valutazione tecnica degli alberi**.<br />
        Carica facilmente i file <b>.rgp</b> delle tue misurazioni e visualizza in pochi istanti dati, grafici e report PDF professionali. <br /><br />
        <span className="text-blue-500 font-semibold">
          Digitalizza e organizza le tue analisi, risparmia tempo e migliora la precisione!
        </span>
      </p>
      {/* In futuro qui puoi aggiungere direttamente il box upload file */}
      <div className="mt-4">
        <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-base shadow">
          Seleziona "Carica Documento" nel menu per iniziare
        </span>
      </div>
    </div>
  );
}
