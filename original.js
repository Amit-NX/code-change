/* NEW START */

// Get references to elements
const fromSelect = document.getElementById("from-dropdown");
const toSelect = document.getElementById("to-dropdown");

const from_dubAirport_label = fromSelect.querySelector(".dubAirport_label");
const from_dubCity_label = fromSelect.querySelector(".dubCity_label");
const from_belfast_label = fromSelect.querySelector(".belfast_label");

const to_dubAirport_label = toSelect.querySelector(".dubAirport_label");
const to_dubCity_label = toSelect.querySelector(".dubCity_label");
const to_dubCity_label_options = to_dubCity_label.querySelectorAll("option");
const to_belfast_label = toSelect.querySelector(".belfast_label");

const travelto_option = document.querySelector(".option_to");
const travelfrom_option = document.querySelector(".option_from");

const jp_submit_btn = document.querySelector('button#jpSubmit');
jp_submit_btn.setAttribute('disabled', true);

let from_field_filled = false;
let to_field_filled = false;

const loading_spinner = document.querySelector("#loading_circle_spinner");

let popover_travelto_msg = document.querySelector("#popover_travelto_msg");
let toField_container = document.querySelector(".toField_container");

// Tooltip validation for To Field
if (toSelect.style.cursor === "") {
    toField_container.addEventListener("click", () => {
        popover_travelto_msg.classList.add("open");
        setTimeout(() => {
            popover_travelto_msg.classList.remove("open");
        }, 1900);
    })
}

// Check if both fields are filled
let check_field_filled = () => {
    if (from_field_filled && to_field_filled) {
        jp_submit_btn.removeAttribute('disabled');
        jp_submit_btn.style.cursor = "pointer";
    } else {
        jp_submit_btn.setAttribute('disabled', '');
        jp_submit_btn.style.cursor = "default";
    }
}

// Travel to optgroups and options
let travelTo_airport_optgroup = 
`<optgroup label="Dublin Airport Stops" class="dubAirport_label">
    <option value="IEDUBDFA">Dublin Airport T1 (DUB)</option>
    <option value="IEDUBDFE">Dublin Airport T2 (DUB)</option>
</optgroup>`;

let travelTo_belfast_optgroup = 
`<optgroup label="Belfast Stops (NEW!)" class="belfast_label">
    <option value="GBBFSBEU">Glengall Street (opposite Europa Bus Centre)</option>
</optgroup>`;

let travelTo_dubCity_optgroup = 
`<optgroup label="Dublin City Stops" class="dubCity_label">
    <option value="IEDUBDEW">3Arena (Point Village &amp; Ringsend)</option>
    <option value="IEDUBDAA">Arran Quay (Smithfield &amp; Jameson Distillery)</option>
    <option value="IEDUBDAS">Aston Quay (O'Connell Bridge &amp; Temple Bar)</option>
    <option value="IEDUBSVD">Dublin - City Centre (to/from Belfast only)</option>
    <option value="IEDUBDCH">Custom House Quay (Gardiner Street &amp; Connolly Station)</option>
    <option value="IEDUBDEQ">Eden Quay (O'Connell Street &amp; Marlborough Street)</option>
    <option value="IEDUBDGQ">George's Quay (Tara Street Station)</option>
    <option value="IEDUBDHL">Harcourt Luas (Camden Street &amp; Charlemont Street)</option>
    <option value="IEDUBDHB">Heuston Station (Phoenix Park &amp; Dublin Zoo)</option>
    <option value="IEDUBDMQ">Merchant's Quay (Christ Church Cathedral)</option>
    <option value="IEDUBDMN">Merrion Square (St. Stephen's Green)</option>
    <option value="IEDUBDIF">North Wall Quay (Docklands &amp; Samuel Beckett Bridge)</option>
    <option value="IEDUBDOQ">Ormond Quay Upper (Capel Street)</option>
    <option value="IEDUBDPS">Pearse Station (Pearse Street)</option>
    <option value="IEDUBDHI">Trinity College (College Green &amp; Temple Bar)</option>
    <option value="IEDUBDUQ">Usher's Quay (The Liberties &amp; Guinness Storehouse)</option>
    <option value="IEDUBDWQ">Wellington Quay (Temple Bar &amp; Dublin Castle)</option>
    <option value="IEDUBWRT">Westland Row (Trinity College)</option>
</optgroup>`;

let westland_row = `<option value="IEDUBWRT">Westland Row (Trinity College)</option>`;

