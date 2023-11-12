class Ucionica{
    constructor(ime_ucionice, kapacitet_ucionice){
        this.ime_ucionice = ime_ucionice;
        this.kapacitet_ucionice = kapacitet_ucionice;
    }
}

class Termin{
    constructor(dan, vrijeme) {
        this.dan = dan;
        this.vrijeme = vrijeme;
    }
}

class Profesor {
    constructor(ime_prezime, lista_predmeta_koje_predaje) {
        this.ime_prezime = ime_prezime;
        this.lista_predmeta_koje_predaje = lista_predmeta_koje_predaje;
    }

    dodajPredmet(noviPredmet) {
        this.lista_predmeta_koje_predaje.push(noviPredmet);
    }
}

class Predmet{
    constructor(ime_predmeta, lista_profesora_koji_predaju){
        this.ime_predmeta = ime_predmeta;
        this.lista_profesora_koji_predaju = lista_profesora_koji_predaju;
    }
}

class Razred {
    constructor(ime, broj_ucenika, lista_predmeta_koje_slusaju, broj_casova_koji_moraju_imati) {
        this.ime = ime;
        this.broj_ucenikaime = broj_ucenika;
        this.lista_predmeta_koje_slusaju = lista_predmeta_koje_slusaju;
        this.broj_casova_koji_moraju_imati = broj_casova_koji_moraju_imati;
    }
}

class Cas{
    constructor(profesor, termin, ucionica, razred, predmet) {
        this.ucionica = ucionica;
        this.razred = razred;
        this.predmet = predmet;
        this.profesor = profesor;
        this.termin = termin;
    }
}

class Raspored{
    constructor(casovi){
        this.casovi = casovi;
    }
    dodajCas(noviCas) {
        this.casovi.push(noviCas);

        // fali logika da provjerimo da li smo poremetili neki od uslova
        // tipa ako dodamo ovaj cas sve je zadovoljeno, ali je to osmi cas tom razredu
    }

    ispitajValidnostTrenutnogRaspored(){
        // logiku cu ja uraditi
        // prvi korak je da provjerimo da li imamo preklopa
        // drugi korak je da provjerimo je li ima neki razred ili profesor viska/manjka casova
        // treci korak je da provjerimo da li neki profesor ili razred ima pauze
    }

    generisiRaspored(){
        // i ovu cu logiku ja uraditi
        // treba naizmjenicno raditi - dodajCas i ispitajValidnostTrenutnogRaspored na osnovu ovog sto imamo
        // ako nije validno rjesenje, onda pokusavamo sa drugim casom
    }
}
