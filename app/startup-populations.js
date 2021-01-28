"use strict";

// TEMPORARY
const startupPopulations = [
  {
    name: "Test 1 - short",
    description: "",
    config: {
      messages: [
        "PPHKLXETAGOTLJGODXRO",
        "HRETWPKMQUJEBMKEIMIK"
      ],
      cipher: { name: "otp", options: { n: 4 } },
      evolution: {
        populationSize: "20",
        childrenPerParent: "5",
        randomPerGeneration: "0",
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {}
  },
  {
    name: "Test 2 - full",
    description: "From here: https://www.cipherchallenge.org/forums/topic/one-time-pad/#post-53003",
    config: {
      messages: [
        "PPHKLXETAGOTLJGODXRODJBSJQGYGXJLGTKSGPHBTFEJSDXKEESUWLDDPVCVPKPZQMGFAEFTQLUKSBEJLHHHSKZFXNOYIDGMQOICSMZQQIUFYQBGCEZXVDJTBOGTXDRPWRIDTORXABUGDGIRGGBYHYRIRIJEKTLOMKIMKERZHFGZVCMOORRAMIHIRERZCPLCYFJKWPQRSHKTQIHBAYZXLBZOUJZRXNYBGIEVWJUXBSTOGWABQHGHPUCRISHTSTHDCCRAWABIZPEOWQVOBJYYSCNUUPYUFOVBZAOSCSODBKWGWRRVUQQRHDVHTJYSLGZRHWAKWYWTNPITYMPCQSRUKAHSJLKCZYEIDOEDVAHFIQGHNYODMLOTWANYAGXIHUVSNMGVLKYHBJTNUSVFFAFNKNMBMZPCN",
        "HRETWPKMQUJEBMKEIMIKXNEEMHOZIETHUNQFKTKWPERUSDTRDTWJIARUGMOSLDCRFTHPMOJTRHWDEIYUKUCQNRFGRJDGFOABXJCMPNRPBUUPRHMKXOGFCFJEJFWPKGRPMGPGCKHBTFPVUPIIKBQSBFEJQQCENZWDUWIXUOVXSMMVACYCYRWCAQOGICTCKWXJGIVPVQQUNYXJBMHDIIXDLYJQRTGECARZHPPCHMFDRCUPJHIXDRXNPRUDQGVRPDQTVEEFBZVNNZEPCURLANGYFOPVUBLRPVAEUMJZHAUDAKQUBHLKBSFLEGYJCFDSXDCXHUULMIAWDJXESREIEWQCGECWCFLGMMEDTXFCMSFSDWTSZWAXCIZEJIJANPAWLWTFMCAEBKMZFUUYVPVAPPDCPTLVXOMROVANDAUH"
      ],
      cipher: { name: "otp", options: { n: 4 } },
      evolution: {
        populationSize: "20",
        childrenPerParent: "5",
        randomPerGeneration: "0",
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {}
  },
];

if (true) startupPopulations.forEach((p) => { if (p.include !== false) setupPopulation(p) });