// Functions to hide and show travel to groups
function addGroup(el, pos, group) {
    if (!document.querySelector(`#to-dropdown > ${el}`)) {
        toSelect.insertAdjacentHTML(pos, group);
        console.log(`${el} was added!`);
    }
}

function removeGroup(el) {
    if (document.querySelector(`#to-dropdown > ${el}`)) {
        toSelect.querySelector(el).remove();
        console.log(`${el} was removed!`);
    }
}

// val is value of option, el is a reference to the html variable, ref is the option we want to place our new option after.
function addOption(val, el, ref) {
    if (!document.querySelector(`#to-dropdown option[value=${val}]`)) {
        let target_ref = to_dubCity_label.querySelector(ref);
        target_ref.insertAdjacentHTML('afterend', el);
        console.log(`${val} was added!`);
    }
}

function removeOption(val) {
    if (document.querySelector(`#to-dropdown option[value=${val}]`)) {
        console.log('true');
        toSelect.querySelector(`option[value=${val}]`).remove();
        console.log(`${val} was removed!`);
    }
}

function clearAllToGroups() {
    if(document.querySelectorAll("#to-dropdown > optgroup")) {
        document.querySelectorAll("#to-dropdown > optgroup").forEach((optgroup) => {
            optgroup.remove();
            console.log("all optgroups removed");
        })
    }
}

// Add an event listener to the from select element
fromSelect.addEventListener("change", function() {
    // Get the selected from option and its optgroup label
    const from_selectedOption = this.options[this.selectedIndex];
    const from_selectedOptionLabel = from_selectedOption.parentElement;

    // Airports
    if (from_selectedOptionLabel.classList.value === "dubAirport_label") {
        // Clear all groups in travel to
        clearAllToGroups();

        // show belfast stops
        addGroup(".belfast_label", "beforeend", travelTo_belfast_optgroup);

        // show all city stops
        addGroup(".dubCity_label", "beforeend", travelTo_dubCity_optgroup);

        // hide Westland Row
        removeOption("IEDUBWRT");

        // hide Dublin City Centre
        removeOption("IEDUBSVD");
    }

    // City Stops
    if (
        // Show belfast only
        (from_selectedOptionLabel.classList.value === "dubCity_label") && 
        ((from_selectedOption.value === 'IEDUBWRT') || (from_selectedOption.value === 'IEDUBSVD'))
    ) {
        removeGroup(".dubCity_label");
        addGroup(".belfast_label", "beforeend", travelTo_belfast_optgroup);
        removeGroup(".dubAirport_label");
    } else if (from_selectedOptionLabel.classList.value === "dubCity_label") {addGroup
        // Show airports only
        removeGroup(".dubCity_label");      
        removeGroup(".belfast_label");
        addGroup(".dubAirport_label", "beforeend", travelTo_airport_optgroup);
    }

    // Belfast
    if (from_selectedOptionLabel.classList.value === "belfast_label") {
        // Clear all groups in travel to
        clearAllToGroups();

        // Add all city stops
        addGroup(".dubAirport_label", "beforeend", travelTo_airport_optgroup);
        addGroup(".dubCity_label", "beforeend", travelTo_dubCity_optgroup);
        
        // Only show certain stops
        document.querySelectorAll("#to-dropdown > .dubCity_label > option").forEach((stop) => {
            if (stop.value === "IEDUBSVD" || stop.value === "IEDUBWRT") {
              // Show the stop
              stop.style.display = "block";
            } else {
              // Hide the stop
              stop.remove();
            }
          });
    }

    // Reset To Field selected value to 'Travel To'
    toSelect.value = "Travel To";
    to_field_filled = false;

    // Loading spinner icon
    loading_spinner.style.display = "block";
    toSelect.setAttribute("disabled", "");

    setTimeout(() => {
        loading_spinner.style.display = "none";

        toSelect.style.cursor = 'pointer';
        toSelect.removeAttribute("disabled");
    }, 1500)

    // Check if from field is not empty
    if (fromSelect.value !== '') {
        from_field_filled = true;
        }
    check_field_filled();

    // delete popover element if user has chosen a from location
    popover_travelto_msg.remove();

});

// Check if to field is not empty
toSelect.addEventListener('change', () => {
    
    if (toSelect.value !== '' && toSelect.value !== 'Travel To') {
    to_field_filled = true;
    } else if (toSelect.value === 'Travel To' || toSelect.value === '') {
    to_field_filled = false;
    }

    check_field_filled();

})

/* NEW END */