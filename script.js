// Tarvittavat globaalit muuttujat
let saldo = 100;
let valittuPanos = 1;
let symbolit = ["/413-projekti/images/seiska.png", "/413-projekti/images/kirsikka.png", "/413-projekti/images/meloni.png","/413-projekti/images/päärynä.png", "/413-projekti/images/omena.png"]; 
let rullat = document.querySelectorAll(".rulla");
let pelaaNappi = document.getElementById("pelaaNappi");
let panosNapit = document.querySelectorAll(".panosNappi");
let valittuPanosElementti = document.getElementById("valittuPanos");
let saldoMaara = document.getElementById("saldoMaara")
let viesti = document.getElementById("viesti");

let lukitutRullat = [];
let viimeksiVoitto = false;
let viimeksiLukittu = false;

// Saldon päivitys
function paivitaSaldo() {
    saldoMaara.textContent = saldo;
}

//Rullien pyöritys
function pyoraytaRullia() {
    rullat.forEach((rulla, index) => {
        if (!lukitutRullat.includes(index)) {
            let randomIndex = Math.floor(Math.random() * symbolit.length);
            rulla.style.backgroundImage = `url('${symbolit[randomIndex]}')`;
        }
    });
}

//Voittotarkistus
function tarkistaVoitto() {
    let panos = valittuPanos;
    let ekaSymboli = rullat[0].style.backgroundImage;
    let kaikkiSama = true;

    rullat.forEach(rulla => {
        if (rulla.style.backgroundImage !== ekaSymboli) {
            kaikkiSama = false;
        }
    });

    let seiskat = 0;
    rullat.forEach(rulla => {
        const kuvaRulla = rulla.style.backgroundImage;
        console.log(`Rulla: ${kuvaRulla}`)
        if (kuvaRulla.includes(symbolit[0])) {
            seiskat++;
        }
    });

    console.log(`Seiskoja kierroksella ${seiskat}`);

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
    } else if (seiskat === 3) {
        voitto = 5 * panos;
    }

    if (voitto > 0) {
        saldo += voitto;
        if (seiskat === 3) {
            viesti.textContent = `Voitit ${voitto} €!`
        } else {
            viesti.textContent = `Voitit ${voitto} €!`;
        }
        viimeksiVoitto = true;
        lukitutRullat = [];
        rullat.forEach(rulla => {
            rulla.classList.remove("locked");
        });
        viimeksiLukittu = false;
    } else if (lukitutRullat.length > 0) {
        viesti.textContent = "Ei voittoa, et voi lukita.";
        viimeksiLukittu = true;
        viimeksiVoitto = false;
    } else {
        viesti.textContent = "Ei voittoa, voit lukita.";
        viimeksiLukittu = false;
        viimeksiVoitto = false;
    }

    paivitaSaldo();
}

//Rullien lukitsemisen mahdollisuuden tarkistus
function lukitseRulla(rulla, index) {
    if (!viimeksiVoitto && !viimeksiLukittu) {
        if (!lukitutRullat.includes(index)) {
            lukitutRullat.push(index);
            rulla.classList.add("locked");
        } else {
            lukitutRullat = lukitutRullat.filter(item => item !== index);
            rulla.classList.remove("locked");
        }
    }
}

//Pelaa-napin toiminto
pelaaNappi.addEventListener("click", () => {
    if (valittuPanos > saldo) {
        viesti.textContent = "Ei riitä rahat!"
        return;
    }

    saldo -= valittuPanos;
    paivitaSaldo();

    if (viimeksiLukittu) {
        lukitutRullat = []
        rullat.forEach(rulla => {
            rulla.classList.remove("locked");
        });
        viimeksiLukittu = false;
    }

    pyoraytaRullia();
    tarkistaVoitto();
});

//Rullien lukitseminen
rullat.forEach((rulla, index) => {
    rulla.addEventListener("click", () => {
        if (!viimeksiVoitto && !viimeksiLukittu) {
            lukitseRulla(rulla, index);
        }
    });
});

//Panos-napin toiminto
panosNapit.forEach(nappi => {
    nappi.addEventListener("click", () => {
        valittuPanos = parseInt(nappi.getAttribute("data-panos"));
        valittuPanosElementti.textContent = valittuPanos;
    });
});

//Alustus
paivitaSaldo();