# **Clients HTTP en Arquitectures Frontend Modernes: Un Estudi Comparatiu, Operatiu i de Seguretat**

## **Ànalisi Comparativa d'Arquitectura: Axios enfront de Fetch API**

La comunicació de dades entre el client i el servidor s'ha convertit en un dels vectors més crítics per al rendiment, la seguretat i l'experiència d'usuari (UX) d'una aplicació web.1 Tradicionalment, el desenvolupament en JavaScript s'ha estructurat al voltant de dues solucions predominants per a la realització de peticions HTTP: la API nativa Fetch i la llibreria de tercers Axios.1 Cadascuna d'aquestes opcions respon a filosofies de disseny diferents, i és crucial avaluar-ne les diferències estructurals.

### **Interceptors de Sol·licitud i Resposta**

Els interceptors representen un dels punts més forts d'Axios, ja que permeten implementar una capa intermedia (middleware) global abans que una petició surti cap a la xarxa o abans que una resposta sigui lliurada a la lògica de l'aplicació.2 Mitjançant aquest patró, es facilita la manipulació sistemàtica d'encapçalaments, el registre d'auditories o la injecció dinàmica de credencials d'accés.3  
D'altra banda, la Fetch API no ofereix suport natiu per a interceptors.3 Per aconseguir un comportament equivalent, el desenvolupador està obligat a crear una funció embolcalladora (wrapper) personalitzada al voltant del mètode fetch() global.3 Aquest procediment no només requereix un esforç addicional de desenvolupament, sinó que afegeix una quantitat substancial de codi redundant (boilerplate) que incrementa la complexitat i el risc d'errors en el manteniment del programari.3

### **Cancel·lació de Peticions i Control de Temps d'Espera**

El control sobre el cicle de vida de les peticions en vol és essencial per evitar el malbaratament d'ample de banda i de recursos de computació.6 Axios incorpora suport de fàbrica per al control de temps d'espera mitjançant el paràmetre de configuració timeout, el qual suspèn automàticament la petició si el servidor no respon dins del límit de mil·lisegons establert.1  
Amb Fetch, la gestió de timeouts s'ha d'implementar manualment mitjançant un temporitzador asíncron vinculat a un controlador d'avortament.10 Per a la cancel·lació activa, ambdues tecnologies empren l'estàndard de navegació AbortController i la seva propietat AbortSignal.1 No obstant això, mentre Axios simplifica la seva injecció directa en el seu objecte de configuració unificat, Fetch requereix l'associació directa del senyal d'avortament dins de l'objecte d'opcions init.1 Cal remarcar que l'estat d'un AbortSignal és unidisccional: un cop s'invoca el mètode .abort(), la propietat .aborted canvia a un estat permanent i no es pot reutilitzar, requerint la creació d'un nou controlador per a cada nova transacció de xarxa.10

### **Transformació Automàtica de Dades**

La manipulació del format de transmissió de dades és un dels àmbits on Axios ofereix una experiència de desenvolupament més simplificada.1 Axios converteix automàticament les dades de sol·licitud (sol·licitant tipus JSON, multipart/form-data o form-urlencoded) basant-se en els encapçalaments de contingut detectats, i parseja automàticament qualsevol resposta JSON entrant quan el servidor retorna l'encapçalament compatible.1  
En oposició, Fetch és un client de baix nivell que delega completament aquest control al programador.2 Per rebre i processar dades amb Fetch, és obligatori cridar explícitament el mètode corresponent de la resposta, generalment .json(), .text() o .blob(), la qual cosa afegeix una línia de codi asíncrona addicional i obre el camí a possibles fallades si el format del text rebut no és correctament parsejable.1

| Propietat de Disseny | Axios | Fetch API |
| :---- | :---- | :---- |
| **Origen del recurs** | Llibreria de tercers (necessita instal·lació) 1 | Interfície integrada nativament en el navegador i runtimes 1 |
| **Pes en el paquet final** | \~11.7 kB (gzipped) amb dependències internes 1 | 0 kB de sobrecàrrega de xarxa 1 |
| **Parseig JSON** | Automàtic basat en el tipus de contingut del servidor 1 | Manual via crida explícita a la promesa .json() 1 |
| **Suport d'interceptors** | Integrat amb mètodes d'afegit de regles globals 1 | Inexistent; requereix una funció embolcalladora 3 |
| **Gestió de timeouts** | Opció nativa timeout a la configuració 1 | Requereix temporitzador associat a AbortController 10 |
| **Estat d'errors HTTP** | Rebuig automàtic de la promesa per a codis no-2xx 1 | Resolució de la promesa per a qualsevol resposta de xarxa 1 |

## **Paradigmes de Resolució d'Errors i Robustesa**

La gestió correcta de les fallades a la xarxa o a les APIs és indispensable per evitar el col·lapse de les aplicacions frontend i garantir que els usuaris reben missatges d'error comprensibles i segurs.12 El comportament d'Axios i Fetch en aquest escenari divergeix dràsticament.1

### **La lògica d'errors de Fetch**

Fetch conceptualitza una petició HTTP com una transacció de xarxa pura.1 Per tant, Fetch només rebutjarà la promesa quan es produeixi un error físic real a la xarxa, com ara la manca completa de connexió de dades de l'usuari, una fallada de DNS o la impossibilitat d'establir la connexió HTTP de baix nivell.1 Si el servidor rep la petició i respon amb qualsevol codi d'error, com un 404 Not Found o un 500 Internal Server Error, Fetch considerarà que la sol·licitud s'ha completat de forma exitosa.1 El desenvolupador està obligat a comprovar manualment la propietat response.ok (la qual avalua si el codi es troba en el rang ![][image1]) i, en cas negatiu, llançar un error de forma explícita:

