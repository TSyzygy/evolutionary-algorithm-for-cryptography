"use strict";

const // sidebar
  openSidebarButton = document.getElementById("open-sidebar"),
  sidebar = document.getElementById("sidebar"),
  closeSidebarButton = sidebar.querySelector("#close-sidebar"),
  // populations
  populationPageTemplate = document.getElementById("population-page-template"),
  populationPages = document.getElementById("population-pages"),
  populationPagesCollection = populationPages.children,
  populationButtons = sidebar.querySelector("#population-buttons"),
  populationButtonsCollection = populationButtons.children,
  // modal
  openAddPopulationModalButton = document.getElementById(
    "open-add-population-modal"
  ),
  addPopulationModal = document.getElementById("add-population-modal"),
  addPopulationForm = addPopulationModal.querySelector("form"),
  addPopulationMain = addPopulationForm.querySelector("div"),
  closeAddPopulationModalButton = addPopulationForm.querySelector(
    "#close-add-population-modal"
  ),
  addPopulationMenu = addPopulationMain.querySelector("#add-population-menu"),
  newPopulationMenu = addPopulationMain.querySelector("#new-population-menu"),
  openNewPopulationMenuButton = addPopulationMenu.querySelector(
    "#open-new-population-menu"
  ),
  populationModalBackButton = addPopulationForm.querySelector("footer button"),
  messageEntryContainer = newPopulationMenu.querySelector("#messages"),
  addMessageButton = newPopulationMenu.querySelector("#add-message"),
  messageEntryTemplate = newPopulationMenu.querySelector(
    "#message-input-template"
  ),
  maxMessagesAllowed = 12,
  cipherName = newPopulationMenu.querySelector("#cipher-name"),
  cipherSpecificPages = newPopulationMenu.querySelector(
    "#cipher-specific-options"
  ),
  cipherSpecificPagesCollection = cipherSpecificPages.children;

var numMessageInputs = 1,
  currentCipherPage = null;

// sidebar

function openSidebar() {
  sidebar.classList.add("open");
}
openSidebarButton.addEventListener("click", openSidebar);

function closeSidebar() {
  sidebar.classList.remove("open");
}
closeSidebarButton.addEventListener("click", closeSidebar);

// add-population-modal

function openAddPopulationModal() {
  addPopulationMenu.classList.add("open");
  addPopulationModal.classList.add("open");
}
openAddPopulationModalButton.addEventListener("click", openAddPopulationModal);

function closeAddPopulationModal() {
  addPopulationModal.classList.remove("open");
  // Returns it to the main add population menu
  returnToAddPopulationMenu();
}
closeAddPopulationModalButton.addEventListener(
  "click",
  closeAddPopulationModal
);

function returnToAddPopulationMenu() {
  newPopulationMenu.classList.remove("open");
  addPopulationMenu.classList.add("open");
  populationModalBackButton.setAttribute("disabled", "true");
}
populationModalBackButton.addEventListener("click", returnToAddPopulationMenu);

function openNewPopulationMenu() {
  addPopulationMenu.classList.remove("open");
  newPopulationMenu.classList.add("open");
  populationModalBackButton.removeAttribute("disabled");
}
openNewPopulationMenuButton.addEventListener("click", openNewPopulationMenu);

function changeCurrentCipherPage(chosenCipherName) {
  if (currentCipherPage) {
    currentCipherPage.classList.remove("chosen");
    // Removes 'required' attribute from each of the old cipher-specific entry options
    for (let e of currentCipherPage.getElementsByClassName("required-for-cipher")) e.removeAttribute("required");
    /*Array.prototype.forEach.call(
      currentCipherPage.getElementsByClassName("required-for-cipher"),
      (e) => e.removeAttribute("required")
    ); */
  };

  currentCipherPage = cipherSpecificPages.querySelector(
    "[data-cipher-name='" + chosenCipherName + "']"
  );
  if (currentCipherPage) {
    currentCipherPage.classList.add("chosen");
    // Adds 'required' attribute to each of the new cipher-specific entry options
    for (let e of currentCipherPage.getElementsByClassName("required-for-cipher")) e.setAttribute("required", "");
    /*Array.prototype.forEach.call(
      currentCipherPage.getElementsByClassName("required-for-cipher"),
      (e) => e.setAttribute("required", "")
    ); */
  };

  // Scrolls to bottom
  addPopulationMain.scrollTop = addPopulationMain.scrollHeight;
}

cipherName.addEventListener("change", function () {
  changeCurrentCipherPage(this.value);
});

addPopulationForm.addEventListener("reset", function () {
  changeCurrentCipherPage("");
});

addMessageButton.addEventListener("click", function () {
  const messageNum = ++numMessageInputs,
    messageEntry = messageEntryTemplate.content.firstElementChild.cloneNode(
      true
    ),
    messageInput = messageEntry.querySelector("input"),
    lengthDisplay = messageEntry.querySelector("span");

  messageEntry.dataset.messageNum = messageNum;

  messageInput.addEventListener("input", function () {
    lengthDisplay.innerText = String(this.value.length).padStart(4, "0");
  });

  messageEntry.querySelector("button").addEventListener("click", function () {
    this.parentNode.remove();
    if (--numMessageInputs < maxMessagesAllowed) {
      addMessageButton.removeAttribute("disabled");
    }
  });

  messageEntryContainer.appendChild(messageEntry);
  if (numMessageInputs >= maxMessagesAllowed) {
    this.setAttribute("disabled", "true");
  }
});

// Sets up the length counter for the first message input (which is always present)
messageEntryContainer.querySelector("input").addEventListener(
  "input",
  (function () {
    // IIFE
    const lengthDisplay = messageEntryContainer.querySelector("span");
    return function () {
      lengthDisplay.innerText = String(this.value.length).padStart(4, "0");
    };
  })()
);

addPopulationForm.addEventListener("submit", function () {
  const elements = this.elements,
    populationInfo = {
      name: elements.name.value,
      description: elements.description.value,
      config: {
        messages: Array.prototype.map.call(
          this.querySelectorAll("#messages input"),
          (e) => e.value
        ),
        cipher: {
          name: cipherName.value,
          // Collects all the cipher-specific option inputs
          options: Array.prototype.reduce.call(
            currentCipherPage.querySelectorAll("input, select"),
            (t, e) => {
              switch (e.type) {
                case "checkbox":
                  t[e.name] = e.checked;
                  break;
                case "number":
                  t[e.name] = Number(e.value);
                  break;
                case "select-one":
                  t[e.name] = Number(e.value);
                  break;
              }
              return t;
            },
            {}
          ),
        },
        evolution: {
          populationSize: elements["population-size"].value,
          childrenPerParent: elements["children-per-parent"].value,
          randomPerGeneration: elements["random-per-generation"].value,
          allowDuplicates: elements["duplicates-allowed"].checked,
        },
      },
      history: [],
      knownScores: {},
    };

  setupPopulation(populationInfo);

  closeAddPopulationModal();
  this.reset();
});

