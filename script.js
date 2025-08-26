// Tarvittavat globaalit muuttujat
let saldo = 100;
let valittuPanos = 1;
let symbolit = ["images/kirsikka.png", "images/meloni.png", "images/omena.png", "images/päärynä.png", "images/seiska.png"];
let rullat = document.querySelectorAll(".rulla");
let pelaaNappi = document.getElementById("pelaaNappi");
let panosNapit = document.querySelectorAll(".panosNappi");
let valittuPanosElementti = document.getElementById("valittuPanos");
let saldoMaara = document.getElementById("saldoMaara")
let viesti = document.getElementById("viesti");

function paivitaSaldo() {
    saldoMaara.textContent = saldo;
}

function pyoraytaRullia(lukitut = []) {
    rullat.forEach((rulla, index) => {
        if (!lukitut.includes(index)) {
            let randomIndex = Math.floor(Math.random() * symbolit.length);
            rulla.style.backgroundImage = `url('${symbolit[randomIndex]}')`;
            rulla.classList.remove("locked")
        }
    });
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
        viesti.textContent = "Ei voittoa";
    }

    paivitaSaldo();
}

function lukitseRulla(rulla) {
    let onLukittu = rulla.getAttribute("data-locked") === "true";
    rulla.setAttribute("data-locked", !onLukittu);
    rulla.classList.toggle("locked", !onLukittu);
}

pelaaNappi.addEventListener("click", () => {
    if (valittuPanos > saldo) {
        viesti.textContent = "Ei riitä rahat!"
        return;
    }

    saldo -= valittuPanos;
    paivitaSaldo();

    let lukitutRullat = [];
    rullat.forEach((rulla, index) => {
        if (rulla.getAttribute("data-locked") === "true") {
            lukitutRullat.push(index);
        }
    });

    pyoraytaRullia(lukitutRullat);
    tarkistaVoitto();
});

rullat.forEach(rulla => {
    rulla.addEventListener("click", () => {
        toggleLock(rulla);
    });
});

saldoNapit.forEach(nappi => {
    button.addEventListener("click", () => {
        valittuPanos = parseInt(button.getAttribute("data-panos"));
        valittuPanosElementti.textContent = valittuPanos;
    });
});

paivitaSaldo();