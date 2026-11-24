import { KeyboardReportData } from "@/domain/entities/keyboard";

export function formatDiagnosticReport(data: KeyboardReportData): string {
  const pct =
    data.totalKeys > 0 ? Math.round((data.testedCount / data.totalKeys) * 100) : 0;

  return [
    "KeyGlass Online Keyboard Diagnostic Report",
    "------------------------------------------",
    `Layout: ${data.layoutName} (${data.os === "mac" ? "macOS" : "Windows/Linux"})`,
    `Keys Verified: ${data.testedCount}/${data.totalKeys} (${pct}%)`,
    `Total Keystrokes: ${data.totalPresses}`,
    `Peak N-Key Rollover: ${data.peakNkro}KRO`,
    `Switch Chatter Incidents (<55ms): ${data.chatterCount}${
      data.chatterCount > 0 ? ` (${data.chatterKeyCodes.join(", ")})` : " — Clean"
    }`,
    `Tested at: ${data.testedAt.toLocaleString()}`,
  ].join("\n");
}
