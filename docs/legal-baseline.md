# Rechts- und Datenschutz-Baseline der Website

**Erfasst am:** 1. Oktober 2026

**Gilt für:** FWWebsite / GIEMSA-Website

**Status:** Arbeitsannahmen des Betreibers und vorläufige Orientierung, keine Rechtsberatung.

## Vom Betreiber bestätigte Annahmen

- Die Website dient aktuell ausschließlich der persönlichen Selbstdarstellung.
- Der Betreiber hat kein Gewerbe und bietet über die Website weder Waren noch bezahlte Leistungen zum Vertrieb an.
- Es sollen absichtlich keine personenbezogenen Daten gesammelt oder gespeichert werden.
- Es sollen keine Cookies eingesetzt werden; deshalb soll es keinen Cookie-Banner geben.
- Vor jeder Änderung, die diese Annahmen berühren könnte, muss der Betreiber ausdrücklich darauf hingewiesen werden. Keine Datenübermittlung, Analyse-/Marketingfunktion, Cookie-Technik oder kommerzielle Funktion ohne vorherige Klärung hinzufügen.

## Befund zum aktuellen Quellstand

- Bei der Durchsicht wurden keine Analytics-/Werbe-Skripte, externen Einbettungen, Cookie-, `localStorage`- oder `sessionStorage`-Verwendung gefunden. Schriftdateien kommen aus Projektabhängigkeiten und werden lokal gebündelt.
- Das Kontaktformular und dessen CTA wurden entfernt. Der Stand nach dieser Änderung fragt keine Besucher-E-Mail, Firma oder Projektangaben über ein Formular ab.
- Der Website-Server in `server/app.js` speichert selbst keine Formulareingaben. Unabhängig davon können der Webserver, Nginx, Hostinganbieter oder Sicherheitsdienste Verbindungsdaten (insbesondere IP-Adressen und Zeitstempel) in Logs verarbeiten. Das muss anhand der tatsächlichen Server- und Anbieter-Konfiguration geprüft werden; „keine absichtliche Datensammlung“ beweist nicht, dass technisch keinerlei personenbezogene Daten verarbeitet werden.
- Die frühere Beratungs-/Projektanfrage im Kontaktfenster ist entfernt. Bei späteren Änderungen ist zu prüfen, ob Texte oder Funktionen wieder entgeltliche Leistungen, Kundenakquise oder ein geschäftsmäßiges Angebot nahelegen. „Kein Gewerbe angemeldet“ entscheidet die rechtliche Einordnung nicht allein.

## Vorläufige Einordnung unter den bestätigten Annahmen

- **Impressum/Anbieterkennzeichnung:** Bei tatsächlich rein privater, nicht geschäftsmäßiger Selbstdarstellung ohne entgeltliches Angebot kann die Pflicht aus § 5 DDG entfallen. Das ist keine pauschale Ausnahme für jede natürliche Person. Wenn die Website Leistungen bewirbt, Kundenakquise betreibt, Einnahmen erzielt oder sonst als geschäftsmäßiges Angebot erscheint, erneut prüfen und den Betreiber warnen. § 5 DDG verlangt in seinem Anwendungsbereich Kontaktangaben für schnelle elektronische Kontaktaufnahme und unmittelbare Kommunikation einschließlich E-Mail; ein Webformular als solches schreibt der Wortlaut nicht vor.
- **Datenschutz:** Kein Formularversand und kein Tracking bedeuten nicht automatisch, dass es keinerlei DSGVO-relevante Verarbeitung gibt. Hosting- und Zugriffslogs sowie eingesetzte Schutzdienste prüfen. Falls dabei personenbezogene Daten verarbeitet werden, den Betreiber vor Aktivierung/Veröffentlichung einer entsprechenden Datenschutzerklärung klar informieren und die realen Zwecke, Rechtsgrundlagen, Empfänger und Aufbewahrung korrekt ermitteln.
- **Cookies/Endgerätezugriff:** Für den derzeit untersuchten Frontend-Quellstand ist kein Cookie-Banner vorgesehen. Keine Cookies, Endgeräte-Speicherung/-Auslesung, Analyse- oder Marketingtechnologien ergänzen, ohne vorher den Betreiber zu informieren und die Anforderungen von § 25 TDDDG zu prüfen. Falls künftig eine Einwilligung erforderlich ist, erst nach wirksamer Einwilligung laden und eine gleichwertige Ablehnung ermöglichen.

## Änderungsauslöser — vor Umsetzung erneut prüfen und Betreiber warnen

1. Die Website bietet oder bewirbt Beratung, Jobs, Aufträge, Produkte, Buchungen, Zahlungen, Spenden, Werbung oder sonstige Einnahmen.
2. Ein Kontaktformular oder anderer Eingabekanal wird ergänzt oder an E-Mail, API, CRM oder einen Drittanbieter angeschlossen; Eingaben werden verarbeitet, gespeichert oder weitergeleitet.
3. Analytics, Pixel, Cookies, lokale Speicherung, externe Fonts, Videos, Karten, Captchas, Newsletter oder sonstige Drittanbieter werden hinzugefügt.
4. Hosting, Nginx-/Sicherheitslogs, Empfänger, Aufbewahrungsfristen oder Verarbeitungsorte ändern sich.
5. Verbraucher können Leistungen online anfragen, buchen oder Verträge schließen; dann zusätzlich Verbraucherrecht und gegebenenfalls BFSG prüfen.
6. Es erscheinen redaktionell-journalistische Inhalte, Nutzerbeiträge oder ein öffentliches Kommentarsystem.

## Amtliche Ausgangsquellen

- [DDG § 5 – Allgemeine Informationspflichten](https://www.gesetze-im-internet.de/ddg/__5.html)
- [DSGVO – Verordnung (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de)
- [TDDDG § 25 – Schutz der Privatsphäre bei Endeinrichtungen](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [BFSG § 1 – Anwendungsbereich](https://www.gesetze-im-internet.de/bfsg/__1.html)
- [BFSG § 2 – Begriffsbestimmungen, u. a. Kleinstunternehmen](https://www.gesetze-im-internet.de/bfsg/__2.html)
- [BFSG § 3 – Barrierefreiheit und Ausnahme für Dienstleistungs-Kleinstunternehmen](https://www.gesetze-im-internet.de/bfsg/__3.html)
