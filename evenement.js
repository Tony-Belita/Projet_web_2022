module.exports = class evenement{

    //constructeur
    constructor(nom,date,listeHeure,pseudo,id) {
        this._nom = nom;
        this._date = date;
        this._listeHeure = listeHeure;
        this._listeParticipant = [];
        this._listeRefus = [];
        this._createur = pseudo;
        this._id = id;
    }

    // Getters
    get nom() {
        return this._nom;
    }

    get id(){
        return this.id;
    }

    get date() {
        return this._nom;
    }

    get listeHeure() {
        return this._listeHeure;
    }

    get listeParticipant() {
        return this._listeParticipant ;
    }

    get listeRefus() {
        return this._listeRefus;
    }

    createur() {
        return this._createur;
    }


    //Setters

    // ajouter un participant qui accepte
    ajouterParticipant(pseudo,heure){
        //console.log("evenement : "+this.listeParticipant);
        this._listeParticipant.push({pseudo,heure});
        //console.log("evenement : "+this.listeParticipant);
    }

    //ajouter un participant qui refuse
    ajouterParticipantNeg(pseudo,heure){
        //console.log("evenement : "+this.listeRefus);
        this._listeRefus.push({pseudo,heure});
        //console.log("evenement : "+this.listeRefus);
    }

    //cloturer
    cloturer(){

    }

}