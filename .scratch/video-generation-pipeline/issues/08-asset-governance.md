# Definire provenance, diritti e conservazione degli asset

Type: grilling
Status: resolved
Blocked by: 03, 04, 06

## Question

Quali metadati, policy e legami devono rendere tracciabili origine, prompt, modello, licenza, consenso, ownership, scadenza, trasformazioni e utilizzo di ogni asset fino ai master e alle varianti finali?

## Answer

La governance separa contenuto binario, significato progettuale e permessi. Un Blob tecnicamente valido non è automaticamente un Asset utilizzabile, e un Asset utilizzabile in preview non è automaticamente autorizzato alla release.

### Blob, Asset e lineage

Il Blob è contenuto immutabile identificato da SHA-256; nome, path e URL sono alias. L'Asset è un record project-scoped che associa al Blob origine, actor, data, scopo, sensibilità, costo, diritti e lineage. Lo stesso Blob può supportare Asset distinti senza condividere implicitamente metadata o permessi.

Ogni trasformazione — crop, transcode, upscale, color grade, compositing — produce un nuovo Blob/Asset e collega parent, tool/versione, parametri e actor. Il derivato eredita l'intersezione dei vincoli dei parent e può aggiungerne; non amplia i diritti.

### Provenance

Ogni Asset registra origine e source reference, data di acquisizione, autore/provider, metodo di creazione, parent/trasformazioni, MIME, codec, dimensioni, durata, costo e actor. Per generazioni AI conserva provider, modello/versione, schema, prompt, parametri, reference, job, termini applicabili, piano account non sensibile e metadata/C2PA disponibili, senza promettere unicità o non violazione.

File acquisiti da URL o stock vengono materializzati; si conservano URL, timestamp, hash e snapshot/riferimento ai termini validi al momento dell'acquisizione.

### Rights e Consent

Il Rights Grant contiene titolare, licenza/contratto, prova, usi, media, territori, durata, attribuzione, sublicenza, modificabilità e restrizioni AI. Il Consent Grant è separato e lega soggetto, likeness/voice, cloning/trasformazione, scopo, media, territori, durata e revocabilità.

Attribuzioni obbligatorie includono testo, posizione e modalità. Il Release Manifest verifica la loro presenza nei credit, nel video o nei metadata richiesti.

Documenti legali, liberatorie e consensi restano in storage restricted. Il repository conserva soltanto ID, hash, tipo, autorità, validità e secure reference.

### Stati e sensibilità

Gli Asset sono classificati `public`, `internal` o `restricted`. Materiale restricted non entra in Git, log o bundle condivisibili e richiede accesso esplicito.

Un Asset con provenance/diritti incompleti è `quarantined` o `internal-preview-only`: può essere analizzato e apparire in preview marcate, ma non contribuire a un deliverable releasable. Diritti sconosciuti non vengono inferiti.

### Retention, cancellazione e revoca

Retention è configurata per classe/progetto. Blob referenziati da Storyboard, Approval, render o Release Manifest non vengono eliminati automaticamente. Garbage collection produce un report, verifica l'assenza di riferimenti, applica quarantena temporale e richiede conferma; non opera durante build/render.

Una scadenza o revoca propaga `blocked/non-releasable` nel dependency graph. Render esistenti restano auditabili ma non distribuibili. Per richieste di cancellazione, Blob/evidenza vengono eliminati o resi inaccessibili quando consentito, mantenendo un tombstone minimo non personale; legal hold espliciti sospendono la cancellazione secondo policy autorizzata.

### Deduplicazione, export e uso finale

La deduplicazione fisica avviene a livello Blob. Asset record, diritti e sensibilità restano isolati per progetto. Export e render bundle includono soltanto materiale necessario e autorizzato; evidenze restricted restano referenziate, non incorporate, e log/manifest vengono redatti per la destinazione.

Ogni deliverable produce un Asset Usage Manifest che collega Asset, variante, scena, layer, intervallo temporale/frame, trasformazioni e Rights/Consent Grant. Dal frame finale deve essere possibile risalire alla lineage completa.

## Recursive grilling — depth 2

**Verdict:** provenance/revocation pronte; erasure fisica richiede protocollo autonomo. Logical Asset erasure, access/crypto revocation e Blob deletion sono distinti. Delete su Blob deduplicato richiede reference authority globale consistente, replica inventory, last-reference recheck, retention/legal hold, backup/export obligations e tombstone che renda il replay `erased/unavailable`. Rights revocation deve produrre obblighi per deliverable già distribuiti, senza fingere controllo su copie esterne. **Residual uncertainty:** SLA/obblighi giurisdizionali e capacità reali di crypto-erasure/storage provider.
