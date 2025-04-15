!function(){"use strict";class e{constructor(e,t){this.id=e,this.dropdownElement=document.getElementById(e),this.selectedElement=this.dropdownElement.querySelector(".dropdown-selected"),this.optionsElement=this.dropdownElement.querySelector(".dropdown-options"),this.selectedTextElement=this.dropdownElement.querySelector(".dropdown-text"),this.selectedIconElement=this.dropdownElement.querySelector(".dropdown-icon"),this.onChange=t||(()=>{}),this.setupEventListeners()}setupEventListeners(){this.selectedElement.addEventListener("click",(e=>{e.stopPropagation(),this.toggle()}));this.optionsElement.querySelectorAll(".dropdown-option").forEach((e=>{e.addEventListener("click",(t=>{t.stopPropagation(),this.selectOption(e)}))})),document.addEventListener("click",(()=>{this.close()}))}toggle(){document.querySelectorAll(".dropdown-options").forEach((e=>{e!==this.optionsElement&&e.classList.remove("show")})),document.querySelectorAll(".dropdown-selected").forEach((e=>{e!==this.selectedElement&&e.classList.remove("active")})),this.optionsElement.classList.toggle("show"),this.selectedElement.classList.toggle("active")}close(){this.optionsElement.classList.remove("show"),this.selectedElement.classList.remove("active")}selectOption(e){const t=e.dataset.value,s=e.querySelector("span").textContent;let a=e.querySelector("img")?.src;if("btDropdown"===this.id&&!a){const t=e.dataset.value;""===t?a="images/body_types/body_type_all.png":"bt1"===t?a="images/body_types/body_type_female.png":"bt2"===t?a="images/body_types/body_type_male.png":"bt4"===t&&(a="images/body_types/body_type_male_strong.png")}this.selectedTextElement.textContent=s,this.selectedIconElement.src=a,this.selectedIconElement.alt=s,this.selectedElement.dataset.value=t,this.optionsElement.querySelectorAll(".dropdown-option").forEach((e=>{e.classList.toggle("selected",e.dataset.value===t)})),this.close(),this.onChange(t,s,a)}setValue(e){const t=this.optionsElement.querySelector(`.dropdown-option[data-value="${e}"]`);t&&this.selectOption(t)}getValue(){return this.selectedElement.dataset.value}updateOptions(e){this.optionsElement.innerHTML="",e.forEach((e=>{const t=document.createElement("div");t.className="dropdown-option",t.dataset.value=e.id,"raceDropdown"===this.id?t.innerHTML=`\n          <img src="${e.icon}" alt="${e.name}" class="dropdown-icon">\n          <span>${e.name} (${void 0!==e.count?e.count:0})</span>\n        `:t.innerHTML=`\n          <span>${e.name} (${void 0!==e.count?e.count:0})</span>\n        `,t.addEventListener("click",(e=>{e.stopPropagation(),this.selectOption(t)})),this.optionsElement.appendChild(t)}))}}class t{constructor(e,t){this.modalElement=document.getElementById("raceModal"),this.gridElement=document.getElementById("raceGrid"),this.confirmButton=document.getElementById("confirmRaceBtn"),this.skipButton=document.getElementById("skipRaceBtn"),this.selectedRace="",this.onSelect=e||(()=>{}),this.onSkip=t||(()=>{}),this.setupEventListeners()}setupEventListeners(){this.confirmButton.addEventListener("click",(()=>{this.selectedRace&&(this.onSelect(this.selectedRace),this.hide())})),this.skipButton.addEventListener("click",(()=>{this.onSkip(),this.hide()}))}populateRaces(e){this.gridElement.innerHTML="",e.filter((e=>""!==e.id)).forEach((e=>{const t=document.createElement("div");t.className="race-option",t.dataset.race=e.id,t.innerHTML=`\n        <img src="${e.icon}" alt="${e.name}" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E${e.name.charAt(0)}%3C%2Ftext%3E%3C%2Fsvg%3E';">\n        <div class="race-name">${e.name}</div>\n      `,t.addEventListener("click",(()=>{document.querySelectorAll(".race-option").forEach((e=>{e.classList.remove("active")})),t.classList.add("active"),this.selectedRace=e.id,this.confirmButton.disabled=!1})),this.gridElement.appendChild(t)}))}show(){this.modalElement.style.display="flex",this.selectedRace="",this.confirmButton.disabled=!0,document.querySelectorAll(".race-option").forEach((e=>{e.classList.remove("active")}))}hide(){this.modalElement.style.display="none"}}function s(e){return{dragonborn:"Dragonborn",drow:"Drow",dwarf:"Dwarf",elf:"Elf",githyanki:"Githyanki",gnome:"Gnome","half-elf":"Half-Elf",halfling:"Halfling","half-orc":"Half-Orc",human:"Human",tiefling:"Tiefling"}[e]||e}function a(e){try{const t=new URL(e).searchParams.get("n");return t?decodeURIComponent(t):decodeURIComponent(e.split("/").pop().split("?")[0])}catch(t){return e.split("/").pop().split("?")[0]}}function n(e,t,s){s.textContent=t,s.className=`status ${e}`,s.style.display="block",setTimeout((()=>{s.style.display="none"}),5e3)}const o={"":"images/races/150px-Race_Human.png",dragonborn:"images/races/150px-Race_Dragonborn.png",drow:"images/races/150px-Race_Drow.png",dwarf:"images/races/150px-Race_Dwarf.png",elf:"images/races/150px-Race_Elf.png",githyanki:"images/races/150px-Race_Githyanki.png",gnome:"images/races/150px-Race_Gnome.png","half-elf":"images/races/150px-Race_Half-Elf.png",halfling:"images/races/150px-Race_Halfling.png","half-orc":"images/races/150px-Race_Half-Orc.png",human:"images/races/150px-Race_Human.png",tiefling:"images/races/150px-Race_Tiefling.png"},i={"":{name:"All Types",icon:"images/body_types/body_type_all.png"},bt1:{name:"BT1 - Female",icon:"images/body_types/body_type_female.png"},bt2:{name:"BT2 - Male",icon:"images/body_types/body_type_male.png"},bt4:{name:"BT4 - Male - Strong",icon:"images/body_types/body_type_male_strong.png"}},r="selectedHeadPresets",l="headPresetState",c="hasVisitedBefore";class d{constructor(e){this.modListElement=document.getElementById("modList"),this.onSelectionChange=e||(()=>{}),this.currentSelections={}}renderMods(e){this.saveCurrentSelections(),this.modListElement.innerHTML="",0!==e.length?e.forEach((e=>{const t=document.createElement("label");t.className="mod-card",t.dataset.id=e.id;const a=s(e.race),n=o[e.race]||"images/races/150px-Race_Human.png",i={bt1:"Female",bt2:"Male",bt4:"Male - Strong"}[r=e.bodyType]||r.toUpperCase();var r;const l=this.currentSelections[e.id]?"checked":"",c=e.originalLink?`<a href="${e.originalLink}" class="original-link" target="_blank" title="View original mod" onclick="event.stopPropagation();">\n            <i class="fas fa-external-link-alt"></i>\n          </a>`:"";t.innerHTML=`\n        <input type="checkbox" value="${e.downloadUrl}" ${l} />\n        <div class="image-container">\n          <img src="${e.imagePath}" alt="${e.displayName}" />\n          ${c}\n        </div>\n        <div class="content">\n          <div class="title">${e.displayName}</div>\n          <div class="badges-container">\n            <div class="badges">\n              <div class="badge race-badge" style="background-image: url(${n}); background-size: 12px; background-repeat: no-repeat; background-position: 5px center; padding-left: 22px;">\n                ${a}\n              </div>\n              <div class="badge body-type-badge">\n                ${e.bodyType.toUpperCase()} - ${i}\n              </div>\n            </div>\n            <div class="badge-link-wrapper">\n              <div class="badge link-badge">\n                <a href="https://bg3.wiki" target="_blank" onclick="event.stopPropagation();">\n                  <i class="fas fa-info-circle"></i> Plus d'infos\n                </a>\n              </div>\n            </div>\n          </div>\n        </div>\n      `;t.querySelector("input[type=checkbox]").addEventListener("change",(()=>{this.saveCurrentSelections(),this.onSelectionChange(this.currentSelections)})),this.modListElement.appendChild(t)})):this.modListElement.innerHTML='\n        <p style="grid-column: 1/-1; text-align: center; padding: 2rem;">\n          No presets found matching these criteria.\n        </p>'}saveCurrentSelections(){this.currentSelections={},this.modListElement.querySelectorAll(".mod-card input[type=checkbox]:checked").forEach((e=>{const t=e.closest(".mod-card").dataset.id;this.currentSelections[t]=!0}))}applySelections(e){e&&(this.modListElement.querySelectorAll(".mod-card").forEach((t=>{const s=t.dataset.id;if(e[s]){const e=t.querySelector("input[type=checkbox]");e&&(e.checked=!0)}})),this.saveCurrentSelections(),this.onSelectionChange(this.currentSelections))}selectAll(e){this.modListElement.querySelectorAll(".mod-card input[type=checkbox]").forEach((t=>{t.checked=e})),this.saveCurrentSelections(),this.onSelectionChange(this.currentSelections)}getSelectedUrls(){return[...this.modListElement.querySelectorAll("input[type=checkbox]:checked")].map((e=>e.value))}getSelectedCount(){return Object.keys(this.currentSelections).length}}class h{constructor(){this.downloadProgressElement=document.getElementById("downloadProgress"),this.progressBarElement=document.getElementById("progressBar"),this.downloadedCountElement=document.getElementById("downloadedCount"),this.totalCountElement=document.getElementById("totalCount"),this.progressStatusElement=document.getElementById("progressStatus"),this.statusMessageElement=document.getElementById("statusMessage"),this.generateBtnElement=document.getElementById("generateBtn"),this.isGenerating=!1}async generatePack(e){if(!this.isGenerating){if(this.isGenerating=!0,0===e.length)return n("error","Please select at least one preset to generate your pack.",this.statusMessageElement),void(this.isGenerating=!1);try{this.downloadedCountElement.textContent="0",this.totalCountElement.textContent=e.length,this.progressBarElement.style.width="0%",this.progressStatusElement.textContent="Initializing download...",this.downloadProgressElement.style.display="block",this.generateBtnElement.disabled=!0;const t=new JSZip,s=t.folder("Collection_Heads_Based");let o=[],i=0;for(const t of e)try{this.progressStatusElement.textContent=`Downloading ${a(t)}...`;const n=await fetch(t);if(!n.ok)throw new Error("Failed to fetch");const o=await n.blob();let r;const l=new URL(t).searchParams.get("n");r=l?decodeURIComponent(l):decodeURIComponent(t.split("/").pop().split("?")[0]),s.file(r,o),i++,this.downloadedCountElement.textContent=i;const c=i/e.length*100;this.progressBarElement.style.width=`${c}%`}catch(e){console.error("Error fetching",t,e),o.push(t),this.progressStatusElement.textContent=`Failed to download ${a(t)}`,await new Promise((e=>setTimeout(e,1e3)))}this.progressStatusElement.textContent="Finalizing your pack...";const r=await t.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:5},onUpdate:e=>{const t=Math.round(e.percent);this.progressBarElement.style.width=`${t}%`}});this.progressStatusElement.textContent="Download ready!",saveAs(r,"Collection_Heads_Based.zip"),o.length>0?n("error",`${o.length} file(s) could not be downloaded.`,this.statusMessageElement):n("success","Your pack has been generated successfully!",this.statusMessageElement)}catch(e){console.error("Error generating pack:",e),n("error","An error occurred while generating the pack.",this.statusMessageElement)}finally{setTimeout((()=>{this.downloadProgressElement.style.display="none",this.generateBtnElement.disabled=!1,this.isGenerating=!1}),2e3)}}}}const p=[{id:"daenerys",name:"daenerys",displayName:"Daenerys Head Preset - JUSTFORTEST",race:"human",bodyType:"bt1",imagePath:"images/head-a.jpg",downloadUrl:"https://f.rpghq.org/zmEqUzvCM0ih.zip?n=Daenerys%20Head%20Preset%202.0.0.zip"},{id:"aurora",name:"aurora_elf",displayName:"Aurora Head Preset - ELF",race:"elf",bodyType:"bt1",imagePath:"images/Aurora-ELF.webp",downloadUrl:"https://f.rpghq.org/ae6HiGBnKRI3.pak?n=Elf_F%20-%20Violet's%20Preset%201%20Aurora%20%5BDONE%5D.pak"},{id:"aurora",name:"aurora_half-elf",displayName:"Aurora Head Preset - HALF-ELF",race:"half-elf",bodyType:"bt1",imagePath:"images/Aurora-HELF.webp",downloadUrl:"https://f.rpghq.org/OltCbM5oJgZa.pak?n=Helf_F%20-%20Violet's%20Preset%201%20Aurora%20%5BDONE%5D.pak"},{id:"akira",name:"akira-human",displayName:"Akira - Head Preset - HUMAN",race:"human",bodyType:"bt1",imagePath:"images/Akira.png",downloadUrl:"https://f.rpghq.org/cDZ6IFLjonhd.pak?n=Human_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"},{id:"akira",name:"akira-tiefling",displayName:"Akira - Head Preset - TIEFLING",race:"tiefling",bodyType:"bt1",imagePath:"images/Akira.png",downloadUrl:"https://f.rpghq.org/yU47qaW2y4nR.pak?n=Tiefling_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"},{id:"akira",name:"akira-drow",displayName:"Akira - Head Preset - DROW",race:"drow",bodyType:"bt1",imagePath:"images/Akira.png",downloadUrl:"https://f.rpghq.org/jTSJty89eKG8.pak?n=Drow_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"},{id:"akira",name:"akira-elf",displayName:"Akira - Head Preset - ELF",race:"elf",bodyType:"bt1",imagePath:"images/Akira.png",downloadUrl:"https://f.rpghq.org/j8SoFD5kJmAs.pak?n=Elf_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"},{id:"akira",name:"akira-half-elf",displayName:"Akira - Head Preset - HELF",race:"half-elf",bodyType:"bt1",imagePath:"images/Akira.png",downloadUrl:"https://f.rpghq.org/aMU9lzKwqGYE.pak?n=Helf_F%20-%20-%3D%3BAkira%3B%3D-%20%5BDONE%5D.pak"}];var m=new class{constructor(){this.mods=[],this.filteredMods=[],this.availableRaces=[]}async loadMods(){try{try{const e=await fetch("mods.json");if(!e.ok)throw new Error("Failed to load mods data");this.mods=await e.json()}catch(e){console.log("Using embedded mods data instead of fetch due to:",e.message),this.mods=p}return this.filteredMods=[...this.mods],this.identifyAvailableRaces(),this.mods}catch(e){throw console.error("Error loading mods:",e),e}}identifyAvailableRaces(){this.availableRaces=[{id:"",name:"All Races",icon:"images/races/150px-Race_Human.png",count:this.mods.length}];const e={};this.mods.forEach((t=>{t.race&&(e[t.race]=(e[t.race]||0)+1)}));for(const t in e)e[t]>0&&this.availableRaces.push({id:t,name:s(t),icon:`images/races/150px-Race_${this.capitalizeRaceName(t)}.png`,count:e[t]});return this.availableRaces.sort(((e,t)=>""===e.id?-1:""===t.id?1:e.name.localeCompare(t.name))),this.availableRaces}capitalizeRaceName(e){return e.split("-").map((e=>e.charAt(0).toUpperCase()+e.slice(1))).join("-")}filterMods(e,t,s){const a=e.toLowerCase();return this.filteredMods=this.mods.filter((e=>{const n=e.name.toLowerCase().includes(a),o=""===t||e.race===t,i=""===s||e.bodyType===s;return n&&o&&i})),this.filteredMods}getFilterCounts(){const e={};this.mods.forEach((t=>{e[t.race]=(e[t.race]||0)+1}));const t={};return this.mods.forEach((e=>{t[e.bodyType]=(t[e.bodyType]||0)+1})),{raceCounts:e,btCounts:t}}getAvailableRaces(){return this.availableRaces}getAllMods(){return this.mods}getFilteredMods(){return this.filteredMods}};var g=new class{saveStateToStorage(e,t,s){const a={searchQuery:e,raceFilter:t,btFilter:s};localStorage.setItem(l,JSON.stringify(a))}saveSelectedModsToStorage(e){localStorage.setItem(r,JSON.stringify(e))}loadStateFromStorage(){const e=localStorage.getItem(l);return e?JSON.parse(e):null}loadSelectedModsFromStorage(){const e=localStorage.getItem(r);return e?JSON.parse(e):null}hasVisitedBefore(){return!!localStorage.getItem(c)}setVisitedBefore(){localStorage.setItem(c,"true")}clearStorage(){localStorage.removeItem(l),localStorage.removeItem(r)}};class u{constructor(){this.searchInput=document.getElementById("searchInput"),this.modCount=document.getElementById("modCount"),this.selectionCounter=document.getElementById("selectionCounter"),this.selectedCountElement=document.getElementById("selectedCount"),this.statusMessage=document.getElementById("statusMessage"),this.generateBtn=document.getElementById("generateBtn"),this.modList=new d(this.handleSelectionChange.bind(this)),this.raceDropdown=new e("raceDropdown",this.handleRaceChange.bind(this)),this.btDropdown=new e("btDropdown",this.handleBodyTypeChange.bind(this)),this.raceModal=new t(this.handleRaceSelect.bind(this),this.handleRaceSkip.bind(this)),this.downloadManager=new h,this.currentFilters={search:"",race:"",bodyType:""},this.setupEventListeners(),this.initializeApp()}async initializeApp(){try{await m.loadMods(),this.modList.renderMods(m.getFilteredMods()),this.setupRaceModal(),this.updateFilterDropdowns(),this.updateModCount(),this.loadStateFromStorage(),n("success",`${m.getAllMods().length} head presets loaded successfully!`,this.statusMessage),g.hasVisitedBefore()||(this.raceModal.show(),g.setVisitedBefore())}catch(e){console.error("Error initializing app:",e),n("error","Error loading presets. Please refresh the page.",this.statusMessage)}}setupEventListeners(){this.searchInput.addEventListener("input",(()=>{this.currentFilters.search=this.searchInput.value,this.filterMods(),this.saveStateToStorage()})),this.generateBtn.addEventListener("click",function(e,t){let s;return function(){for(var a=arguments.length,n=new Array(a),o=0;o<a;o++)n[o]=arguments[o];s&&clearTimeout(s),s=setTimeout((()=>{e.apply(this,n),s=null}),t)}}((()=>{const e=this.modList.getSelectedUrls();this.downloadManager.generatePack(e)}),1e3)),document.querySelector('button[onclick="selectAll(true)"]').addEventListener("click",(e=>{e.preventDefault(),this.modList.selectAll(!0)})),document.querySelector('button[onclick="selectAll(false)"]').addEventListener("click",(e=>{e.preventDefault(),this.modList.selectAll(!1)})),document.querySelector('button[onclick="clearStorage()"]').addEventListener("click",(e=>{e.preventDefault(),this.clearStorage()}))}handleSelectionChange(e){const t=Object.keys(e).length;this.selectedCountElement.textContent=t,t>0?this.selectionCounter.classList.add("show"):this.selectionCounter.classList.remove("show"),this.updateModCount(),g.saveSelectedModsToStorage(e)}handleRaceChange(e){this.currentFilters.race=e,this.filterMods(),this.saveStateToStorage()}handleBodyTypeChange(e){this.currentFilters.bodyType=e,this.filterMods(),this.saveStateToStorage()}handleRaceSelect(e){e&&(m.getAvailableRaces().find((t=>t.id===e)),this.raceDropdown.setValue(e))}handleRaceSkip(){}filterMods(){const e=m.filterMods(this.currentFilters.search,this.currentFilters.race,this.currentFilters.bodyType);this.modList.renderMods(e),this.updateModCount();const t=g.loadSelectedModsFromStorage();t&&this.modList.applySelections(t)}updateModCount(){const e=m.getAllMods().length,t=m.getFilteredMods().length,s=this.modList.getSelectedCount();this.modCount.textContent=`Showing ${t} of ${e} presets (${s} selected)`}setupRaceModal(){const e=m.getAvailableRaces();this.raceModal.populateRaces(e)}updateFilterDropdowns(){const e=m.getAvailableRaces();this.raceDropdown.updateOptions(e);const{btCounts:t}=m.getFilterCounts(),s=Object.keys(i).map((e=>({id:e,name:i[e].name,icon:i[e].icon,count:""===e?m.getAllMods().length:t[e]||0})));this.btDropdown.updateOptions(s)}saveStateToStorage(){g.saveStateToStorage(this.currentFilters.search,this.currentFilters.race,this.currentFilters.bodyType)}loadStateFromStorage(){const e=g.loadStateFromStorage();e&&(e.searchQuery&&(this.searchInput.value=e.searchQuery,this.currentFilters.search=e.searchQuery),e.raceFilter&&(this.raceDropdown.setValue(e.raceFilter),this.currentFilters.race=e.raceFilter),e.btFilter&&(this.btDropdown.setValue(e.btFilter),this.currentFilters.bodyType=e.btFilter),(e.searchQuery||e.raceFilter||e.btFilter)&&this.filterMods());const t=g.loadSelectedModsFromStorage();t&&setTimeout((()=>{this.modList.applySelections(t)}),300)}clearStorage(){g.clearStorage(),this.searchInput.value="",this.currentFilters={search:"",race:"",bodyType:""},this.raceDropdown.setValue(""),this.btDropdown.setValue(""),this.filterMods(),this.updateFilterDropdowns(),n("success","All filters and selections have been cleared.",this.statusMessage)}}document.addEventListener("DOMContentLoaded",(()=>{window.app=new u})),window.selectAll=e=>window.app.modList.selectAll(e),window.clearStorage=()=>window.app.clearStorage()}();
