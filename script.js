// Tarvittavat globaalit muuttujat
let saldo = 100;
let valittuPanos = 1;
let symbolit = ["images/seiska.png", "images/kirsikka.png", "images/meloni.png","images/päärynä.png", "images/omena.png"]; 
let rullat = document.querySelectorAll(".rulla");
let pelaaNappi = document.getElementById("pelaaNappi");
let panosNapit = document.querySelectorAll(".panosNappi");
let valittuPanosElementti = document.getElementById("valittuPanos");
let saldoMaara = document.getElementById("saldoMaara")
let viesti = document.getElementById("viesti");

let peliTila = {
    lukitutRullat: [],
    uusiKierros: false
};

function paivitaSaldo() {
    saldoMaara.textContent = saldo;
}

function pyoraytaRullia() {
    rullat.forEach((rulla, index) => {
        if (!peliTila.lukitutRullat.includes(index) || peliTila.uusiKierros) {
            let randomIndex = Math.floor(Math.random() * symbolit.length);
            rulla.style.backgroundImage = `url('${symbolit[randomIndex]}')`;
        }
    });
    peliTila.uusiKierros = false;
}

function tarkistaVoitto() {
    let panos = valittuPanos;
    let ekaSymboli = rullat[0].style.backgroundImage;
    let kaikkiSama = true;

    rullat.forEach(rulla => {
        if (rulla.style.backgroundImage !== ekaSymboli) {
            kaikkiSama = false;
        }
    });

    let kaksiSeiska = 0;
    rullat.forEach(rulla => {
        if (rulla.style.backgroundImage === `url('${symbolit[0]}')`) {
            kaksiSeiska++;
        }
    });

    let voitto = 0;
    if (kaikkiSama) {
        if (ekaSymboli.includes(symbolit[0])) {
            voitto = 10 * panos; // Seiskoilla voitto
        } else if (ekaSymboli.includes(symbolit[1])) {
            voitto = 3 * panos; // Kirsikoilla
        } else if (ekaSymboli.includes(symbolit[2])) {
            voitto = 5 * panos; // Meloneilla
        } else if (ekaSymboli.includes(symbolit[3])) {
            voitto = 4 * panos; // Päärynöillä
        } else if ( ekaSymboli.includes(symbolit[4])) {
            voitto = 6 * panos; // Omenoilla
        }
    } else if (kaksiSeiska >= 2) {
        voitto = 5 * panos;
    }

    if (voitto > 0) {
        saldo += voitto;
        viesti.textContent = `Voitit ${voitto} €!`;
    } else {
        viesti.textContent = "Ei voittoa...";
    }

    paivitaSaldo();
}

function lukitseRulla(rulla, index) {
    if (!peliTila.uusiKierros) {
        const rullaIndex = peliTila.lukitutRullat.indexOf(index);
        if (rullaIndex === -1) {
            peliTila.lukitutRullat.push(index);
        } else {
            peliTila.lukitutRullat.splice(rullaIndex, 1);
        }
    
    rulla.classList.toggle("locked");
    }
}

pelaaNappi.addEventListener("click", () => {
    if (valittuPanos > saldo) {
        viesti.textContent = "Ei riitä rahat!"
        return;
    }

    saldo -= valittuPanos;
    paivitaSaldo();

    if (peliTila.lukitutRullat.length > 0) {
        peliTila.uusiKierros = true;
    } else {
        peliTila.lukitutRullat = [];
        rullat.forEach(rulla => {
            rulla.classList.remove("locked");
        });
    }

    pyoraytaRullia();
    tarkistaVoitto();
});

rullat.forEach((rulla, index) => {
    rulla.addEventListener("click", () => {
        lukitseRulla(rulla, index);
    });
});

panosNapit.forEach(nappi => {
    nappi.addEventListener("click", () => {
        valittuPanos = parseInt(nappi.getAttribute("data-panos"));
        valittuPanosElementti.textContent = valittuPanos;
    });
});

paivitaSaldo();