// TEMPORARY
const startupPopulations = [
  {
    name: "Vigenere test 1",
    description: "one",
    config: {
      messages: [
        "DEYRB UGZWR VEFMY PEOAR GTDHX MGWHR RRQRL GSZVE VVIES UZRTU OEHVR SSLLQ VBCYW YHVRL OEUGV TOTGX DVQWU SBLJN HELFQ ARJLL BIIGK JAEGM QGUTG NQAQC ENRYY VOAIK PNJGC YDRPW VFSOV QOTGK KIAWE TPNIC ZKRZI XUSAW NYEUK XEZWA NKIUE OMQHA TZWWR WTSGN IGZGC ZWYFZ HDNHM GZKRZ GINLO EOGJL RUNZD RTGKD RYABL ROMHE AVDAE CIFOY HKDVN FKTUK QFNZA IJEGW MRBSJ NHELF QANKV NRUNG NKOIL KVFHL FKDRT COEGI EKVFG NMJUX LULXJ SZLNZ MEXKP CDGRV IYGNM YOMHK KSHKL OSGTR DGNUU MNKVI NSVBZ YUIHA UQAAP OBHYA SVGFB LOBHZ UNEHE SHGNM ZEUKL VJTTB QSJOO EEKBU KNAEJ MAYNA EJMAY CEIHI VLOEE UZZGE BVKIW MZTJG VGKJT FFSAX BSRZP RATIE LXVSA EQGVQ ZUAUG EAWET EGTNE KRFIW RUYEP EDVGI OEIYF AVNNH QGROK VKIQG LSOEX VRONX XTPAW HRXAV TZHVV IYSAE EIPNV ZEIVE AQDAL CMNXK IEOYP CAHRO AUZGR XDXRF VWYOD RYONK KICWY GNSWA SASVX QVFIE ERQAG TDZKE CHLNG UPNBK AGDWF LVTUK NHRRC FOPRU AIBTQ NSTOK VYEWO OJZPR ECICO JRWSA OUCGA YDZVQ NFALV TOVZZ OKUCG GMIAJ KUGVT VUWRN LNOAB VLCEV ATYSP NJNIG OYIEL XVKBS CKKGZ NETXV NLVRF ICEOU SZWCJ ASLBB MEIUM VKMFF HTHXI YVXOK HGGAC EAKAF VKRYD TFLOE EKERC OLCIM ASSLL AVYUI KKKIF WJRRZ WSZNE ZAXUD LGVUV GNGTC HEIWZ TUKYH KYTZR RBXOO JCMQK GLNLX UEPDN YIAJS AIBEZ ZHSNI TRBKR ZGINO LSUUC YJREK WLRUV LYKKG UXDVD PJAAH GNMZZ NEIXW FAHNZ GNVGI AEEIC JLTGE ZHZNL VVWVX AHREN RKRBV WVNQL DNTLF NKHRV WHYNE FZMQG CAPZI ZANHG SIXKZ HVWLV WCEFL IYRUU KLXVK HCHTV VTMPC DRNFK IGNQA QOCRQ LRDW",
      ],
      cipher: { name: "vigenere", options: { keylength: 14, n: 1 } },
      evolution: {
        populationSize: 20,
        childrenPerParent: 2,
        randomPerGeneration: 5,
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {},
  },
  {
    name: "Vigenere test 2",
    description: "two",
    config: {
      messages: [
        "DEYRB UGZWR VEFMY PEOAR GTDHX MGWHR RRQRL GSZVE VVIES UZRTU OEHVR SSLLQ VBCYW YHVRL OEUGV TOTGX DVQWU SBLJN HELFQ ARJLL BIIGK JAEGM QGUTG NQAQC ENRYY VOAIK PNJGC YDRPW VFSOV QOTGK KIAWE TPNIC ZKRZI XUSAW NYEUK XEZWA NKIUE OMQHA TZWWR WTSGN IGZGC ZWYFZ HDNHM GZKRZ GINLO EOGJL RUNZD RTGKD RYABL ROMHE AVDAE CIFOY HKDVN FKTUK QFNZA IJEGW MRBSJ NHELF QANKV NRUNG NKOIL KVFHL FKDRT COEGI EKVFG NMJUX LULXJ SZLNZ MEXKP CDGRV IYGNM YOMHK KSHKL OSGTR DGNUU MNKVI NSVBZ YUIHA UQAAP OBHYA SVGFB LOBHZ UNEHE SHGNM ZEUKL VJTTB QSJOO EEKBU KNAEJ MAYNA EJMAY CEIHI VLOEE UZZGE BVKIW MZTJG VGKJT FFSAX BSRZP RATIE LXVSA EQGVQ ZUAUG EAWET EGTNE KRFIW RUYEP EDVGI OEIYF AVNNH QGROK VKIQG LSOEX VRONX XTPAW HRXAV TZHVV IYSAE EIPNV ZEIVE AQDAL CMNXK IEOYP CAHRO AUZGR XDXRF VWYOD RYONK KICWY GNSWA SASVX QVFIE ERQAG TDZKE CHLNG UPNBK AGDWF LVTUK NHRRC FOPRU AIBTQ NSTOK VYEWO OJZPR ECICO JRWSA OUCGA YDZVQ NFALV TOVZZ OKUCG GMIAJ KUGVT VUWRN LNOAB VLCEV ATYSP NJNIG OYIEL XVKBS CKKGZ NETXV NLVRF ICEOU SZWCJ ASLBB MEIUM VKMFF HTHXI YVXOK HGGAC EAKAF VKRYD TFLOE EKERC OLCIM ASSLL AVYUI KKKIF WJRRZ WSZNE ZAXUD LGVUV GNGTC HEIWZ TUKYH KYTZR RBXOO JCMQK GLNLX UEPDN YIAJS AIBEZ ZHSNI TRBKR ZGINO LSUUC YJREK WLRUV LYKKG UXDVD PJAAH GNMZZ NEIXW FAHNZ GNVGI AEEIC JLTGE ZHZNL VVWVX AHREN RKRBV WVNQL DNTLF NKHRV WHYNE FZMQG CAPZI ZANHG SIXKZ HVWLV WCEFL IYRUU KLXVK HCHTV VTMPC DRNFK IGNQA QOCRQ LRDW",
      ],
      cipher: { name: "vigenere", options: { keylength: 14, n: 4 } },
      evolution: {
        populationSize: 20,
        childrenPerParent: 2,
        randomPerGeneration: 5,
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {},
  },
  {
    name: "Subst test 1",
    description: "three",
    config: {
      messages: [
        "AKKHCKUDC N DLI ZUJJUDC KD HZBHE JPZFAKTUJHIJ UC KTH LX HJKABYUJTZHCK UJ SDUCS NHYY AYKTDLST KTH IHWHCK UCWIHAJH UC EUFYDZAKUW KHCJUDC TAJ JUSCURUWACKYP UCWIHAJHE KTH IUJX RDI DLI ASHCKJ UC WDZZLCUWAKUCS NUKT KTHUI TACEYHIJ. NUKT KHYHSIAZ KIARRUW LCEHI HCTACWHE JLFHIMUJUDC BP KTH LX UCKHYYUSHCWH DISACUJAKUDCJ UK UJ AYJD UCWIHAJUCSYP EURRUWLYK RDI KTH ASHCKJ ACE KTHUI TACEYHIJ KD IHFAKIUAKH UCKHYYUSHCWH IHFDIKJ DR ACP JUSCURUWACWH. KTH LJH DR BACXUCS WUFTHIJ UJ CD YDCSHI IHSAIEHE AJ JHWLIH ACE EHJFUKH UKJ DBMUDLJ AEMACKASHJ, KTH HCUSZA UJ KDD MAYLABYH KD LJ KD AYYDN UKJ LJH BHTUCE HCHZP YUCHJ. RDI CDN, NH AIH HCWDLIASUCS DLI ASHCKJ KD LJH A ZUO DR XHPNDIE ACE KIACJFDJUKUDC WUFTHIJ AJ KALSTK UC KTHUI BAJUW KIAUCUCS, JUCWH KTHJH AIH IHYUABYH ACE ED CDK IHGLUIH KTH ASHCKJ KD BH UC FDJJHJJUDC DR ZDIH KTAC A JHIUHJ DR XHP NDIEJ ACE FTIAJHJ, NTUWT KTHP AIH NHYY ABYH KD ZHZDIUJH. AJ KTH GLACKUKP DR JUSCAYJ KIARRUW UCWIHAJHJ NH NUYY CHHE KD IHWDCJUEHI DLI FIDKDWDYJ, BLK RDI CDN U KTUCX DLI RDWLJ JTDLYE BH DC EHMHYDFUCS JHWLIH WDZZLCUWAKUDC WTACCHYJ, NUKT WLK-DLKJ KD UJDYAKH DLI ZDIH MAYLABYH AJJHKJ. U EUJWLJJHE KTUJ UJJLH NUKT ZP WDLCKHIFAIK UC EHFAIKZHCK UT NTD UJ A XHHC WPWYUJK ACE TH ZAEH A IAKTHI UCSHCUDLJ JLSSHJKUDC KTAK NH ZUSTK ZAXH SDDE LJH DR KTH TUKYHI PDLKT. A CLZBHI DR FAIKUHJ TAMH BHHC UCMUKHE KD MUJUK KTH LX DC WPWYUCS KDLIJ ACE TH TAE BHHC WDCJUEHIUCS AJXUCS KTHZ KD IHWDIE UCRDIZAKUDC ABDLK KTH YAPDLK DR ZUYUKAIP ACE UCELJKIUAY YACEZAIXJ AJ FAIK DR TUJ UCKHYYUSHCWH SAKTHIUCS DFHIAKUDC. UK UJ TUSTYP YUXHYP KTAK ACP NAI NUYY UCMDYMH A FIDKIAWKHE BDZBUCS WAZFAUSC ACE LF KD EAKH ZAFJ NUYY BH DR SIHAK MAYLH UC DLI FYACCUCS. RLIKTHIZDIH, KTH WDLCKIPJUEH IDAE YAPDLKJ UC KTH LX AIH CDKDIUDLJ RDI KTHUI UCHRRUWUHCWP ACE ACP UCMAJUDC, NDLYE BH JHMHIHYP TAZFHIHE BP DLI YAWX DR XCDNYHESH DR KIACJFDIK CHKNDIXJ. TH TAE EIARKHE AC AFFAIHCKYP IAKTHI UCCDWLDLJ AIKUWYH RDI KTH CAQU WPWYUJK AJJDWUAKUDC ZASAQUCH NUKT A YUJK DR KTUCSJ KTAK DLI PDLCS WPWYUJKJ ZUSTK RUCE UCKHIHJKUCS: UZFIHJJ DC PDLI ZHZDIP KTH IDAEJ ACE FAKTJ, MUYYASHJ ACE KDNCJ, DLKJKACEUCS WTLIWT KDNHIJ ACE DKTHI YACEZAIXJ JD KTAK PDL NUYY CDK RDISHK KTHZ. ZAXH A CDKH DR KTH CAZHJ, FYAWHJ, IUMHIJ, JHAJ ACE ZDLCKAUCJ. FHITAFJ PDL ZAP BH ABYH KD LKUYUJH KTHJH JDZH KUZH RDI KTH BHCHRUK DR KTH RAKTHIYACE. JTDLYE PDL WDZH KD A BIUESH NTUWT UCKHIHJKJ PDL, HOAZUCH UKJ WDCJKILWKUDC ACE KTH ZAKHIUAYJ LJHE. YHAIC KD ZHAJLIH ACE HJKUZAKH KTH NUEKT DR JKIHAZJ. NAEH KTIDLST RDIEJ JD KTAK PDL NUYY BH ABYH KD RUCE KTHZ UC KTH EAIX. U FIDFDJH KTAK NH WDCJUEHI LJUCS KTHJH AJJHKJ AJ KTH WLK-DLKJ BHKNHHC DLI LCEHIWDMHI ASHCKJ ACE KTHUI TACEYHIJ UC KTH LX ACE DLI WDZZLCUWAKUDCJ CHKNDIX. KTHP AIH IHYAKUMHYP RIHH KD ZDMH AIDLCE KTH WDLCKIP ACE WAC HAJUYP BH KIAUCHE KD LJH EIDF-DRRJ ACE DKTHI JFPWIARK KD AYYDN KTHZ KD WDYYHWK UCKHYYUSHCWH IHFDIKJ ACE FAJJ KTHZ DC. KTH ZAIMHYYDLJ FDJKH IHJKACKH JPJKHZ AYYDNJ LJ KD WDZZLCUWAKH NUKT KTHZ, ACE A JLUKABYH WDEHBDDX NDLYE AYYDN LJ KD KIACJZUK UCJKILWKUDCJ UC FYAUC KHOK NUKT CD IUJX KTAK KTH ZHACUCS WDLYE BH EUJWHICHE BP WDLCKHIUCKHYYUSHCWH DFHIAKUMHJ UC KTH FDJKAY JHIMUWH. U TAMH ACDKTHI KTDLSTK ABDLK TDN NH ZUSTK HOFYDUK KTUJ CHKNDIX RLIKTHI, TDNHMHI U CHHE KD NDIX KTIDLST JDZH ZDIH EHKAUYJ BHRDIH U EUJWLJJ UK NUKT PDL, ACE U NACKHE KD WTHWX KTAK PDL AIH TAFFP RDI ZH KD AYYDWAKH IHJDLIWHJ KD KIAUC A CLZBHI DR TUKYHI PDLKT UC KTH IHGLUIHE JXUYYJ RDI KTUJ DFHIAKUDC. CI.",
      ],
      cipher: { name: "monoalphabetic", options: { n: 4 } },
      evolution: {
        populationSize: 20,
        childrenPerParent: 2,
        randomPerGeneration: 5,
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {},
  },
  {
    name: "Subst test 1b",
    description: "three",
    config: {
      messages: [
        "AKKHCKUDC N DLI ZUJJUDC KD HZBHE JPZFAKTUJHIJ UC KTH LX HJKABYUJTZHCK UJ SDUCS NHYY AYKTDLST KTH IHWHCK UCWIHAJH UC EUFYDZAKUW KHCJUDC TAJ JUSCURUWACKYP UCWIHAJHE KTH IUJX RDI DLI ASHCKJ UC WDZZLCUWAKUCS NUKT KTHUI TACEYHIJ. NUKT KHYHSIAZ KIARRUW LCEHI HCTACWHE JLFHIMUJUDC BP KTH LX UCKHYYUSHCWH DISACUJAKUDCJ UK UJ AYJD UCWIHAJUCSYP EURRUWLYK RDI KTH ASHCKJ ACE KTHUI TACEYHIJ KD IHFAKIUAKH UCKHYYUSHCWH IHFDIKJ DR ACP JUSCURUWACWH. KTH LJH DR BACXUCS WUFTHIJ UJ CD YDCSHI IHSAIEHE AJ JHWLIH ACE EHJFUKH UKJ DBMUDLJ AEMACKASHJ, KTH HCUSZA UJ KDD MAYLABYH KD LJ KD AYYDN UKJ LJH BHTUCE HCHZP YUCHJ. RDI CDN, NH AIH HCWDLIASUCS DLI ASHCKJ KD LJH A ZUO DR XHPNDIE ACE KIACJFDJUKUDC WUFTHIJ AJ KALSTK UC KTHUI BAJUW KIAUCUCS, JUCWH KTHJH AIH IHYUABYH ACE ED CDK IHGLUIH KTH ASHCKJ KD BH UC FDJJHJJUDC DR ZDIH KTAC A JHIUHJ DR XHP NDIEJ ACE FTIAJHJ, NTUWT KTHP AIH NHYY ABYH KD ZHZDIUJH. AJ KTH GLACKUKP DR JUSCAYJ KIARRUW UCWIHAJHJ NH NUYY CHHE KD IHWDCJUEHI DLI FIDKDWDYJ, BLK RDI CDN U KTUCX DLI RDWLJ JTDLYE BH DC EHMHYDFUCS JHWLIH WDZZLCUWAKUDC WTACCHYJ, NUKT WLK-DLKJ KD UJDYAKH DLI ZDIH MAYLABYH AJJHKJ. U EUJWLJJHE KTUJ UJJLH NUKT ZP WDLCKHIFAIK UC EHFAIKZHCK UT NTD UJ A XHHC WPWYUJK ACE TH ZAEH A IAKTHI UCSHCUDLJ JLSSHJKUDC KTAK NH ZUSTK ZAXH SDDE LJH DR KTH TUKYHI PDLKT. A CLZBHI DR FAIKUHJ TAMH BHHC UCMUKHE KD MUJUK KTH LX DC WPWYUCS KDLIJ ACE TH TAE BHHC WDCJUEHIUCS AJXUCS KTHZ KD IHWDIE UCRDIZAKUDC ABDLK KTH YAPDLK DR ZUYUKAIP ACE UCELJKIUAY YACEZAIXJ AJ FAIK DR TUJ UCKHYYUSHCWH SAKTHIUCS DFHIAKUDC. UK UJ TUSTYP YUXHYP KTAK ACP NAI NUYY UCMDYMH A FIDKIAWKHE BDZBUCS WAZFAUSC ACE LF KD EAKH ZAFJ NUYY BH DR SIHAK MAYLH UC DLI FYACCUCS. RLIKTHIZDIH, KTH WDLCKIPJUEH IDAE YAPDLKJ UC KTH LX AIH CDKDIUDLJ RDI KTHUI UCHRRUWUHCWP ACE ACP UCMAJUDC, NDLYE BH JHMHIHYP TAZFHIHE BP DLI YAWX DR XCDNYHESH DR KIACJFDIK CHKNDIXJ. TH TAE EIARKHE AC AFFAIHCKYP IAKTHI UCCDWLDLJ AIKUWYH RDI KTH CAQU WPWYUJK AJJDWUAKUDC ZASAQUCH NUKT A YUJK DR KTUCSJ KTAK DLI PDLCS WPWYUJKJ ZUSTK RUCE UCKHIHJKUCS: UZFIHJJ DC PDLI ZHZDIP KTH IDAEJ ACE FAKTJ, MUYYASHJ ACE KDNCJ, DLKJKACEUCS WTLIWT KDNHIJ ACE DKTHI YACEZAIXJ JD KTAK PDL NUYY CDK RDISHK KTHZ. ZAXH A CDKH DR KTH CAZHJ, FYAWHJ, IUMHIJ, JHAJ ACE ZDLCKAUCJ. FHITAFJ PDL ZAP BH ABYH KD LKUYUJH KTHJH JDZH KUZH RDI KTH BHCHRUK DR KTH RAKTHIYACE. JTDLYE PDL WDZH KD A BIUESH NTUWT UCKHIHJKJ PDL, HOAZUCH UKJ WDCJKILWKUDC ACE KTH ZAKHIUAYJ LJHE. YHAIC KD ZHAJLIH ACE HJKUZAKH KTH NUEKT DR JKIHAZJ. NAEH KTIDLST RDIEJ JD KTAK PDL NUYY BH ABYH KD RUCE KTHZ UC KTH EAIX. U FIDFDJH KTAK NH WDCJUEHI LJUCS KTHJH AJJHKJ AJ KTH WLK-DLKJ BHKNHHC DLI LCEHIWDMHI ASHCKJ ACE KTHUI TACEYHIJ UC KTH LX ACE DLI WDZZLCUWAKUDCJ CHKNDIX. KTHP AIH IHYAKUMHYP RIHH KD ZDMH AIDLCE KTH WDLCKIP ACE WAC HAJUYP BH KIAUCHE KD LJH EIDF-DRRJ ACE DKTHI JFPWIARK KD AYYDN KTHZ KD WDYYHWK UCKHYYUSHCWH IHFDIKJ ACE FAJJ KTHZ DC. KTH ZAIMHYYDLJ FDJKH IHJKACKH JPJKHZ AYYDNJ LJ KD WDZZLCUWAKH NUKT KTHZ, ACE A JLUKABYH WDEHBDDX NDLYE AYYDN LJ KD KIACJZUK UCJKILWKUDCJ UC FYAUC KHOK NUKT CD IUJX KTAK KTH ZHACUCS WDLYE BH EUJWHICHE BP WDLCKHIUCKHYYUSHCWH DFHIAKUMHJ UC KTH FDJKAY JHIMUWH. U TAMH ACDKTHI KTDLSTK ABDLK TDN NH ZUSTK HOFYDUK KTUJ CHKNDIX RLIKTHI, TDNHMHI U CHHE KD NDIX KTIDLST JDZH ZDIH EHKAUYJ BHRDIH U EUJWLJJ UK NUKT PDL, ACE U NACKHE KD WTHWX KTAK PDL AIH TAFFP RDI ZH KD AYYDWAKH IHJDLIWHJ KD KIAUC A CLZBHI DR TUKYHI PDLKT UC KTH IHGLUIHE JXUYYJ RDI KTUJ DFHIAKUDC. CI.",
      ],
      cipher: { name: "monoalphabetic", options: { n: 4 } },
      evolution: {
        populationSize: 20,
        childrenPerParent: 2,
        randomPerGeneration: 5,
        allowDuplicates: true,
      },
    },
    history: [],
    knownScores: {},
  },
  {
    name: "Subst test 2",
    description: "three",
    config: {
      messages: [
        "AKKHCKUDC N DLI ZUJJUDC KD HZBHE JPZFAKTUJHIJ UC KTH LX HJKABYUJTZHCK UJ SDUCS NHYY AYKTDLST KTH IHWHCK UCWIHAJH UC EUFYDZAKUW KHCJUDC TAJ JUSCURUWACKYP UCWIHAJHE KTH IUJX RDI DLI ASHCKJ UC WDZZLCUWAKUCS NUKT KTHUI TACEYHIJ. NUKT KHYHSIAZ KIARRUW LCEHI HCTACWHE JLFHIMUJUDC BP KTH LX UCKHYYUSHCWH DISACUJAKUDCJ UK UJ AYJD UCWIHAJUCSYP EURRUWLYK RDI KTH ASHCKJ ACE KTHUI TACEYHIJ KD IHFAKIUAKH UCKHYYUSHCWH IHFDIKJ DR ACP JUSCURUWACWH. KTH LJH DR BACXUCS WUFTHIJ UJ CD YDCSHI IHSAIEHE AJ JHWLIH ACE EHJFUKH UKJ DBMUDLJ AEMACKASHJ, KTH HCUSZA UJ KDD MAYLABYH KD LJ KD AYYDN UKJ LJH BHTUCE HCHZP YUCHJ. RDI CDN, NH AIH HCWDLIASUCS DLI ASHCKJ KD LJH A ZUO DR XHPNDIE ACE KIACJFDJUKUDC WUFTHIJ AJ KALSTK UC KTHUI BAJUW KIAUCUCS, JUCWH KTHJH AIH IHYUABYH ACE ED CDK IHGLUIH KTH ASHCKJ KD BH UC FDJJHJJUDC DR ZDIH KTAC A JHIUHJ DR XHP NDIEJ ACE FTIAJHJ, NTUWT KTHP AIH NHYY ABYH KD ZHZDIUJH. AJ KTH GLACKUKP DR JUSCAYJ KIARRUW UCWIHAJHJ NH NUYY CHHE KD IHWDCJUEHI DLI FIDKDWDYJ, BLK RDI CDN U KTUCX DLI RDWLJ JTDLYE BH DC EHMHYDFUCS JHWLIH WDZZLCUWAKUDC WTACCHYJ, NUKT WLK-DLKJ KD UJDYAKH DLI ZDIH MAYLABYH AJJHKJ. U EUJWLJJHE KTUJ UJJLH NUKT ZP WDLCKHIFAIK UC EHFAIKZHCK UT NTD UJ A XHHC WPWYUJK ACE TH ZAEH A IAKTHI UCSHCUDLJ JLSSHJKUDC KTAK NH ZUSTK ZAXH SDDE LJH DR KTH TUKYHI PDLKT. A CLZBHI DR FAIKUHJ TAMH BHHC UCMUKHE KD MUJUK KTH LX DC WPWYUCS KDLIJ ACE TH TAE BHHC WDCJUEHIUCS AJXUCS KTHZ KD IHWDIE UCRDIZAKUDC ABDLK KTH YAPDLK DR ZUYUKAIP ACE UCELJKIUAY YACEZAIXJ AJ FAIK DR TUJ UCKHYYUSHCWH SAKTHIUCS DFHIAKUDC. UK UJ TUSTYP YUXHYP KTAK ACP NAI NUYY UCMDYMH A FIDKIAWKHE BDZBUCS WAZFAUSC ACE LF KD EAKH ZAFJ NUYY BH DR SIHAK MAYLH UC DLI FYACCUCS. RLIKTHIZDIH, KTH WDLCKIPJUEH IDAE YAPDLKJ UC KTH LX AIH CDKDIUDLJ RDI KTHUI UCHRRUWUHCWP ACE ACP UCMAJUDC, NDLYE BH JHMHIHYP TAZFHIHE BP DLI YAWX DR XCDNYHESH DR KIACJFDIK CHKNDIXJ. TH TAE EIARKHE AC AFFAIHCKYP IAKTHI UCCDWLDLJ AIKUWYH RDI KTH CAQU WPWYUJK AJJDWUAKUDC ZASAQUCH NUKT A YUJK DR KTUCSJ KTAK DLI PDLCS WPWYUJKJ ZUSTK RUCE UCKHIHJKUCS: UZFIHJJ DC PDLI ZHZDIP KTH IDAEJ ACE FAKTJ, MUYYASHJ ACE KDNCJ, DLKJKACEUCS WTLIWT KDNHIJ ACE DKTHI YACEZAIXJ JD KTAK PDL NUYY CDK RDISHK KTHZ. ZAXH A CDKH DR KTH CAZHJ, FYAWHJ, IUMHIJ, JHAJ ACE ZDLCKAUCJ. FHITAFJ PDL ZAP BH ABYH KD LKUYUJH KTHJH JDZH KUZH RDI KTH BHCHRUK DR KTH RAKTHIYACE. JTDLYE PDL WDZH KD A BIUESH NTUWT UCKHIHJKJ PDL, HOAZUCH UKJ WDCJKILWKUDC ACE KTH ZAKHIUAYJ LJHE. YHAIC KD ZHAJLIH ACE HJKUZAKH KTH NUEKT DR JKIHAZJ. NAEH KTIDLST RDIEJ JD KTAK PDL NUYY BH ABYH KD RUCE KTHZ UC KTH EAIX. U FIDFDJH KTAK NH WDCJUEHI LJUCS KTHJH AJJHKJ AJ KTH WLK-DLKJ BHKNHHC DLI LCEHIWDMHI ASHCKJ ACE KTHUI TACEYHIJ UC KTH LX ACE DLI WDZZLCUWAKUDCJ CHKNDIX. KTHP AIH IHYAKUMHYP RIHH KD ZDMH AIDLCE KTH WDLCKIP ACE WAC HAJUYP BH KIAUCHE KD LJH EIDF-DRRJ ACE DKTHI JFPWIARK KD AYYDN KTHZ KD WDYYHWK UCKHYYUSHCWH IHFDIKJ ACE FAJJ KTHZ DC. KTH ZAIMHYYDLJ FDJKH IHJKACKH JPJKHZ AYYDNJ LJ KD WDZZLCUWAKH NUKT KTHZ, ACE A JLUKABYH WDEHBDDX NDLYE AYYDN LJ KD KIACJZUK UCJKILWKUDCJ UC FYAUC KHOK NUKT CD IUJX KTAK KTH ZHACUCS WDLYE BH EUJWHICHE BP WDLCKHIUCKHYYUSHCWH DFHIAKUMHJ UC KTH FDJKAY JHIMUWH. U TAMH ACDKTHI KTDLSTK ABDLK TDN NH ZUSTK HOFYDUK KTUJ CHKNDIX RLIKTHI, TDNHMHI U CHHE KD NDIX KTIDLST JDZH ZDIH EHKAUYJ BHRDIH U EUJWLJJ UK NUKT PDL, ACE U NACKHE KD WTHWX KTAK PDL AIH TAFFP RDI ZH KD AYYDWAKH IHJDLIWHJ KD KIAUC A CLZBHI DR TUKYHI PDLKT UC KTH IHGLUIHE JXUYYJ RDI KTUJ DFHIAKUDC. CI.",
      ],
      cipher: { name: "monoalphabetic", options: { n: 4 } },
      evolution: {
        populationSize: 50,
        childrenPerParent: 3,
        randomPerGeneration: 0,
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {},
  },
  {
    name: "Hill test 1",
    description: "five",
    config: {
      messages: [
        "DFADDSAEYBOAWRCQYKRFSHWEGRIRYAIXVMCQFTYKDSEVUAMWYRDMCQITDHCPKEIQQFMSRKZHVMOAVZVMFTEADHCPOTSTWCUSVWHHMTWICPLPDHYKRFCJQOWGELYXIKDSEXTBXJQUWYPUEVUFMQOPKXRVQSDHUTTBCACSPJUUDFTBWSJTFOEVVNCJVWUPMJOEVMADUPNDGKNQJPYXSSVWFTDHCJOTLDEUKJHSCQAEHQVVEVUATBADRKWGDHKWTRYEELUMCPRFYKCPUMOFIQOTSTWCTBXLNZPDYXSSVIOPTMEVQSDHUTNNPUEVVNCJVWUPMJSHSTIXNQGOADTBADRKWGDHKWSTCNTMOCUZMHYKLRPDUUNNKWVMACWYNHEFSRTBMKHHEVMJCQUDMTQFFTSTYELQLDWCWYSSSTNNHYMWMVADJTOCVQAEYYVJGBDSQSMWVMSGELEOEYXRYIGBCLHDUPSHYYSHZHMTOEUTYYXXNPTBOBCZICWBCZDBTRUDIUQUSTDHCARVQSTBSURVQSDHUTSHYYQUAGIBMDCOEWLQNNPUQHWPCNYKCPRFMIFSFTUMXRKIVZCPDSEVVNEFYKLPQHTBTBUGTBKWVMMWQUSTSTWBHDUPNNHYRFHXSTWKVNTZEVQSDHUTSHGRTBCNQOMWYKRFNHQYSTVMNNWCFTIAOCMDCOEWLQUMVWFSQHWYSAGHFFVMCOPZOIPBSDDMTZKCWETRCQQUXREVWKNNCPKLNHYKLRZHXRQHDOUUTBXJQUWYSAOIFVFQSGPUTREARFYKOBKXRVXWHXSYDZBPFBOPDUCGJTGHSROAZWSYYYRHOANMGRRFOBINMTMVQFWYSSSTCACSPJUUDFAEOTCJNAPBSAJTQPFBOAUTSHCQDZDFKKRVQYSTGBCLHDUPWCWYUTBXCQSSQOLDVMCQCQEUOIJTITGWOADSFTIXTMTBOBIXTMYUDSDJHBIQUMQKDHUEHRCQYRVWEVWIOBPZDFEVUFQFDHAEYYEUOWMWCPRFVMDFMSAGVZEBSEGMYIWXWYNHVMNPJTUPCBOAVMNNIGGRKXVSPZCPMWCJINGRDHTBKZADPUVDCQJTVMACIOOTGWWBQFSHRVUMVWEVCJTSSGOTRFYKOBUFQFWCSWQFVMWESHSTCALQTBOPWRDFAEANYVFBVMPBMUOASHAJFVJTPZSQVWTBWXXRUFZHSDVWWIILUMVFPZSHRUCQTBADRKWGDHKWYEVMFTTBSUKJQHCPRFJTCQGHVZEXWBQKEXVMDFNNQEPZOERKTBARJOQUXWHXQHLPLDYVDLTBMKGKIXWGANVWDPSHMPADWIEZOERKGRNHNDQUPCZHEITBOARASDNATBHTRVVMFTQYSTVMEAOADSCBYKOBKXVJSDMGFBYKDSEVUAPZDHHXTRAEYYOPTMEVVNTBZJYXMIDHUENNMPMHTBGBYKRFEWBDTSMWHFFTPBPLGKKJSTTSMGRVSDAONHBLCGUPCHKKXEQHWPCNTMCZWFTRKAEVCJHYQHXELDNNBTIXSTDSEXQHVMFTTBUDSSOAUMTMUUUPOPTMEVANATUEHRCQYRQOSYGOCPRFWIYEATCZOEVMZHCQSHXEGHQFXRCJSHRVMGPJMKGWWBXRAWWGFOYXVWTBADSTXRTBCCXBSTQORFMGRVYUQYCBVMFTESIRNNNIDFYLKZRKQSMWNNPUCGWPOAUTYRVWTBMKMRENFOCGFTUMVWHXEVPONNSZPZKAOCVMDFMGAKFVFQHXOPGZTZVMWEWIQKNNHXKKXEEVANYUVFSDKWJLXZFTQOQUUMVWQYPJYRTBVFFTCJEZMGIGMUGRHDUPSHFBFVCQTZEVWYOCYUCPYUOPTMEVGRCZYXSHXEEVUZVMFTSDVWRHOANMMGQCKCTZESTEBXAQHBUUGHDSFTMWUTMGEIOLAGCZJTISRFXRAPLPAEANVWVMWEDFFTGOOFYYLDUPPZDSKCQUEUSTNNOBXRMYDFTZEVOEPUWZQBNQQUSKKGOBVMKXSOLYTRIROCVMDFMGAKFVZGQUDMTZNHTBPUEVAGDSEVMPILHHKXCNWYVMDFMSCAWPBXFTYYTBBJEVWYWCWYUTWCVMEAFBOAUTGRWFSGUDRVPJOBENVDFTQSDHUTNNPUEVVNCJVWUPMJTBVMACOYVWOAENKCGQELIKCPRFHZTZEWILVMCOPZFTPBDFXZPBBFSTTZKCVDQUKXPJPUEVCAPJNQSQVWIKCZWCFVZTTZQHTBLDSHYYLDKXCNDOUMVWHXEVMJURXJJPBWESRKCGVMWESHCARKEACPDSPBWBAQOTFTRNTRUTNNNIWCXREVQYDSEVWIHSPBMTYYCNXRFTMWYRDSMWOSADWIRKCGEUXRSYKCGQELIKADOEVMVMWENNMPEUJTHDUPCAOBYVWWEWBDMPRKCGYYSHNQNNAWJTTBXRAPLPAEWPTBHEEYDSVLWFJTPWTRCQRDCJBWEVYUNNTBMKOANMGRQNISFTCZTSGWOADSFTTBADRKWGDHKWFLFTDFXZMWTBVMRNAUYROFFTKZKWDJRLQUUDVMFTVMOAVZYRYVFBWZIUWEWGFOVLHEIQBWGHHZTZEWILEHTMEVNCCGHFFTTBSGPUCGTRRDRIOAVZOCYUQYSTOBYRFVBPZJTRUSQNISYYYKWFJTODOANNQNKGDSLDSHFFEARDCJKLOAPZNPBTUROPWRTZESRKSYDFFTMWOAENMWSHNQEYANKVDLFTNHGHXYFTMGFBGHDSEVSTWKVNLDMQFVOFOPTMGHOCKJQHCPRFPM",
      ],
      cipher: { name: "hill", options: { m: 2, n: 3 } },
      evolution: {
        populationSize: 20,
        childrenPerParent: 3,
        randomPerGeneration: 20,
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {},
  },
  {
    name: "Hill test 2",
    description: "five",
    config: {
      messages: [
        "DFADDSAEYBOAWRCQYKRFSHWEGRIRYAIXVMCQFTYKDSEVUAMWYRDMCQITDHCPKEIQQFMSRKZHVMOAVZVMFTEADHCPOTSTWCUSVWHHMTWICPLPDHYKRFCJQOWGELYXIKDSEXTBXJQUWYPUEVUFMQOPKXRVQSDHUTTBCACSPJUUDFTBWSJTFOEVVNCJVWUPMJOEVMADUPNDGKNQJPYXSSVWFTDHCJOTLDEUKJHSCQAEHQVVEVUATBADRKWGDHKWTRYEELUMCPRFYKCPUMOFIQOTSTWCTBXLNZPDYXSSVIOPTMEVQSDHUTNNPUEVVNCJVWUPMJSHSTIXNQGOADTBADRKWGDHKWSTCNTMOCUZMHYKLRPDUUNNKWVMACWYNHEFSRTBMKHHEVMJCQUDMTQFFTSTYELQLDWCWYSSSTNNHYMWMVADJTOCVQAEYYVJGBDSQSMWVMSGELEOEYXRYIGBCLHDUPSHYYSHZHMTOEUTYYXXNPTBOBCZICWBCZDBTRUDIUQUSTDHCARVQSTBSURVQSDHUTSHYYQUAGIBMDCOEWLQNNPUQHWPCNYKCPRFMIFSFTUMXRKIVZCPDSEVVNEFYKLPQHTBTBUGTBKWVMMWQUSTSTWBHDUPNNHYRFHXSTWKVNTZEVQSDHUTSHGRTBCNQOMWYKRFNHQYSTVMNNWCFTIAOCMDCOEWLQUMVWFSQHWYSAGHFFVMCOPZOIPBSDDMTZKCWETRCQQUXREVWKNNCPKLNHYKLRZHXRQHDOUUTBXJQUWYSAOIFVFQSGPUTREARFYKOBKXRVXWHXSYDZBPFBOPDUCGJTGHSROAZWSYYYRHOANMGRRFOBINMTMVQFWYSSSTCACSPJUUDFAEOTCJNAPBSAJTQPFBOAUTSHCQDZDFKKRVQYSTGBCLHDUPWCWYUTBXCQSSQOLDVMCQCQEUOIJTITGWOADSFTIXTMTBOBIXTMYUDSDJHBIQUMQKDHUEHRCQYRVWEVWIOBPZDFEVUFQFDHAEYYEUOWMWCPRFVMDFMSAGVZEBSEGMYIWXWYNHVMNPJTUPCBOAVMNNIGGRKXVSPZCPMWCJINGRDHTBKZADPUVDCQJTVMACIOOTGWWBQFSHRVUMVWEVCJTSSGOTRFYKOBUFQFWCSWQFVMWESHSTCALQTBOPWRDFAEANYVFBVMPBMUOASHAJFVJTPZSQVWTBWXXRUFZHSDVWWIILUMVFPZSHRUCQTBADRKWGDHKWYEVMFTTBSUKJQHCPRFJTCQGHVZEXWBQKEXVMDFNNQEPZOERKTBARJOQUXWHXQHLPLDYVDLTBMKGKIXWGANVWDPSHMPADWIEZOERKGRNHNDQUPCZHEITBOARASDNATBHTRVVMFTQYSTVMEAOADSCBYKOBKXVJSDMGFBYKDSEVUAPZDHHXTRAEYYOPTMEVVNTBZJYXMIDHUENNMPMHTBGBYKRFEWBDTSMWHFFTPBPLGKKJSTTSMGRVSDAONHBLCGUPCHKKXEQHWPCNTMCZWFTRKAEVCJHYQHXELDNNBTIXSTDSEXQHVMFTTBUDSSOAUMTMUUUPOPTMEVANATUEHRCQYRQOSYGOCPRFWIYEATCZOEVMZHCQSHXEGHQFXRCJSHRVMGPJMKGWWBXRAWWGFOYXVWTBADSTXRTBCCXBSTQORFMGRVYUQYCBVMFTESIRNNNIDFYLKZRKQSMWNNPUCGWPOAUTYRVWTBMKMRENFOCGFTUMVWHXEVPONNSZPZKAOCVMDFMGAKFVFQHXOPGZTZVMWEWIQKNNHXKKXEEVANYUVFSDKWJLXZFTQOQUUMVWQYPJYRTBVFFTCJEZMGIGMUGRHDUPSHFBFVCQTZEVWYOCYUCPYUOPTMEVGRCZYXSHXEEVUZVMFTSDVWRHOANMMGQCKCTZESTEBXAQHBUUGHDSFTMWUTMGEIOLAGCZJTISRFXRAPLPAEANVWVMWEDFFTGOOFYYLDUPPZDSKCQUEUSTNNOBXRMYDFTZEVOEPUWZQBNQQUSKKGOBVMKXSOLYTRIROCVMDFMGAKFVZGQUDMTZNHTBPUEVAGDSEVMPILHHKXCNWYVMDFMSCAWPBXFTYYTBBJEVWYWCWYUTWCVMEAFBOAUTGRWFSGUDRVPJOBENVDFTQSDHUTNNPUEVVNCJVWUPMJTBVMACOYVWOAENKCGQELIKCPRFHZTZEWILVMCOPZFTPBDFXZPBBFSTTZKCVDQUKXPJPUEVCAPJNQSQVWIKCZWCFVZTTZQHTBLDSHYYLDKXCNDOUMVWHXEVMJURXJJPBWESRKCGVMWESHCARKEACPDSPBWBAQOTFTRNTRUTNNNIWCXREVQYDSEVWIHSPBMTYYCNXRFTMWYRDSMWOSADWIRKCGEUXRSYKCGQELIKADOEVMVMWENNMPEUJTHDUPCAOBYVWWEWBDMPRKCGYYSHNQNNAWJTTBXRAPLPAEWPTBHEEYDSVLWFJTPWTRCQRDCJBWEVYUNNTBMKOANMGRQNISFTCZTSGWOADSFTTBADRKWGDHKWFLFTDFXZMWTBVMRNAUYROFFTKZKWDJRLQUUDVMFTVMOAVZYRYVFBWZIUWEWGFOVLHEIQBWGHHZTZEWILEHTMEVNCCGHFFTTBSGPUCGTRRDRIOAVZOCYUQYSTOBYRFVBPZJTRUSQNISYYYKWFJTODOANNQNKGDSLDSHFFEARDCJKLOAPZNPBTUROPWRTZESRKSYDFFTMWOAENMWSHNQEYANKVDLFTNHGHXYFTMGFBGHDSEVSTWKVNLDMQFVOFOPTMGHOCKJQHCPRFPM",
      ],
      cipher: { name: "hill", options: { m: 2, n: 1 } },
      evolution: {
        populationSize: 20,
        childrenPerParent: 3,
        randomPerGeneration: 20,
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {},
  },
  {
    name: "Hill test 3",
    description: "six",
    config: {
      messages: [
        "TGNRGRWNIMQQKHJGQEFYPSMOKGZQMSWSHQDRFLNHILADBQOEWIXGFLEVNPQMKQIHVLALWWCRRGUGVCLIMYJVRGRPBNCZJQUKTCENOCKXSANMTBLWNISJNGUAOGVMWCJFEQTUZFXUAUDTIZNFOHIBJNBHLKNGKXJEXHSGEURDPDZAVFXCHLIMRKTHCFWQDSAGHFYPRRXNTTCJFSNYSSBIGCMJCKJONEYRIZAFSYGPMLJKJEYMHILBAHQACYZZRVRXBJINWWNIGHAIKKSXFPBNCZJSDQJBRAOXONPXWFCMRLIMKWOVOUHCFLIMRKTHCFWQDXDVYWVXWBUVYOJYOQHEXRZZTHTHQEPYBTUWZEGIVRNONPJXZHANOMIWXSEUFMZCOWOVGSCJZFBFIIXCHEQDTTMHZDPOWGITSQPUNQIXPJUBPYBTZCSCEGTCRBEXKWOLUFCZWAOYOGIMRRKUPAPCSAPCEGOZLXMIWJUSGALFZAENYSREWOQGHIHUDEHAQSIJSCZWKGUETRHVLEZAKWOVOUAVBGGOALUZLJSQIXGZHCFXAGYQVQOKUPBQTXVGSSVDZLPGVCWKVLIMDGJMUSFKLYHEHVLSDQIPWETPIJSHTHQTHDWCHCFCEJBQTYMSXVBLIMKWOVOUMEROJYOJVWSSQIWGILEJAHANNNNYNMIAUZLJSQIXGZUJMRJGGBLAOSWBZTVCKKGKFLBAHHMVTJDKYENFDGGOLUFYMSBEXPJFJZFYTEXHDXAGTQEGVOZFXUAUAGIMVYXGONUZVLFYXEMFINRPXEXUCLIEMSKFXYDDEHCYMDCKCRLRGPWIWILYQVQHYULWXTDJESJHVLCQATBJASYERSMWCUPBSORNANNJXWJUULNAVBOAXSAALPRIFZDPFVLFKUPAPCEJFOWGKXJABXGYYAVGDCKICUUOUWJUQRDKGUXWOJUIFSGBIGAIVABVPQMCWXSAAWGQZZTCHSWBUHCFQPFBVTZXPLIMOWLKNGIWYIYYIMSJZLFYPQOTYQCKPUIHXOGKOFEWKQHELAQBPWFTPXAJMCKJKTINRPNOAFSGERGDBPILFYURSCPNUZZPFGHALIMEOUKVPZXFGGNEZAUJMZAKWMBILFEXHMHFQMPHVLIEEHVLLIMZNRYJVXGZJQFFZBPDZRHFGZPPBKXXTUEAEYPYDALTRKXTTCEVKYRSNKHCSMDWZVKNDYDINOZFWRSYGXWOJIYKNGICWRYTZNFQHJMSXPDZBVBMJZOVXNIWWRPBNHTOOYQRGCOOTBJIYJMKVASLMZBQTUJYXIVMDEHVLKWESPTLDRVKYLIGAMZAGASNVRCBOJNESNETEKUPYIUCFXNXWNANHVLUOHLIMYLTQQTKRXMFCBQUMFINRPNEJSASXLDHILADBGZWBHNGGJIWYHHBHNAGDWLLZTQEYCMKVPHCFRDBDSXMUSZNHQVQHYUQHKHTHYQFGBSHTHTUKEZAOJPUNWZXRJNDWRDHELQCHLTTVRKDXZJPPHBHWMBLSERSAMIPPCNRRNJFERJFLIMOWLMTTECGMDKSHHUIJRIROULHFPYGIGFLOPVGCSUVYWNIKKSHFPUDRXCHRJVXDVLHSHVLLUFDHJFXZMFCIYGZXFPXTIEWXLQNGTHILHTHJZLCDZHSHIUUVXTEZAKYEHHVLIMGLBOBLFLURYTPRZZUCAMKHCFWFNALPXLDYQRKCTQRIXRXFESOPGUJMQITGOJSMDWZVKNDYJQQOTUEAMVYDEWLOGALVPBKCOUWGQLFTIFZLHSDPHYCOPWWKKQYKHFLNGGOUJMURBDOTYHEFVLLAEOXHOAWSNSOHASAPAJMXNJUXYETPQAWWHUICSCMRLIMQEHPJZEYPLIMIAJGOJSMDAKBQVQEVHGUQWHUCZYIYDSGIWBZAENCURGZAMWEUFGUSCWLLWTZHTJJWWXRJRHFXFSQPFXJBOJLGBPAVGEJFRTEGSWOCMCZJBIGJZLKXSHANOGODTIJZFPUEAQKENYHANSHRJAFXGZUUOTOOQDJAOQXZIOHASAPDBXXFSQPFHILIWDFVXRQNVRZUXYQOTSSUHTJHZHOZVHVLLIMGGOOWGAJNLUFIQYAVBYOTDXZCZWEZAJMBLJVHVHETRRGRUJMDTIGDWCKJLKMCJZRLGEYMHCFEZAASYERSMWCUPBCGJDXZJPPLIMKTOHTHGQNJFDCGTUTHQHFHVHXPVJMBLIMKGUXJOSZQSNDMXPWTENPVXAGLLZPCYWKQJKKOWVWPVHGOLIMOSPQLCDKTOZLXMIBWZOXKIEMROAXRJXWOJIYKNGMFKHZBLQOHCFYNBLUFYYGRLGAGATQWXMIANEURYHTHZLPXWOEQCMVNLYNIWUSHCIEMSGEURDXJBWJUTVCAGAJOIMISWIXATRFPLSVFAACDUNLYNEGGXDVXAGEBDVHNQKTUXDUPBMHFXVCYHEQYBWHLTBONFDMZOQOTLIMIQKYURCAYDUNKGZEUWPMJXIVWWKDOTZNFXWOJIYKNGSQSMSXPDZINHHILKEXURYXHDZAFEQABPLSBDEARGOJRGUGVCWIXAJMAZFYQCKPUQYBNOCZKBQDRAOZSBYPHXHNABIZKEOKIBLLZNUZQCWISJZMEGVCMAAYYGWOBVRXDLRGQLVLFZTFMKQGQEWHLXECMSCTCEKLGECLKJXKRXFQRJFRMSCOIZPCNFXFSNLOZLXMIWFUHTHWOWOBTXDVXAGTRBKTRIYFFWRPWFTPXAJMAENLIMWBBSLYPPTQPQKEDRIRQDRPTREGRWNIBFW",
      ],
      cipher: { name: "hill", options: { m: 3, n: 2 } },
      evolution: {
        populationSize: 20,
        childrenPerParent: 3,
        randomPerGeneration: 20,
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {},
    // decrypt key: 21,18,5;25,2,24;14,13,7
  },
  {
    name: "Hill test 4",
    description: "six",
    config: {
      messages: [
        "ENUPJAOKCKZMIOXSUNIAAQNAXHSJFFZTRYIGBAPKMBFBAMAMLIMXXDXRMBSPOOSYCQBMDTEODOGCEGWXXINSMBSPRLQXYSQQDFAWMCJGMXBSRAHQSZQTGYSKHTURLOZTSLLIFOVQJGNXJBQLNJJHKVLCIREAYZFEIEUSJOJUBVJWEDEEGXHBWVANEFRVQEJYGRHHKDVSTATTGTOPLMLZHLDQXTMPXIVERCWLIOSSPPKAKOHKKBOLBCCONQTCHYNOISTWIFZAHTZDDJXHLPRDCGXMBXXSZXHMGKPGWNZNQVVBIREAMRVMCDRBWVANEFRVBFGHRJUFPMQMCZDMXSAHQFKALVPHNSGHPRZNIGNGTLHKABKKZMNVWGOICTMLYVRQAJWELZOVJTVNDHYLAFKHXKFZTGVUWKUMOHLULSWQLXGZTYNAPSWUYLOCRSKTWQQSDCYWIOZUEJKCJNDXEVLKZBGPRHFHADSTNLNNOFWWBPBOTJOLDHXNMRXUGXEVSKUCULDQILQCOVWWMFGCIREADPOHGAEIDXXFUGJSJMTRUUYDFTCFYQBIIFZADIDTPMBCLIPYMLOLMBFBAPMTYFKSQPNSFGTMRKJCLUQKDFPNXTQRMFALWSWNFXTSQGBYHJXWAABAOZQZDZSVGVUZSCIAUNIAHWVOBWIVBMZSTWPQRPXXOIMITMMKIYLHYGNMLHZHAMGXSBGUKBQADUGXTQVCWPGYUSIIENMBOPAWTNSTHYFCDHBYADYNNEYGRXJCYGAMIWKYAMGFVOJXHGBSBYVQBLERASAJBQLSFPVMSTWNTOUIAJSFYKBEVSIASXYOHSLBGTXGFRYDJTELWMJQZVVJIEUSJOJUJABKJHQDDHIUQLAEMHJWJXFVCYJCFJRWKVYCHTXFJVGJMFALAMUYWBHUIMIECFYYRYIGGCCOCTWEYEBMVWJPEJUFFPMWDRQFRAYWFRSQBIXQAQUURMPWXENARGADWIZIGJBYMBSBHLKHLUFGSKYOCUOSIFZANVQCKGIQSFIPOIQAZRJJYZMYBRAMATQXYETWRRMWZRFLRWSPSHKJBBZFTJGXDPNSRBEZZRKYWNEKBEAMJVNHZPBHTLSZFONCYBZZNEOLRRVJBYVQFHALQMLWNPVHPQMEBPMFPQRRELOJELFORBVFKDJEHLUQUKQWVRYZLNDOHYZWNVQUYLHKIXJMJSUDHXZTWBUKOLOPDGEGKBOLBCCONQTCTGVBNPVMLNDHZBSPJRFYRJDNYFGJAUVITSYRPNZEUXEKXUHBCBITLUAKDPSMQNDEINMPHDVKQMKWKWJYLCCDQHMFFPULDJRDXUHBUFJYJILQXHEMQRUMVGHHLQSNFTTMEYUVBYFWBWIVIEOQSHHLDJLPYJHIQGBQJCFUMBFBMDQCVZFSFSBAJTHVQVVBRJLMKNEPCBQKKXEQNFCLUJQFUNIAGDOWTSSGXFFONBZMNJBXHCKFERACQQZIJPHCHXHZGYVOADLNRHYLMBJVKZVWNZRJDOYNBQKBFHJCIPAVXYCNZHGZDPYWQTYBMUQCHUDPDTVDDUSHRJKHGALKXENAIINASASCIFZAIOKUZPGFDIXPVUFAZAUTXNWHYTSXMFTCYXGYYMQOCZPCEYGGWPFHNVQUPPSHTHDWINAEQYNUTINQPCTMLPTZDPYWNHXPOAEZUTKPJCQBWQQSUUYDFRVLJXFVRGADHERWBXSHLQSMPMBCFFIUHQSBQLCJNWNCBOTTHQVUGHUWPVUSDHSHGWMFAGQWULWURONOENZBYGJSUXCZGJAGBZVOEQWIDOJDMPKYSZVSJXXKLXKDQSOKJVBTMFALCPDEDILAQVIBYWKQRPTJFFZDQVVBRZGLDXQJENZBFOEBYFCJTBSEHSLBOUQAUNYKPAJDLOHAJYFQXAWHVKPIEURCTTDXZPTFBQFOLBLOONRARBVFOCDDELSONCVMWWNKIZUVGEMNYWUEPXHJEXOBLCLIRVVGKGTGEBPLNMMXKSEGNDLBSNJTBCZPKHSJBOTTHQVUGHUWNUMOLNWSTNLECDRBPMDHPZERSZRSLBGRPOZVPQBMZJJXVZLCMRWESFQBQYOMZRPTTCHNWFKWJXFVBRGXJZDVVDJAJDWFHDTOIREAMRVMCDRBWVANEFRVWPXEBEAMVADDVTHHOAAQKCZMIFZAHHDCNVPLHYUQJLHUVLDWFVRIQBOZTQVCBWZKEBRYCDRBCRWYNCKWRCCAYMHMVRLGMLUNZHNMUKLQGDGZNOMFDOJDATWBXZMVNJPMDSIQVKSYPQMEAYBEPEQOJISHITENTBDJXVNSIXMTOAEZQJEAEARWMBFBRAPREXITLDNLTXFETNBTJQQSTDXXTWDNWGIIFKBSOAAQKCZMWOPGEGJXIHOIIQLCFTXSGKBGDVKHCGYQAZSNVKSYRHFHDRGUELGGFXNOONRAFNHXIGSJDEHHGTEBOIEXLMVEQFMXSFDBWVEUHERWHSLBVJUZWXKKDIUFCAQQBLYEKBOLBCCONQTCFDHKNJXEWPKENFOUDLPTQBBMYKZQFPVEZZVBDPYWDOGCAXADKDJEEYFSQGCGRLEKRMQKYZXFHHDCNVPLFUELBWYXWXCKNPVMVOJXSNOWWMGBMHCKMSSKHTXFJVIBZLXMLPFCVLBTCSWIPLRRYLUVMFSWEYXSTTGQWPFKUVEGNFGFSZMAFRBYTHMZKPXKVGLNCJMQVKPIVTHHBFTHPSUCRJWHHTXSKNONNPGQUBKEXAWHDHWHGRESVKXUOLSXDUSHKGNKFBIDIFZAUUFH",
      ],
      cipher: { name: "hill", options: { m: 4, n: 3 } },
      evolution: {
        populationSize: 20,
        childrenPerParent: 3,
        randomPerGeneration: 20,
        allowDuplicates: false,
      },
    },
    history: [],
    knownScores: {},
    // encrypt key: 14,9,21,8;18,0,1,5;17,15,11,18;0,18,25,14
    // decrypt key: 15,2,7,4;17,22,4,7;2,10,0,25;0,18,25,14
  }
]

if (true) {
  startupPopulations.forEach(setupPopulation);
}