JavaScript  
const resposta \= await fetch('/api/recurs');  
if (\!resposta.ok) {  
  throw new Error(\`Error del servidor amb codi: ${resposta.status}\`);  
}  
const dades \= await resposta.json();

Aquest mètode manual augmenta notablement el codi escrit i, si no es manté de manera disciplinada, pot provocar que l'aplicació frontend continuï la seva execució utilitzant respostes buides o incompletes, provocant comportaments anòmals.1

### **La lògica d'errors d'Axios**

En contrast, Axios automatitza la detecció d'errors basant-se en els codis d'estat HTTP de la resposta.1 Per defecte, Axios rebutja automàticament la promesa si el codi d'estat de la resposta cau fora del rang d'èxit (![][image2]).1 Aquesta lògica es pot formalitzar mitjançant la funció de decisió d'errors següent:  
![][image3]  
on ![][image4] representa el codi d'estat HTTP retornat pel servidor. Quan es produeix aquest rebuig, s'estructura un objecte d'error molt complet que conté la propietat error.response (on s'allotgen les dades de resposta i els encapçalaments lliurats pel servidor), facilitant un depuració immediata de la fallada.1  
A nivell d'interfície d'usuari (UX), els errors no s'han de traduir mai en col·lapses o bloquejos de la pantalla.12 Es recomana que les aplicacions capturin aquests errors per retornar representacions visuals d'error elegants i missatges d'explicació adequats que informin l'usuari final sense comprometre la seguretat del sistema.12 S'han d'evitar missatges que mostrin traces d'error o dades del servidor que un atacant pugui utilitzar per conèixer l'arquitectura de la base de dades.12

## **Interceptors d'Axios per a la Gestió Centralitzada de l'Autenticació i Gestió de Respostes**

L'arquitectura basada en interceptors d'Axios proporciona un mecanisme ideal per concentrar les regles de negoci de seguretat i xarxa en un sol lloc del codi, evitant que cada crida o component hagi de conèixer de manera explícita l'estat dels tokens de sessió o de l'autenticació de l'usuari.1

### **Injecció de Credencials i Seguretat**

Amb un interceptor de sol·licitud (request interceptor), l'aplicació pot avaluar dinàmicament la presència d'un token d'accés (com un JWT) emmagatzemat a la memòria i injectar-lo en l'encapçalament d'autorització abans de lliurar-lo a la xarxa.3 Això garanteix que qualsevol petició nova feta pel client s'enviarà correctament securitzada sense necessitat de configurar encapçalaments en cada funció individual del frontend.3

### **Procés de Refresc de Tokens i Cues d'Espera**

Quan s'utilitza una autenticació basada en dades asíncrones de curta duració, es genera el problema de la pèrdua de validesa del token d'accés en mig de l'ús de l'aplicació.13 Els interceptors de resposta d'Axios permeten resoldre aquest escenari mitjançant el següent flux de refresc asíncron i reexecució d'errors 401 Unauthorized 13:

1. **Detecció de l'Error**: L'interceptor de resposta s'activa en rebre una resposta amb codi d'estat 401\.13  
2. **Control de Concurrència**: Per evitar que una aplicació que fa crides simultànies intenti llançar múltiples peticions de refresc paral·leles (provocant errors en la validació del token de refresc o generant trànsit innecessari), s'activa una bandera booleana global com isRefreshing \= true.13 Això assegura que només s'executi un procés de refresc asíncron en un instant donat.13  
3. **Cua d'Espera**: Qualsevol altra petició que rebi un error 401 mentre el refresc està actiu és detinguda de forma temporal.13 L'interceptor deté la seva execució mitjançant el retorn d'una nova promesa asíncrona, afegint les funcions de resolució (resolve) i rebuig (reject) d'aquesta promesa a una llista de cua de sol·licituds retingudes.13  
4. **Reexecució d'Errors**: Una vegada la petició de refresc de token es completa amb èxit, s'emmagatzema el nou token d'accés, s'actualitzen els paràmetres del client Axios global per a peticions futures, i es recorre tota la cua d'espera per actualitzar la capçalera de seguretat de les peticions en cua abans d'iniciar la seva execució automàtica amb el client actiu.13 Si el refresc falla completament, es rebutgen totes les peticions de la cua i s'executa un tancament de sessió net de l'usuari.13

## **Control de Fluxos Asíncrons Complexos**

Durant l'orquestració d'operacions asíncrones, és comú trobar situacions que requereixen d'estratègies concurrents per optimitzar els temps de resposta, o de patrons seqüencials per a un control més precís dels estats del flux.16

### **Execució Concurrent mitjançant Promise.all i Promise.allSettled**

Quan es necessiten obtenir dades d'orígens o recursos independents, la concurrentialitat permet estalviar un temps valuós accelerant el procés de recollida de dades.16 En lloc de fer crides de manera successiva, s'inicia l'execució en paral·lel de totes les peticions, col·locant les seves promeses dins de l'operació Promise.all.16 Aquest procediment redueix la latència global del procés asíncron complet al temps de resolució del recurs de xarxa individual més lent.16  
La resolució final de Promise.all retorna un vector on l'ordre dels elements de resposta és idèntic al vector original de promeses passat com a paràmetre, preservant la coherència del flux d'informació de l'aplicació.16 No obstant això, s'ha de considerar la seva vulnerabilitat davant d'errors: si una única promesa es rebutja, tota la transacció de Promise.all falla de forma immediata ("all or nothing"), ignorant l'estat d'èxit de les altres crides.16 Per fer front a això, es pot recórrer a Promise.allSettled, el qual assoleix una resolució unificada independentment de si algunes de les promeses individuals han fallat, retornant l'estat detallat de cadascuna.17

### **Execució Seqüencial amb async/await i bucles asíncrons**

Hi ha circumstàncies on les peticions s'han d'executar necessàriament de forma consecutiva.16 Això s'esdevé quan el resultat d'una crida inicial és requerit per poder calcular els arguments de la següent, o per evitar l'enviament massiu de peticions simultànies que puguin col·lapsar els servidors d'origen. Per implementar aquest patró de manera elegant, s'integren bucles síncrons clàssics (com un bucle for..of o un bucle while) dins d'una funció declarada amb la paraula clau async.16  
Dins del bloc del bucle, l'ús de la instrucció await abans d'iniciar la promesa de xarxa provoca la detenció temporal de l'execució del fil fins que la promesa es resolgui correctament.16 Un cop completada, l'execució de l'aplicació avança a la següent iteració del bucle per iniciar la següent crida de xarxa.16 Per controlar els errors que puguin succeir durant cadascuna de les passes de l'execució seqüencial, s'incorpora la lògica HTTP dins de blocs de gestió try..catch que permeten respondre i recuperar-se d'una possible fallada abans de decidir si cal aturar l'avanç del bucle.16

## **Seguretat en Connexions Frontend-API**

El desenvolupament modern d'aplicacions exposa el flux de dades a múltiples riscs de seguretat en el trànsit, la persistència o l'execució del codi.12 El disseny de la comunicació frontend-API ha de preveure solucions eficaces contra els principals vectors d'atac.12

### **Cross-Origin Resource Sharing (CORS)**

CORS és un mecanisme de seguretat incorporat pels navegadors web moderns per limitar que els recursos d'una API siguin consumits des d'un origen de domini web no autoritzat.19 El funcionament es basa en l'ús d'encapçalaments de resposta configurats al servidor, sent el més emblemàtic Access-Control-Allow-Origin.20 Davant de peticions potencialment complexes o destructives (com peticions PUT, DELETE o sol·licituds que enviïn dades en format JSON), el navegador envia una petició prèvia anomenada *preflight* mitjançant el verb HTTP OPTIONS per consultar quines accions, capçaleres o dominis estan autoritzats pel servidor.19  
Cal entendre clarament que CORS és un sistema que protegeix el client de la filtració d'informació llegida per un tercer, però no bloqueja l'execució física d'una sol·licitud si l'origen fa crides simples.19 Per aquest motiu, no es pot emprar CORS com un mitjà exclusiu per bloquejar atacs CSRF, ja que les peticions ordinàries (GET i POST comuns) s'enviaran i modificaran dades en el servidor igualment.19 El servidor ha d'incorporar controls d'autorització i d'accés rigorosos en els seus punts de sortida de dades.19

### **Cross-Site Scripting (XSS)**

Els atacs XSS es produeixen quan un atacant aconsegueix introduir o executar scripts nocius (generalment codi JavaScript) en el context de l'aplicació web que està fent servir un usuari final.19 Per evitar que dades capturades des d'una API es tradueixin en injeccions d'atacs de tipus DOM-based XSS, l'aplicació frontend ha d'adoptar la premissa fonamental de tractar tota informació rebuda o llegida de la xarxa com a dades pura i no codi avaluable.19  
S'ha d'evitar completament l'ús de funcions com eval() per processar missatges de xarxa i l'escriptura dinàmica de dades dins de propietats del DOM poc segures com innerHTML, sent recomanable utilitzar alternatives com element.textContent.19  
Quan s'utilitza la missatgeria del navegador (Web Messaging), la pàgina receptora té l'obligació estricta de validar el paràmetre origin de la font per assegurar-se que coincideix de forma exacta amb el nom de domini complet (Fully Qualified Domain Name) esperat.19 Així mateix, cal desconfiar d'estructures de persistència de l'usuari com LocalStorage o SessionStorage, ja que si l'aplicació pateix una única fallada de seguretat XSS en algun punt del seu codi, els atacants poden extreure instantàniament tota la informació securitzada que s'hi trobi allotjada.19 L'ús d'IndexedDB s'ha d'avaluar amb la mateixa precaució, aplicant desinfecció i filtrat d'entrades per a cada lectura realitzada.19

### **Cross-Site Request Forgery (CSRF)**

CSRF és un mecanisme d'atac on un lloc web maliciós aprofita l'estat d'autenticació actiu de l'usuari en una aplicació legítima diferent per induir al seu navegador a realitzar peticions destructives en nom d'aquest.12 Donat que els navegadors web tendeixen a adjuntar de manera automàtica les galetes (cookies) vàlides d'un domini quan fan una crida cap a aquest lloc d'origen (encara que la petició provingui d'una pàgina web de tercers), l'estat de sessió pot ser manipulat.12  
Per resoldre aquesta vulnerabilitat en la connexió frontend-API, es recomana persistir les dades del token d'accés utilitzant cookies configurades amb els atributs de seguretat següents 12:

* SameSite=Strict o SameSite=Lax: Impedeix que les cookies de sessió s'enviïn de manera automàtica en peticions iniciades des d'orígens o llocs de tercers.12  
* HttpOnly: Impedeix que qualsevol script de l'aplicació del client pugui llegir el contingut de la galeta, limitant de manera decisiva la revelació de credencials davant d'atacs XSS.12  
* Secure: Obliga el navegador a transmetre la cookie exclusivament a través d'enllaços que utilitzin protocols xifrats HTTPS.12

### **Seguretat OAuth i API Keys**

En el context d'arquitectures REST sense estat (stateless), la seguretat en els accessos ha d'implementar-se sota fluxos robustos.12 Si s'implementa un flux d'autenticació OAuth de tipus stateless, s'ha d'utilitzar obligatòriament la variant **Proof Key for Code Exchange (PKCE)** per evitar atacs d'intercepció i segrest del codi d'autorització durant les redireccions.12  
Per a connexions programàtiques de clients que hagin d'accedir a les nostres APIs de manera desassistida, és preferible emprar API Keys amb les següents especificacions de seguretat 12:

* **Generació Segura**: Utilitzar generadors criptogràfics aleatoris que minimitzin la predicció dels tokens.12  
* **Visibilitat Reduïda**: Mostrar l'API Key a l'usuari una sola vegada durant el seu procés d'alta o creació inicial, animant-los a emmagatzemar la clau mitjançant variables d'entorn i mai dins d'arxius de control de versions.12  
* **Transmissió Assegurada**: Rebre les API Keys directament des d'un encapçalat dedicat (com Authorization: apikey CLAU\_ACCES), en lloc de transmetre-les com a paràmetres dinàmics a la cadena de consulta de la URL (on podrien quedar registrades en l'historial del navegador o en els logs dels servidors proxy).12  
* **Permisos Granulars**: Associar llistes de control d'accés (ACLs) directament a cada API Key a la base de dades del servidor, permetent assignar drets d'ús mínims i específics (com rols de lectura exclusiva "read") per evitar l'explotació d'accions destructives si la clau és compromesa.12

## **Disseny de Paginació, Cerques i Filtres**

L'optimització de la transmissió de grans volums de dades cap al frontend requereix de solucions eficients per segmentar la informació de manera coherent i ràpida.12

### **Paginació Basada en Offset**

Aquesta estratègia es basa en la transferència de dades mitjançant dos paràmetres a la consulta: limit (nombre d'elements per pàgina) i offset (quants elements s'han de saltar a la consulta de base de dades).21 El càlcul numèric de l'offset per obtenir la informació d'una pàgina ![][image5] amb una mida de pàgina ![][image6] es defineix com 21:  
![][image7]  
Tot i que aquesta aproximació és molt fàcil d'implementar i permet una navegació intuïtiva per botons amb salts arbitraris (accés aleatori a qualsevol pàgina), presenta dos problemes importants 21:

* **Degradació del Rendiment**: El motor de la base de dades ha de llegir i descartar seqüencialment tots els registres anteriors fins a arribar a l'offset sol·licitat, provocant temps d'execució molt lents i un elevat consum de recursos quan l'offset és molt alt (![][image8]).21  
* **Incongruència en Temps Real**: Si s'insereixen o eliminen elements a la taula mentre l'usuari navega, les pàgines es desplacen, provocant que alguns registres apareguin duplicats o que d'altres es perdin durant el canvi de pàgina.21

### **Paginació Basada en Cursor**

Per a entorns dinàmics o conjunts de dades que requereixen de scroll infinit, la paginació basada en cursor ofereix la solució òptima.21 En lloc de fer salts numèrics, l'aplicació utilitza un cursor (un punter unívoc, seqüencial i sovint opac, com un identificador incremental o una marca de temps d'alta resolució) que fa referència a l'últim element recuperat de la pàgina prèvia.21 La sol·licitud per a la pàgina següent s'executa enviant aquest cursor en un paràmetre (com after) juntament amb la mida de la pàgina.23  
La cerca a la base de dades es tradueix en un filtre directe a través d'un camp indexat (com WHERE id \> cursor\_id), assolint un temps de processament excel·lent i constant de tipus ![][image9].21 Aquesta modalitat és immune a les alteracions dinàmiques del conjunt de dades, ja que la posició de lectura es determina exclusivament per l'element de referència del cursor, impedint l'aparició de dades duplicades o d'elements perduts.21

### **Implementació Segura amb URLSearchParams**

La codificació dinàmica dels paràmetres de cerca en les crides HTTP és un focus de vulnerabilitats i errors de funcionament de l'aplicació frontend.26 No s'ha d'utilitzar mai la interpolació dinàmica de cadenes de text directament sobre la URL de la sol·licitud.26 Un cas emblemàtic és la transmissió de dades codificades en format base64, on caràcters com \+ són erròniament interpretats i substituïts per espais en blanc pels servidors si no s'escapen de forma correcta:

JavaScript  
// APROXIMACIÓ INSEGURA I FRENTE A ERRORS  
const queryUrl \= \`/api/cerca?data=${dadesBase64}\`; // El caràcter '+' es perdrà

// APROXIMACIÓ SEGURA I STANDARD  
const params \= new URLSearchParams();  
params.append('data', dadesBase64); // Codificació automàtica segura del caràcter '+' a '%2B'  
const queryUrl \= \`/api/cerca?${params.toString()}\`;

L'API nativa URLSearchParams ofereix un conjunt robust de mètodes natius com .append(), .set(), .get(), .getAll() o .delete() que s'encarreguen d'escapar automàticament qualsevol caràcter especial abans de transmetre'l a la xarxa.26 Per a la transmissió de paràmetres complexos o estructures d'arrays, es pot emprar una seqüència de claus repetides o mapatges a través de URLSearchParams.28  
Dins del context d'Axios, la serialització de paràmetres dinàmics es pot simplificar mitjançant la propietat de configuració paramsSerializer, la qual permet utilitzar solucions com la llibreria qs per serialitzar objectes complexos o niats sense haver d'escriure codi de parseig manual.2

## **Optimització de la UX, Estats d'Error i Càrrega**

El rendiment d'una aplicació s'ha d'avaluar no només per la velocitat real de transmissió, sinó per la percepció de fluïdesa i el control d'interaccions que es lliura a l'usuari final.8

### **Condicions de Carrera (Race Conditions)**

En desenvolupar elements d'alta interacció, com filtres de cerca asíncrons amb auto-completat, és comú que l'usuari escrigui ràpidament múltiples caràcters, llançant diverses peticions de xarxa en un interval de temps curt.6 Atès que els temps de resposta de les APIs de backend poden variar a causa de la concurrència o l'estat dels servidors, les peticions de xarxa enviades en primer lloc poden trigar més a resoldre's que les sol·licituds que s'han enviat posteriorment.6  
Si no s'implementa un control de seguretat, quan les peticions lentes inicials s'acabin resolent de manera tardana, sobreescriuran les respostes ràpides més recents a la pantalla, presentant dades obsoletes a l'usuari i degradant greument l'experiència d'ús.6

### **Resolució del Problema mitjançant AbortController i temporitzadors**

Per evitar les condicions de carrera, l'aplicació frontend té l'obligació d'avortar de manera activa qualsevol petició anterior que es trobi pendent abans de llançar una nova sol·licitud del mateix àmbit.6 Aquest patró s'implementa emmagatzemant una referència a la instància d'un AbortController actiu.6  
D'altra banda, quan s'utilitzen sistemes de seguretat basats en temps d'espera (timeouts), és recomanable assegurar la neteja de qualsevol temporitzador dinàmic actiu emprant blocs de programació de tipus finally per tal d'evitar fuites de memòria o actualitzacions d'estat inesperades un cop la petició de xarxa ha estat resolta o cancel·lada de manera prèvia 8:

JavaScript  
let darrerController \= null;

function demanarDadesDinamiques(url) {  
  // Avortem qualsevol petició anterior del mateix tipus que estigui en vol  
  if (darrerController) {  
    darrerController.abort();  
  }

  darrerController \= new AbortController();  
  const signal \= darrerController.signal;

  // Establim un control de temps d'espera programat (Timeout)  
  const idTemporitzador \= setTimeout(() \=\> {  
    darrerController.abort();  
  }, 10000); // Timeout de 10 segons

  fetch(url, { signal })  
   .then((resposta) \=\> {  
      if (\!resposta.ok) {  
        throw new Error('Error en rebre les dades');  
      }  
      return resposta.json();  
    })  
   .then((dades) \=\> {  
      actualitzarPantalla(dades);  
    })  
   .catch((error) \=\> {  
      if (error.name \=== 'AbortError') {  
        console.log('Petició cancel·lada correctament per obsoleixença o timeout.');  
      } else {  
        mostrarMissatgeError(error.message);  
      }  
    })  
   .finally(() \=\> {  
      // Netegem el temporitzador de seguretat independentment de si s'ha resolt o fallat  
      clearTimeout(idTemporitzador);  
    });  
}

Aquest tipus de control preventiu s'ha d'incorporar de manera disciplinada en els hooks de cicle de vida dels components del frontend (com les funcions de neteja d'efectes useEffect en React) per tal de netejar i avortar les peticions pendents quan un component es destrueix o es desmunta de la interfície d'usuari, impedint actualitzacions de memòria inútils i evitant fuites de memòria (memory leaks).8

## **Criteris Tècnics per a la Selecció de Fetch**

Tot i les evidents comoditats funcionals que aporta Axios en entorns d'escala empresarial, la Fetch API manté una vigència innegable basada en criteris estrictes d'eficiència, arquitectura de sistemes i rendiment brut.1

### **Pes i Sobrecàrrega del Paquet**

En aplicacions modernes on es persegueix reduir al màxim la mida del codi JavaScript per minimitzar els temps fins que la pàgina esdevé interactiva, cada kilobytes de codi addicional té una repercussió directa.1 Axios requereix l'empaquetament de la seva llibreria a l'aplicació, representant una sobrecàrrega fixa de prop d' ![][image10] de codi compilat i comprimit en xarxa.1  
D'altra banda, Fetch és una interfície disponible de manera nativa en pràcticament la totalitat dels navegadors de l'ecosistema i en entorns de backend moderns (des de Node.js v18, Bun, Deno i runtimes de cloud).1 Escollir Fetch garanteix exactament un cost de ![][image11] d'increment de dependències al paquet de distribució.1

### **Escenaris Preferents per a l'ús de Fetch**

* **Aplicacions de Mida Continguda**: Pàgines d'aterratge (landing pages), llocs web informatius o utilitats senzilles on es fan poques peticions HTTP i no es requereix d'una orquestració complexa de seguretat o cues de retards.1  
* **Entorns Edge Computing i Servidors Serverless**: Entorns amb altes restriccions de recursos de xarxa i on cada mil·lisegon d'arrencada en fred (cold start) és penalitzat pel proveïdor de núvol (com les Cloudflare Workers o les funcions de servei Vercel Edge).1 L'ús de dependències zero és la millor pràctica de rendiment en aquests escenaris.1  
* **Llibreries i Micro-paquets de Distribució**: En desenvolupar llibreries destinades a ser consumides per altres equips de programació, és preferible fer ús de Fetch per evitar forçar els usuaris finals a incloure dependències externes pesades dins de les seves aplicacions.

## **Conclusions**

L'elecció entre Axios i Fetch no respon a una dicotomia de superioritat absoluta, sinó que és una decisió arquitectònica supeditada als objectius de rendiment, complexitat i dimensions del programari en desenvolupament.1  
Per a aplicacions d'escala empresarial, que compten amb múltiples rutes securitzades, fluxos asíncrons complexos amb renovació automàtica de credencials de curta durada davant d'errors 401 Unauthorized, i un desenvolupament que requereix controls rigurosos d'errors i temps d'espera en la comunicació, l'ús d'Axios s'erigeix com la decisió d'enginyeria més sòlida.1 Els seus interceptors de fàbrica i la simplificació en la conversió automàtica de dades redueixen de manera contundent el codi repetitiu, minimitzant les probabilitats de fallades humanes en l'estandardització de la comunicació.1  
En contrast, per a projectes compromesos amb un rendiment de xarxa excepcional, arquitectura serverless o micro-aplicacions orientades a entorns edge que demanen mides de fitxer mínimes i temps d'arrencada instantanis, l'ús de la Fetch API nativa és l'opció indicada per a la transmissió de dades.1 El preu en verbositat s'absorbeix de forma satisfactòria mitjançant dissenys de codi adaptats i embolcalladors optimitzats, assolint així una arquitectura de dependència zero, de gran flexibilitat i amb un consum de xarxa zero per a la descàrrega de clients de tercers.1

#### **Obras citadas**

1. Axios vs Fetch: Which Should You Use in 2026? \- IPRoyal.com, fecha de acceso: junio 11, 2026, [https://iproyal.com/blog/axios-vs-fetch/](https://iproyal.com/blog/axios-vs-fetch/)  
2. Axios vs Fetch: Which HTTP Client to Choose in JS? \- Scrapfly Blog, fecha de acceso: junio 11, 2026, [https://scrapfly.io/blog/posts/axios-vs-fetch](https://scrapfly.io/blog/posts/axios-vs-fetch)  
3. Axios vs Fetch: Why Use Axios When Fetch Already Exists? | by SnappyCoder \- Medium, fecha de acceso: junio 11, 2026, [https://medium.com/@abastin1998/axios-vs-fetch-why-use-axios-when-fetch-already-exists-19dc1d063b53](https://medium.com/@abastin1998/axios-vs-fetch-why-use-axios-when-fetch-already-exists-19dc1d063b53)  
4. Fetch API vs. Axios vs. Alova: Which HTTP Client Should You Use in 2025?, fecha de acceso: junio 11, 2026, [https://www.freecodecamp.org/news/fetch-api-vs-axios-vs-alova/](https://www.freecodecamp.org/news/fetch-api-vs-axios-vs-alova/)  
5. Flyrell/axios-auth-refresh \- GitHub, fecha de acceso: junio 11, 2026, [https://github.com/flyrell/axios-auth-refresh](https://github.com/flyrell/axios-auth-refresh)  
6. How do you abort a web request using \`AbortController\` in JavaScript? \- GreatFrontEnd, fecha de acceso: junio 11, 2026, [https://www.greatfrontend.com/questions/quiz/how-do-you-abort-a-web-request-using-abortcontrollers](https://www.greatfrontend.com/questions/quiz/how-do-you-abort-a-web-request-using-abortcontrollers)  
7. Cancelling Requests with Abortable Fetch \- James Milner, fecha de acceso: junio 11, 2026, [https://www.jameslmilner.com/posts/cancelling-requests/](https://www.jameslmilner.com/posts/cancelling-requests/)  
8. How to cancel a fetch request in JavaScript \- CoreUI, fecha de acceso: junio 11, 2026, [https://coreui.io/answers/how-to-cancel-a-fetch-request-in-javascript/](https://coreui.io/answers/how-to-cancel-a-fetch-request-in-javascript/)  
9. First steps | axios | Promise based HTTP client, fecha de acceso: junio 11, 2026, [https://axios.rest/pages/getting-started/first-steps](https://axios.rest/pages/getting-started/first-steps)  
10. Canceling Fetch Requests in JavaScript with AbortController \- Medium, fecha de acceso: junio 11, 2026, [https://medium.com/@AlexanderObregon/canceling-fetch-requests-in-javascript-with-abortcontroller-98c11d2ab54e](https://medium.com/@AlexanderObregon/canceling-fetch-requests-in-javascript-with-abortcontroller-98c11d2ab54e)  
11. Cancelling In‑Flight Fetch Requests with AbortController \- OpenReplay Blog, fecha de acceso: junio 11, 2026, [https://blog.openreplay.com/cancelling-in-flight-fetch-abortcontroller/](https://blog.openreplay.com/cancelling-in-flight-fetch-abortcontroller/)  
12. Best practices for REST API design \- Stack Overflow, fecha de acceso: junio 11, 2026, [https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/)  
13. Repeating Failed Requests After Token Refresh in Axios Interceptors for React.js Apps, fecha de acceso: junio 11, 2026, [https://medium.com/@sina.alizadeh120/repeating-failed-requests-after-token-refresh-in-axios-interceptors-for-react-js-apps-50feb54ddcbc](https://medium.com/@sina.alizadeh120/repeating-failed-requests-after-token-refresh-in-axios-interceptors-for-react-js-apps-50feb54ddcbc)  
14. Axios interceptor refresh token for multiple requests \- Stack Overflow, fecha de acceso: junio 11, 2026, [https://stackoverflow.com/questions/57890667/axios-interceptor-refresh-token-for-multiple-requests](https://stackoverflow.com/questions/57890667/axios-interceptor-refresh-token-for-multiple-requests)  
15. Handling Concurrent Token Refreshes \- Grasp, fecha de acceso: junio 11, 2026, [https://paths.grasp.study/public-courses/5514b5ac-04e3-432b-8e60-825c91487ddd/modules/d5dc492c-bd15-408e-85f8-3c946cab85d3/lessons/79dfc6c3-5d88-42a1-88bb-d0505ab364e8](https://paths.grasp.study/public-courses/5514b5ac-04e3-432b-8e60-825c91487ddd/modules/d5dc492c-bd15-408e-85f8-3c946cab85d3/lessons/79dfc6c3-5d88-42a1-88bb-d0505ab364e8)  
16. Promises, async/await \- The Modern JavaScript Tutorial, fecha de acceso: junio 11, 2026, [https://javascript.info/async](https://javascript.info/async)  
17. Promise.all() \- JavaScript \- MDN Web Docs, fecha de acceso: junio 11, 2026, [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Promise/all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)  
18. When to Use Async/Await vs Promises in JavaScript \- freeCodeCamp, fecha de acceso: junio 11, 2026, [https://www.freecodecamp.org/news/when-to-use-asyncawait-vs-promises-in-javascript/](https://www.freecodecamp.org/news/when-to-use-asyncawait-vs-promises-in-javascript/)  
19. HTML5 Security \- OWASP Cheat Sheet Series, fecha de acceso: junio 11, 2026, [https://cheatsheetseries.owasp.org/cheatsheets/HTML5\_Security\_Cheat\_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)  
20. OWASP TOP 10: Security Misconfiguration \#5 – CORS Vulnerability and Patch, fecha de acceso: junio 11, 2026, [https://blog.securelayer7.net/owasp-top-10-security-misconfiguration-5-cors-vulnerability-patch/](https://blog.securelayer7.net/owasp-top-10-security-misconfiguration-5-cors-vulnerability-patch/)  
21. Understanding Offset and Cursor-Based Pagination in Node.js \- AppSignal Blog, fecha de acceso: junio 11, 2026, [https://blog.appsignal.com/2024/05/15/understanding-offset-and-cursor-based-pagination-in-nodejs.html](https://blog.appsignal.com/2024/05/15/understanding-offset-and-cursor-based-pagination-in-nodejs.html)  
22. A Developer's Guide to API Pagination: Offset vs. Cursor-Based \- Embedded Blog, fecha de acceso: junio 11, 2026, [https://embedded.gusto.com/blog/api-pagination/](https://embedded.gusto.com/blog/api-pagination/)  
23. GraphQL Pagination: Cursor vs Offset Explained (With Code Examples) | Agility CMS, fecha de acceso: junio 11, 2026, [https://agilitycms.com/blog/graphql-pagination-cursor-vs-offset-explained](https://agilitycms.com/blog/graphql-pagination-cursor-vs-offset-explained)  
24. Limit/Offset Pagination vs. Cursor Pagination in MySQL \- TiDB, fecha de acceso: junio 11, 2026, [https://www.pingcap.com/article/limit-offset-pagination-vs-cursor-pagination-in-mysql/](https://www.pingcap.com/article/limit-offset-pagination-vs-cursor-pagination-in-mysql/)  
25. Offset pagination vs Cursor pagination \- Stack Overflow, fecha de acceso: junio 11, 2026, [https://stackoverflow.com/questions/55744926/offset-pagination-vs-cursor-pagination](https://stackoverflow.com/questions/55744926/offset-pagination-vs-cursor-pagination)  
26. URLSearchParams \- Web APIs \- MDN Web Docs, fecha de acceso: junio 11, 2026, [https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)  
27. Using JavaScript URLSearchParams | megafauna.dev, fecha de acceso: junio 11, 2026, [https://megafauna.dev/posts/urlsearchparams-javascript](https://megafauna.dev/posts/urlsearchparams-javascript)  
28. fetch api \- how to append an array as a search param \- Stack Overflow, fecha de acceso: junio 11, 2026, [https://stackoverflow.com/questions/52105679/fetch-api-how-to-append-an-array-as-a-search-param](https://stackoverflow.com/questions/52105679/fetch-api-how-to-append-an-array-as-a-search-param)  
29. Request config | axios | Promise based HTTP client, fecha de acceso: junio 11, 2026, [https://axios.rest/pages/advanced/request-config](https://axios.rest/pages/advanced/request-config)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKsAAAAYCAYAAACFtg3CAAAE/0lEQVR4Xu2ZW6hWVRDHp7Sy0i5K9VAP4kO+SGXhpZKQgqIiyLQEJQoKK0iMFAuhHupB7EJSUFE9dINKsUDRIAklkMwLqFiBSNhNDaJ7Zvfm75o535z59t7f7P3tQwrrB8P55j97r73WXrPX7RBlMplMJpPJZDLHDtPYvmX7l20z2/GDw0c4le09StdsZTtucHiAh9h+YjvEdoeLZY4NVlDq59/ZHnAxJdLP0ZwJ8wzbs8bHw1H4OKOdK9rJ4o8R3yf1J2zrjb+bbZPx+wUN/4FtmA80ZJ0XGtBGGUcT6NfTnP+H8UGkn6M5UwsUMKVAgym/sr1lfLCN7bDx0UB7jwLtDC/WYDjbx2yfU6fhbVFU37q0UcZQgncW/bivoNSe9432vWjjxY/2cyRnaoFh2icm8Bp+32J8sER0ZYfzFWgveTHA6WzfUEvTRwH4wovqW4c2yhgqzqeUGC87vQoMDGjPY0bTmVZH22g/R3KmNo+yXe40m6z6tWFda7lN9NHi23ssZXoZY9l+Y1vt9CYsYNvLtortIrblop/D9helel0ndrXElCvZ3mT7iu0VFwNVZdzEtpjtRbaRol3ANp9SHW4XTRlFaRT6jNJ9rw8O1+IqSnVa6gMN8f3nfaVJzrQCCvxHft8n/sWd8BFuFl2XEJFGVDGZ0jOf94GGYPqaYPyPqDMt3U8pAVEv/IbdKzGgL1Xvnyv+eQNXVJeBTQlmBcTOFA3Jv1Y0O3KhTHycCq6PvC+P1tm2ox8wymItij6xM1tZf1o9mjN9s4tSgaeI/4j4GBksM0RHR4JII6r4mW2NF/vAtkGxayh9cUVMpO774WMktVSVgWkYMU1WBZpN1pWURn/Lj86v4kFKZc70gT6Yw/YcpQ/Oz3Bl/Wn1aM70BTIehZ1ltHmiYRq1zBId0w6INKIXmA73s22nPneN1HnuBrbrXQxUJZoHo8yf1H19VRljKcV6Jes1ouGYCEsyf30ZT1Ea9S71gZY5SKl+OrqW9afVoznTGJ1+TnK6rj/8S7lVdBxRgEgjomD3ihF+HzU/ATiBUmfq82EY7ZSqRAOLKMX3sN1FnbIsVWXo0Q2ObCzQbLKCx0VXw9FQL7CuxQbKHjEOBQsp1emA+GX9afVozjSiaFf7mvxF8iLWa2eHadyXAaB96sUavEvpbPVsH+iBPSu8kLpfsn7lyofm9xZKsRONppspS1UZqC9ivt7QkJwKTj0U9IMeyE83ehU6wk71gQa8St1LHWyS7LuL9HM0ZxqhmynL3+Y3HvC08QEOw+2DUbGiikC7xIsNeIHS4XR0JPF10eRRbnQ+NmQK9C+Mr5pej04FVWXgzBExO4qMEO1Jo22g7kRDO9GxddAREHVqirZxutHuFO1r8aP9DL9XztQGL0Yr6U0p+iLg44jGa3cbX6e3NnmYBo+aZeC5NxgfCfGd8fVMUY/t7I4cuv2AcSCua1aMGstEryoDIHat8bG7hmY3VBup+D67b6jDbEr33+MDAd5h+8Bpv1Cn3Uqkn6M5E0bXVUXmX+AblEZb/EUcxxMerC8RwzS6k9KaaigO9CNgZHyCOu1BnTxIfI3jHyQK6vyliWlbsUu3Uz0oKwNgY2ffp74fNbCRbRKlDZbqfW9AmMsofXDYmdfhbUp12Cd/UW+/j4n2cyRnMpkBsPyxa+9MC2AUilom87+CM96oZTKZTCaTyWQymcxRxX/AZcEEW0nNhAAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAAZCAYAAAD30ppqAAADV0lEQVR4Xu2YOYgUQRSGnwd432hioGigkYiCIooIhkaKGnhg4BkKCoKgwYqJgoiCihiIBqKBooKCRyII4oEHXom4Bl4g3vf9/q1XM2+eXb3dM02Pu1sf/My8v6aral5XV1UXUSQSiUQikc7ODNYr1h/WFVb32uI2+rHOkfvNNVa32uIKm1jvWZ9Zy01ZV+cYufx9Y20wZZ7S8rybtUfFqAiNjlHeSPH6SDxMYjtA7rPOq/gu67KKGwUJecvqYQs6AMjXQBN/VzEoNc+oeGqCB3k+sY6qGFxnfVUx/pS+xgNvsDVz0JN1j/WEqgn5n5hjjQRmksvDReW9EW+c8krLM6YVe5OB9fB9oYrBRvE9t0zsgXfAmhkYxHpJ6dNdM9nP+sEabwsSwOBFHrYpz8+sdhYoLc9bWNONp2+8H63YB2iWiT9UYn2NJuSHGM36wjpl/EYYy9rBWs/qZcrycoH1jjXCFuTE5qXsPCeCCn7L97UST6oWt7FAfL9MhBoO+ZYp5NrcZwsa5CDrkoqz9MWCJxbrahHLDerCmoz/qmeysvIc5A65CvpK3CLxhMovHHPFXyxxqOGQb/nAOm3NAtBtbzVxe2AaxnKDddZusOphEWsvuTrtjFZWnhPBqMLFw5W3SryJygPzxZ8tcajhkJ/EANYz1g0qJtGoA21jI7XElKWB3TU2WvbmFMkLcn3zT32Zea5hCLkL7Rro155pxl8qPpIEQg2H/DTwuoaZp5Uan1pfU7UP0Kja4kSwYftJxS87mnXk+vNc4mbkufJkaA7LJwYCytrbbWKqtnUAeA+smYOz5N7d69lM6TV0Nbm+4KAqK/7JP2kLcnKI3EDSYBOnb1ZT8uw3cppf6jsq3aVicEZ8Dzoc6tBka9YBXp9w4KEPltLYSa5tffMf07//Iwv9WU9ZV6m+V0t/g2cpb4V4qNdTap6RTN8xK48ddQDxvARvjYq3i1ckm6n23TcEduEnVBw6+MgDlqCb5AZQb1OWBvqh3yzAR3L90UtraXn2R4RJwru05gi5WQCfKMfrhwXrMcrwZNwmd+JUzxNSFI+o+n8eUrFHvZj+sX/AsWoWjpPrR6t8Ir92PwU6Yp67JCutEckHzryzKtKJwBlCVkUikUgkEolEIhHwF8X4OSMzPLuJAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,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>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAYCAYAAADDLGwtAAAAb0lEQVR4XmNgGAW0AolAvAyIbdAlkMF/IFaAsiuBuAohhQD7gPgEEh+kqROJDwefGCCS84FYFk0OA6xigCiGYQwwF4g7kPhyDDgUggS3I/HVoWIY4DsQ5wOxEAMkeECKQGysgAeII4BYDV1iFBAEAH/kFUpSmEldAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAYAAACO5M0mAAAAm0lEQVR4XmNgGAUDAr4C8VsgPgPEgkD8H4gvQWkWmCI3IHYGYiWoxAOYBBAcBeJ/MM4XKN3FAFGIDLqxiDH8xiL4EIsYWOA6FjGsCsOxiD1DFgB5CF1nNFSMA1nwOFTQB8pngvLD4CqgACR4C4gvQ9mgkJBCUQEFIEmQVXiBHwOm+7CCDwwQhVlALI4mhwJcGCC+DgBiRjS5IQUAwkYpjAbGF30AAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAZCAYAAAABmx/yAAAAk0lEQVR4XmNgGHlgHhB/AuL/SPgjEPchK8IHYJpIAowMEE1n0SUIgWwGiEYvdAlC4CUDGc4EAbL8BwIgTSfQBQkBQv5zQheAgdcM+J0JilOsAJ//aoDYEV0QBJgZIJouoksAgSwDbgMZ+hkgkoFo4jOg4hfQxBkWA/EvIP4LxP8YEM4FYRD/DxB/B2IZmIZRMHwAAHK+KZxwnAJJAAAAAElFTkSuQmCC>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAA0CAYAAAA312SWAAAEAUlEQVR4Xu3dy8ttYxgA8OWu3CKSS46B24iRiULJwIRCDEwQA4qUmfIPOAbKxCWJcikShvIHoJAMkIkMDBSJgfvtfdrr7bzn+dZa5/u+vdY+nfP9fvW03udZa6+13/0N1tNaa++v6wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCPFZbkwoyty4Si1V+YJAHvO2SVe7qZP9teUeGgiX9cDuTCzj3NhIf/lwoZtap4AwAblBiPyY1Lt174W647rl22+E1fnQnFiiftycZfiPX2Ui70817l9kgsLis/9u254TkO1ucS+L8pFAGA5cfI9PRe7rSf8Nj+lxM9NvlNf5kK39XjrmNpXNIUX5OKM/siFhf3SDc93qXnWJh0A2JB93fjJN+qPpLw6s8S3Tb4TcdvzcDZs4c9cmMnDJa7LxYWNNWxhap5x+zu7ORcGvFHi71wEAJbzYjd+so96XfdoP47lySUeL/Fvk//Ubxfa/dXx1yUu6SMahe+71Wvr82+nlXi1H1efd6vXR2N4bIm/Dl496sFufE7Vodbv1j8pjzncUOKVEreVuL7ES+0GM5hq2Mbq1dvNON7fqU0+JvZ5Uy4CAMv5sBs/qbcNW82ruMIWDVsV687qx/c2tWjmqvr6O7qtV9hu7VYNXBXPs4X2mE+WeLPJx8RrnsjFZGzO68r7fabE/hLPNbW8zbrWadjCO92qWYumeTu2s08AYEbx4PjYCTjqL6S8yg3bCd1qfcQXfS3GN6YI0bB91Y+ru0vck2qhPWaM72/yMUPzyc/bDW0zh6H9trXzUl7tK3HLRExZt2GLv2P7t5wy9vxa/nwBgJnFCfjiVDu+r7faPK6mtXlt0kKtx3LoFtvtJb7pxz/0y7hV+nQ/ruKLDe0x8vsZk7c7v1vdUm3lbVrxpYGpmDK037b2Y3fwc4FzWKdhaxu17TRt73Zbt4vj588XAFhAPrFHHlfRcq26POVD4/rTH9X7/bJtBn/rl+H3Zhw+6A5s916JO/vx2FWe8FR38LpnU14N1ebwWnfgdm5VjxVNzdSXAHYrfm5lbD5j9ZCftwu5Gctif3H7uoora581OQCwsGtLfFrisbxiGy7sVj8NMvQNybild06qxRW6q1ItNxc1r43aXE4qcVcuzuitZhzP0j1f4soSZzT1TVh6ngDAHhS3CuPqW5UbuFb9YsNuTO13Du3+lz7WlMN5bADgKFabjFjWGHKoB/HHnNttvdq3hNe7Q89hSZuaJwCwR12aCzOK/326Cfnfem3apuYJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAEet/kdnWvz/wi2IAAAAASUVORK5CYII=>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAZCAYAAACclhZ6AAACYElEQVR4Xu2Wv0tWURjHn34YCSU0WNFgDdni4BI4igUNThkNgRGFS+Dg3xC1SItDQ1NIkYMNDRFhkdSmQxAtloNQCmG/MKIflGnP1+e8+rzfe857X/O+NvR+4Av3fJ/nnHPvOfc+94jU+X84wsYGOcHG33JQdV11TdVEsRjLbBTADtVnNtfDkNiNnQvtFtU71Y/VjCzzqmY2AzdUX8TGhIbLosZvWYtDx12sR/XMtatiq9hATzkQWFQtsSn20HjYPPzNxhhXHWYzgD772KwEOsyw6Tgm2VUD8PaTx2xRPVDdFcs/VR5eIfWQoE/1nc0Uc1J5MFDauTvOOxC8PAZUR8N1anew85WI9cnQKZb4hHxmj1jegvNuqn66doqP7hr9MY4vKqiCg64dA3262WR+iSXu5ABxVizvufPw4d527RR+VfFdoP3KeSOqXa4dA4s2xiaT2nZmWizvovPQvuzaMfC93COP56xm/peq12x69kp24BSxPLQvkMf478V76Hs1tKt5VVFAeP4ytokl5FWK02J5XLbhnSeP+cRGoLQ4baorFItxX3IeBsRWnEnlwLvEJhHrBx6JxfA7aKRYjClJL8wqOC6kJgRvxOINHBDzb7Hp2K56zGagVOorze3BCeQhmzEw4As2lfdi1S4FqlDqmINX+INqkgOOb5L/ipfAPZ5kMwUmRocJsQlw3VGWkeWQxFd2VGzH8X/BfwUlPEa7qp/NBLF5CgeT4IdaS86o3rJZC1BmZ9ksGCxY3vmvMHCu2s1mQXRJ/lGrcGrxTqPifWVzM8CxpZXNDdLLRp06/5A/34eZoaNWBXYAAAAASUVORK5CYII=>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAZCAYAAABJhMI3AAADZ0lEQVR4Xu2YS6hNYRTH/16RZ+QV5VVEMpABMVAIMwMGQqIMZIBiYiQplInyTJkQeZSJGJDyJnmFkQF5v9/k/Vj/u/Z3zzrrft8523XPvR7nV6uzv/9a3157r7332t8+QJUq/yqDvPCXMdgLv0tfsS1iG8Q6Ol+MH14QBnjhD+eC2DAv1od10ILMzsZ9xJ6IfayNqMtjsW5m/By6j1hhK81TsW9I5z+Ogo/2sNhdo7VzWm6aQ3fAJDG+in33IrTYLLKHxY+dRGOwWOwENP8y5wvwfGJMFHvvxbww4U0vGsZBY8Y7nVpPp5HuaLoi8kkgqbuRj+xaLxo4p7cXy3EP8WSWcKfuM1qvTIvRBWlfpQl5r2fbQ42P7EbpPs/eeMqLpRgLTXTM6Z7O0LhXRtsu9tmMLSE+xiixa2KHxSY5X6CT2HJoj24tNlLsndh6GxShmdiBbJu9jcfwtuCuIXVcgekoH1PEF+iENt7hmAWNu2I0NvCdZmxJFfERCidJjordN2OyBjq3PQp3NPOw4LF9WhaKjTBj9nHOYXEDPOdylMtTBIPzTLgBjZtvNI5XmrElVsQ9EY1QW+XGS82YLSQ2L0boh4HJ0LnhwnEtaHOlyJuvtvnnmRCL43iu0wKxInJ82WmEb0oby+0FZrwt0/IQi7PHzguZZwnD+HJPZw0toMEfvMMxDRrnlz/U5jgtkCriaacR9lkby6JeNGMuOdgPy8GX30EvChuh+5+X/eaBcR28mMJepRSpGGorvJiRKuJtpxG///PQuNDPYnNiLIG+tGKEHJ+8I4E/9pK8RukJd6D+Vt4B1Xd4MaMH1G8bOu+oWC5qPA47rg9vvGC4hdIX3fPLx8AJV70I/YQq9SbbhfTn4BDofrsarW2mzTTajEyz8A58IXZW7Ag0z5SiiLpMgO6HOWKEt3yePjcVdY8pF8+gE89BeyS3uTYrRT/Ek/GReSB2F7qksW9M9i0uaziPdsj4AvtR8HuLwX75Elp4bq8udteSp6+SM9AL2GjwxNj/GorNKH60Lcy11YsVgHli7atiLILecQ3FJbGTXszgC2avFxuYMUh/hVUULklyLwdywC8hW6yW0M/Sxjg55ma+JiHVr+pLf7FN0L+0uM7jnx2Vhr16uBcbEy5lBnrxL2O0F6pUqfLf8BPwPPSkJWpH1wAAAABJRU5ErkJggg==>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAYCAYAAAChg0BHAAACGElEQVR4Xu2Xz0tVURDHJ3HTPhBcyKMihERcS0EEbawgF5UtWuVCjaKgP6P2bV25cFOL/gaFiFBauXBRiUZgivgTxb7TOaPnTufH3I0gnA988N2ZOeedGR/3vkdUqVTOOV3wmg6eJW/gpA4qLDUhC3AePodP4RM4Bh97Y2zAY2+OZbhHp7X8+g9ch7s+9vmk2sAMPKDTDaea6X9YalLImph88BQ8sNIwBNlPc5HSuSKWRi01IVx/E16HV+Flb+mAD6hcI+QaXiKXe6QTJSyNWmpCvugAmIMDOqi4R+kGNblhfCWXm9CJEpZGLTU5huGsDka4S80Gb8EhOEjukxaSG0Yul8XSqKUmh/Vgehjf/fUOfBfEGWn4ircf3vexxaCuFbyY7/o5LDUppr0W9DD4CXEjuA6RYdz23oEj8Bs8hJ2Tyhbwhi90UGGpScFrOzqYIBzGPuwNchoZRoxP5HJ8Q24FL3qpgwpLTYxxSh84hgxD3GymG+SGwZTyUXjBKx1UWGpiyCPOSvjJ6POvU/+EUrOlfBRe8FoHFbmah7BHBz1tDzRKzfqP/ro7iAm5vZ+Ry+W+4P3HJXKL3upEQK7mAuUPlcvFkCZ4X4Gvj4JrIbW37BHLReFn/m/4E/7wf3+R+/rdpob5QO63Sww+EN/ZLWzDFXLvtQrfk9ubX3NsjdwNke8j0qzI78G/UbZ8LQ+kUqlUKpXK2fIXGwy9P2JVxbIAAAAASUVORK5CYII=>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAYCAYAAABnRtT+AAABvklEQVR4Xu2VzSsGURTGDynJjh0lpWQl2UghkY2PQkhJFkpWsra0t7HyH8iOBQv/AqVkZWFBYuUj+SrinPee4z1z3jtn3pSymF89vXOf58ydM/POnQuQk1M2lahWa/4ltahD1BfqCFWRjEt4gFBL8rhAvUGxlo7vUXeoV/boepk0Qiiu4XE9j+lJecxCdpNC2g3RNdOyBM+oHeMdQ7hrj3EoY3LGa+QcQjZjA02sYI19j1HIrhG8Jk8gZMs2EPogFPQYf4H9OuNrRiB54X5UB6od1at8wmvSywqsQijoNP40+13G19gmL3n8gtpQPiGNtLDaUGPsnaq6KOsQCunuNRPszxlfY5ukFWv/EUGaHGANoYZRZ6gPVPNPZYQlCCfT36SZYn/Q+Brd5DuqQWUWaTLGPoSMFmIUeSe7jT/PPn2e0pAmRY/JOIHXJOHm1RDC36xu/SSb+HilGCdwm4DsvBBuGu+AfQ95b4U9HlcpT/CaWISQ0U6USuyp0XjSeBaZXG+hNP5UYyGtSZkjlpWwDWFy+qUT6NPkQbvUNeoKdYPaQu3yMXm3EBYCvafShIhWM+1mT1xLjebk5OT8R74B1bqQQYZiAWMAAAAASUVORK5CYII=>